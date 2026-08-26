"""
Starz Cosmic Oracle — FastAPI backend
========================================
The precision astrology engine that powers the mobile app. Runs the Swiss
Ephemeris under the hood so every chart is astronomically exact, then layers
Sabian symbols, Arabic Lots, and a plain-English "slang" interpretation on
top — plus mundane (world/event) predictions.

Routes:
  GET  /api/health           -> health check
  GET  /api/cities            -> list of selectable birth cities
  POST /api/chart             -> full natal chart + reading + personal predictions
  POST /api/reading/ai        -> Claude-written personalized report (needs ANTHROPIC_API_KEY)
  GET  /api/world             -> mundane/world predictions for the current astrological year

The React Native app calls this over HTTP (see src/api/ephemerisEngine.ts) and
falls back to its built-in offline approximations if this service is
unreachable, per the project's AI-fallback convention.
"""

from __future__ import annotations

from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import ephemeris
import cities
import interpret
import mundane
from arabic_parts import compute_lots

app = FastAPI(title="Starz Cosmic Oracle Engine", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class BirthData(BaseModel):
    year: int = Field(..., ge=1, le=2100)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    hour: int = Field(12, ge=0, le=23)
    minute: int = Field(0, ge=0, le=59)
    city: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    tz_offset: Optional[float] = Field(None, ge=-14, le=14)
    name: Optional[str] = None


class AIRequest(BirthData):
    voice: str = "easy street slang"
    question: Optional[str] = None


def _resolve_place(data: BirthData) -> tuple[float, float, float]:
    if data.city:
        found = cities.lookup(data.city)
        if not found:
            raise HTTPException(400, f"Unknown city '{data.city}'. Pick from /api/cities or send coordinates.")
        lat, lon, tz = found
        if data.tz_offset is not None:
            tz = data.tz_offset
        return lat, lon, tz
    if data.latitude is None or data.longitude is None:
        raise HTTPException(400, "Provide either a 'city' or 'latitude'+'longitude'.")
    tz = data.tz_offset if data.tz_offset is not None else 0.0
    return data.latitude, data.longitude, tz


def _build_everything(data: BirthData):
    lat, lon, tz = _resolve_place(data)
    chart = ephemeris.compute_chart(data.year, data.month, data.day, data.hour, data.minute, tz, lat, lon)

    bodies = {b["name"]: b["longitude"] for b in chart["bodies"]}
    angles = chart["angles"]
    sun = next(b for b in chart["bodies"] if b["name"] == "Sun")
    is_day = sun["house"] in (7, 8, 9, 10, 11, 12)

    lots = compute_lots(
        asc=angles["Ascendant"]["longitude"], mc=angles["Midheaven"]["longitude"],
        sun=bodies["Sun"], moon=bodies["Moon"], venus=bodies["Venus"],
        mars=bodies["Mars"], mercury=bodies["Mercury"], is_day_chart=is_day,
    )
    transits = ephemeris.compute_transits(chart)
    reading = interpret.generate_reading(chart, lots, transits)
    return chart, lots, transits, reading


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "starz-cosmic-oracle-engine"}


@app.get("/api/cities")
def get_cities():
    return {"cities": cities.list_cities()}


@app.post("/api/chart")
def post_chart(data: BirthData):
    chart, lots, transits, reading = _build_everything(data)
    return {
        "name": data.name,
        "birth": {"date": f"{data.year:04d}-{data.month:02d}-{data.day:02d}", "time": f"{data.hour:02d}:{data.minute:02d}"},
        "chart": chart,
        "lots": lots,
        "transits": transits,
        "reading": reading,
    }


@app.post("/api/reading/ai")
def post_ai(data: AIRequest):
    chart, lots, transits, _reading = _build_everything(data)
    return interpret.llm_reading(chart, lots, transits, voice=data.voice, question=data.question)


@app.get("/api/world")
def get_world(year: Optional[int] = None):
    return mundane.world_forecast(year)
