"""
Starz Cosmic Oracle — Core Ephemeris Engine
============================================
Uses the Swiss Ephemeris (pyswisseph) to compute exact positions of the
planets, asteroids, angles and houses for any birth moment on Earth.

This is the "engine room": deterministic astronomy math. Every prediction,
report and chart in the app is built on top of the numbers produced here.

No external data files are required — we fall back to the built-in Moshier
model (FLG_MOSEPH), which is accurate to well within a fraction of a degree
for all modern dates.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Optional

import swisseph as swe

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

SIGN_GLYPHS = {
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋",
    "Leo": "♌", "Virgo": "♍", "Libra": "♎", "Scorpio": "♏",
    "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓",
}

SIGN_ELEMENT = {
    "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
    "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
    "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
    "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water",
}

SIGN_MODE = {
    "Aries": "Cardinal", "Cancer": "Cardinal", "Libra": "Cardinal", "Capricorn": "Cardinal",
    "Taurus": "Fixed", "Leo": "Fixed", "Scorpio": "Fixed", "Aquarius": "Fixed",
    "Gemini": "Mutable", "Virgo": "Mutable", "Sagittarius": "Mutable", "Pisces": "Mutable",
}

BODIES = [
    ("Sun", swe.SUN, "☉"),
    ("Moon", swe.MOON, "☽"),
    ("Mercury", swe.MERCURY, "☿"),
    ("Venus", swe.VENUS, "♀"),
    ("Mars", swe.MARS, "♂"),
    ("Jupiter", swe.JUPITER, "♃"),
    ("Saturn", swe.SATURN, "♄"),
    ("Uranus", swe.URANUS, "♅"),
    ("Neptune", swe.NEPTUNE, "♆"),
    ("Pluto", swe.PLUTO, "♇"),
    ("North Node", swe.MEAN_NODE, "☊"),
    ("Chiron", swe.CHIRON, "⚷"),
]

ASPECTS = [
    ("Conjunction", 0.0, 8.0, "major"),
    ("Opposition", 180.0, 8.0, "major"),
    ("Trine", 120.0, 7.0, "major"),
    ("Square", 90.0, 7.0, "major"),
    ("Sextile", 60.0, 5.0, "major"),
    ("Quincunx", 150.0, 3.0, "minor"),
    ("Semisextile", 30.0, 2.0, "minor"),
]

FLAGS = swe.FLG_MOSEPH | swe.FLG_SPEED


@dataclass
class BodyPosition:
    name: str
    glyph: str
    longitude: float
    sign: str
    sign_glyph: str
    degree: float
    degree_str: str
    retrograde: bool
    speed: float
    house: Optional[int] = None
    element: str = ""
    mode: str = ""

    def to_dict(self):
        return asdict(self)


@dataclass
class HouseCusp:
    number: int
    longitude: float
    sign: str
    sign_glyph: str
    degree: float

    def to_dict(self):
        return asdict(self)


@dataclass
class Aspect:
    body1: str
    body2: str
    aspect: str
    angle: float
    orb: float
    kind: str

    def to_dict(self):
        return asdict(self)


def _fmt_degree(deg_in_sign: float) -> str:
    d = int(deg_in_sign)
    m = int(round((deg_in_sign - d) * 60))
    if m == 60:
        d += 1
        m = 0
    return f"{d}°{m:02d}'"


def _sign_of(longitude: float) -> tuple[str, float]:
    longitude = longitude % 360.0
    idx = int(longitude // 30)
    return SIGNS[idx], longitude % 30.0


def local_to_julian_day(year: int, month: int, day: int,
                        hour: int, minute: int, tz_offset: float) -> float:
    local_decimal = hour + minute / 60.0
    ut_decimal = local_decimal - tz_offset
    return swe.julday(year, month, day, ut_decimal, swe.GREG_CAL)


def _house_of(longitude: float, cusps: list[float]) -> int:
    longitude = longitude % 360.0
    for i in range(12):
        start = cusps[i] % 360.0
        end = cusps[(i + 1) % 12] % 360.0
        span = (end - start) % 360.0
        offset = (longitude - start) % 360.0
        if offset < span:
            return i + 1
    return 12


def compute_chart(year: int, month: int, day: int, hour: int, minute: int,
                  tz_offset: float, latitude: float, longitude: float,
                  house_system: bytes = b"P") -> dict:
    swe.set_ephe_path(None)
    jd = local_to_julian_day(year, month, day, hour, minute, tz_offset)

    cusps, ascmc = swe.houses_ex(jd, latitude, longitude, house_system, FLAGS)
    cusp_list = list(cusps[:12])

    houses = []
    for i, c in enumerate(cusp_list):
        s, d = _sign_of(c)
        houses.append(HouseCusp(i + 1, round(c, 4), s, SIGN_GLYPHS[s], round(d, 4)))

    asc = ascmc[0]
    mc = ascmc[1]
    angles = _build_angles(asc, mc)

    bodies: list[BodyPosition] = []
    for name, pid, glyph in BODIES:
        try:
            pos, _flag = swe.calc_ut(jd, pid, FLAGS)
        except swe.Error:
            continue
        lon = pos[0] % 360.0
        speed = pos[3]
        s, d = _sign_of(lon)
        bp = BodyPosition(
            name=name, glyph=glyph, longitude=round(lon, 4), sign=s,
            sign_glyph=SIGN_GLYPHS[s], degree=round(d, 4),
            degree_str=_fmt_degree(d), retrograde=speed < 0,
            speed=round(speed, 5), house=_house_of(lon, cusp_list),
            element=SIGN_ELEMENT[s], mode=SIGN_MODE[s],
        )
        bodies.append(bp)

    nn = next((b for b in bodies if b.name == "North Node"), None)
    if nn:
        sl = (nn.longitude + 180.0) % 360.0
        s, d = _sign_of(sl)
        bodies.append(BodyPosition(
            name="South Node", glyph="☋", longitude=round(sl, 4), sign=s,
            sign_glyph=SIGN_GLYPHS[s], degree=round(d, 4),
            degree_str=_fmt_degree(d), retrograde=nn.retrograde,
            speed=nn.speed, house=_house_of(sl, cusp_list),
            element=SIGN_ELEMENT[s], mode=SIGN_MODE[s],
        ))

    aspects = compute_aspects(bodies + angles["as_bodies"])
    balance = element_mode_balance(bodies)

    return {
        "julian_day": jd,
        "bodies": [b.to_dict() for b in bodies],
        "houses": [h.to_dict() for h in houses],
        "angles": angles["public"],
        "aspects": [a.to_dict() for a in aspects],
        "balance": balance,
        "house_system": "Placidus",
    }


def _build_angles(asc: float, mc: float) -> dict:
    dsc = (asc + 180.0) % 360.0
    ic = (mc + 180.0) % 360.0
    out = {}
    as_bodies = []
    for name, glyph, lon in [("Ascendant", "Asc", asc), ("Midheaven", "MC", mc),
                             ("Descendant", "Dsc", dsc), ("Imum Coeli", "IC", ic)]:
        s, d = _sign_of(lon)
        out[name] = {
            "name": name, "glyph": glyph, "longitude": round(lon, 4),
            "sign": s, "sign_glyph": SIGN_GLYPHS[s], "degree": round(d, 4),
            "degree_str": _fmt_degree(d),
        }
        if name in ("Ascendant", "Midheaven"):
            as_bodies.append(BodyPosition(
                name=name, glyph=glyph, longitude=round(lon, 4), sign=s,
                sign_glyph=SIGN_GLYPHS[s], degree=round(d, 4),
                degree_str=_fmt_degree(d), retrograde=False, speed=0.0,
                element=SIGN_ELEMENT[s], mode=SIGN_MODE[s],
            ))
    return {"public": out, "as_bodies": as_bodies}


def compute_aspects(bodies: list[BodyPosition]) -> list[Aspect]:
    out: list[Aspect] = []
    n = len(bodies)
    for i in range(n):
        for j in range(i + 1, n):
            b1, b2 = bodies[i], bodies[j]
            sep = abs(b1.longitude - b2.longitude) % 360.0
            if sep > 180.0:
                sep = 360.0 - sep
            for name, angle, orb, kind in ASPECTS:
                delta = abs(sep - angle)
                if delta <= orb:
                    out.append(Aspect(
                        body1=b1.name, body2=b2.name, aspect=name,
                        angle=angle, orb=round(delta, 2), kind=kind,
                    ))
                    break
    out.sort(key=lambda a: a.orb)
    return out


def element_mode_balance(bodies: list[BodyPosition]) -> dict:
    weights = {
        "Sun": 3, "Moon": 3, "Mercury": 2, "Venus": 2, "Mars": 2,
        "Jupiter": 1, "Saturn": 1, "Uranus": 1, "Neptune": 1, "Pluto": 1,
        "North Node": 1, "South Node": 0, "Chiron": 1,
    }
    elements = {"Fire": 0, "Earth": 0, "Air": 0, "Water": 0}
    modes = {"Cardinal": 0, "Fixed": 0, "Mutable": 0}
    for b in bodies:
        w = weights.get(b.name, 1)
        if b.element in elements:
            elements[b.element] += w
        if b.mode in modes:
            modes[b.mode] += w
    dominant_element = max(elements, key=elements.get)
    dominant_mode = max(modes, key=modes.get)
    return {
        "elements": elements, "modes": modes,
        "dominant_element": dominant_element, "dominant_mode": dominant_mode,
    }


def compute_transits(natal: dict, when: Optional[datetime] = None) -> dict:
    if when is None:
        when = datetime.now(timezone.utc)
    jd = swe.julday(when.year, when.month, when.day,
                    when.hour + when.minute / 60.0, swe.GREG_CAL)

    transit_bodies: list[BodyPosition] = []
    for name, pid, glyph in BODIES:
        try:
            pos, _ = swe.calc_ut(jd, pid, FLAGS)
        except swe.Error:
            continue
        lon = pos[0] % 360.0
        s, d = _sign_of(lon)
        transit_bodies.append(BodyPosition(
            name=name, glyph=glyph, longitude=round(lon, 4), sign=s,
            sign_glyph=SIGN_GLYPHS[s], degree=round(d, 4),
            degree_str=_fmt_degree(d), retrograde=pos[3] < 0, speed=round(pos[3], 5),
            element=SIGN_ELEMENT[s], mode=SIGN_MODE[s],
        ))

    hits = []
    natal_lons = {b["name"]: b["longitude"] for b in natal["bodies"]}
    for tb in transit_bodies:
        for nname, nlon in natal_lons.items():
            sep = abs(tb.longitude - nlon) % 360.0
            if sep > 180.0:
                sep = 360.0 - sep
            for aname, angle, orb, kind in ASPECTS:
                if kind != "major":
                    continue
                delta = abs(sep - angle)
                if delta <= min(orb, 5.0):
                    hits.append({
                        "transit": tb.name, "aspect": aname, "natal": nname,
                        "orb": round(delta, 2),
                        "transit_sign": tb.sign, "retrograde": tb.retrograde,
                    })
                    break
    hits.sort(key=lambda h: h["orb"])
    return {
        "datetime": when.isoformat(),
        "sky": [b.to_dict() for b in transit_bodies],
        "hits": hits[:20],
    }


def compute_sky_now(when: Optional[datetime] = None) -> list[BodyPosition]:
    """Just the current transiting bodies, no natal comparison needed."""
    if when is None:
        when = datetime.now(timezone.utc)
    jd = swe.julday(when.year, when.month, when.day,
                    when.hour + when.minute / 60.0, swe.GREG_CAL)
    out = []
    for name, pid, glyph in BODIES:
        try:
            pos, _ = swe.calc_ut(jd, pid, FLAGS)
        except swe.Error:
            continue
        lon = pos[0] % 360.0
        s, d = _sign_of(lon)
        out.append(BodyPosition(
            name=name, glyph=glyph, longitude=round(lon, 4), sign=s,
            sign_glyph=SIGN_GLYPHS[s], degree=round(d, 4),
            degree_str=_fmt_degree(d), retrograde=pos[3] < 0, speed=round(pos[3], 5),
            element=SIGN_ELEMENT[s], mode=SIGN_MODE[s],
        ))
    return out


if __name__ == "__main__":
    chart = compute_chart(1990, 5, 15, 14, 30, -5.0, 40.7128, -74.0060)
    for b in chart["bodies"]:
        print(f"{b['name']:12} {b['sign_glyph']} {b['sign']:12} {b['degree_str']:8} "
              f"house {b['house']}  {'R' if b['retrograde'] else ''}")
    print("ASC:", chart["angles"]["Ascendant"]["sign"], chart["angles"]["Ascendant"]["degree_str"])
    print("Balance:", chart["balance"]["dominant_element"], chart["balance"]["dominant_mode"])
    print(f"{len(chart['aspects'])} aspects")
