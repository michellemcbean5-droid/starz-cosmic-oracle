"""
Mundane Astrology — World & Event Predictions
================================================
Techniques used by real astrologers to forecast world events (not personal
charts): the "Aries Ingress" — the exact moment the Sun enters 0° Aries each
year (the Spring Equinox) — cast for a world capital, is the classic
foundation for a year's world forecast. We also surface current outer-planet
aspects (Jupiter/Saturn/Uranus/Neptune/Pluto to each other), since those slow,
heavy contacts are what traditionally mark big collective/world-level shifts
(recessions, revolutions, cultural turning points).
"""

from __future__ import annotations
from datetime import datetime, timezone

import swisseph as swe

from ephemeris import (
    FLAGS, SIGNS, SIGN_GLYPHS, BODIES, ASPECTS, compute_sky_now,
    _sign_of, _fmt_degree, compute_aspects, BodyPosition,
)

# World capital used for the Ingress chart (Washington DC — a common modern choice)
WORLD_LAT, WORLD_LON = 38.9072, -77.0369

OUTER_PLANETS = {"Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"}

WORLD_THEMES = {
    "Jupiter": "growth, optimism, expansion, travel, big beliefs, booms",
    "Saturn": "restriction, structure, the establishment, hard lessons, economic tightening",
    "Uranus": "sudden shocks, rebellion, tech breakthroughs, revolutions",
    "Neptune": "confusion, idealism, spirituality, mass movements, deception exposed",
    "Pluto": "power struggles, deep transformation, collapse and rebirth of systems",
}

ASPECT_WORLD_SLANG = {
    "Conjunction": "join forces — a major turning point where these forces merge into one big story",
    "Opposition": "go head to head — expect public tension, standoffs, two sides pulling hard",
    "Trine": "work together smooth — good conditions for progress in this area, less friction",
    "Square": "clash hard — real-world friction, conflict, and pressure that forces change",
    "Sextile": "cooperate — an opening for smart moves and diplomacy",
}


def _find_aries_ingress(year: int) -> float:
    """Binary-search the Julian Day when the Sun crosses 0° Aries in the given year."""
    def sun_lon(jd):
        pos, _ = swe.calc_ut(jd, swe.SUN, FLAGS)
        return pos[0] % 360.0

    lo = swe.julday(year, 3, 18, 0.0, swe.GREG_CAL)
    hi = swe.julday(year, 3, 23, 0.0, swe.GREG_CAL)
    for _ in range(60):
        mid = (lo + hi) / 2.0
        lon = sun_lon(mid)
        # near 0/360 boundary: treat values > 180 as "before" 0
        signed = lon if lon < 180 else lon - 360
        if signed < 0:
            lo = mid
        else:
            hi = mid
    return hi


def aries_ingress_chart(year: int) -> dict:
    """Cast the Aries Ingress (start-of-astrological-year) chart for a world capital."""
    swe.set_ephe_path(None)
    jd = _find_aries_ingress(year)

    cusps, ascmc = swe.houses_ex(jd, WORLD_LAT, WORLD_LON, b"P", FLAGS)
    asc = ascmc[0]
    asc_sign, asc_deg = _sign_of(asc)

    bodies = []
    for name, pid, glyph in BODIES:
        try:
            pos, _ = swe.calc_ut(jd, pid, FLAGS)
        except swe.Error:
            continue
        lon = pos[0] % 360.0
        s, d = _sign_of(lon)
        bodies.append(BodyPosition(
            name=name, glyph=glyph, longitude=round(lon, 4), sign=s,
            sign_glyph=SIGN_GLYPHS[s], degree=round(d, 4), degree_str=_fmt_degree(d),
            retrograde=pos[3] < 0, speed=round(pos[3], 5),
        ))

    aspects = compute_aspects(bodies)
    when = swe.revjul(jd, swe.GREG_CAL)

    return {
        "year": year,
        "moment_utc": f"{when[0]:04d}-{when[1]:02d}-{when[2]:02d} {when[3]:.2f}h UTC",
        "location": "Washington, DC (world capital reference point)",
        "ascendant": {"sign": asc_sign, "degree_str": _fmt_degree(asc_deg)},
        "bodies": [b.to_dict() for b in bodies],
        "aspects": [a.to_dict() for a in aspects if a.kind == "major"],
    }


def world_forecast(year: int | None = None) -> dict:
    """Build the full plain-English world/event forecast."""
    now = datetime.now(timezone.utc)
    year = year or now.year

    ingress = aries_ingress_chart(year)
    sky = compute_sky_now(now)

    # Slow-planet-to-slow-planet aspects happening right now = the big world stories
    outer = [b for b in sky if b.name in OUTER_PLANETS]
    world_aspects = []
    for i in range(len(outer)):
        for j in range(i + 1, len(outer)):
            b1, b2 = outer[i], outer[j]
            sep = abs(b1.longitude - b2.longitude) % 360.0
            if sep > 180.0:
                sep = 360.0 - sep
            for aname, angle, orb, kind in ASPECTS:
                if kind != "major":
                    continue
                delta = abs(sep - angle)
                if delta <= orb:
                    world_aspects.append({
                        "body1": b1.name, "body2": b2.name, "aspect": aname, "orb": round(delta, 2),
                    })
                    break
    world_aspects.sort(key=lambda a: a["orb"])

    lines = []
    lines.append(
        f"The astrological year {year} kicked off with the Sun entering Aries — the chart "
        f"cast for that exact moment (over {ingress['location']}) sets the tone for world "
        f"events all year. Its rising sign is {ingress['ascendant']['sign']}: the world's "
        f"'first impression' energy for the year is {SIGN_VIBES_SHORT.get(ingress['ascendant']['sign'], 'shifting')}."
    )
    for wa in world_aspects[:6]:
        t1, t2 = WORLD_THEMES.get(wa["body1"], ""), WORLD_THEMES.get(wa["body2"], "")
        slang = ASPECT_WORLD_SLANG.get(wa["aspect"], "interact")
        lines.append(
            f"{wa['body1']} ({t1}) {slang} with {wa['body2']} ({t2}) right now — orb {wa['orb']}°. "
            f"Watch for this to show up in real headlines."
        )
    for retro in [b for b in outer if b.retrograde]:
        lines.append(f"{retro.name} is retrograde in {retro.sign} — {WORLD_THEMES.get(retro.name,'')} themes get revisited, delayed, or undone before moving forward again.")

    return {
        "year": year,
        "as_of": now.isoformat(),
        "aries_ingress": ingress,
        "current_sky": [b.to_dict() for b in sky],
        "world_aspects": world_aspects,
        "predictions": lines,
    }


SIGN_VIBES_SHORT = {
    "Aries": "bold and combative", "Taurus": "slow, stubborn, money-focused",
    "Gemini": "chaotic, fast-talking, full of mixed messages", "Cancer": "protective, nostalgic, homeland-focused",
    "Leo": "dramatic, led by big personalities", "Virgo": "detail-obsessed, health and labor focused",
    "Libra": "about deals, diplomacy and public opinion", "Scorpio": "intense, secretive, power struggles",
    "Sagittarius": "expansive, ideological, border and travel focused", "Capricorn": "serious, institutional, about who's really in charge",
    "Aquarius": "about tech, rebellion and the collective", "Pisces": "confusing, spiritual, media and deception focused",
}


if __name__ == "__main__":
    import json
    fc = world_forecast()
    print(json.dumps({"predictions": fc["predictions"]}, indent=2))
