"""
Arabic Parts / Lots
====================
Sensitive points computed from arithmetic between chart factors (most
famously the Part of Fortune = Asc + Moon - Sun for a day chart).

Each lot points to a life theme. We compute the classic set and hand back
the sign/degree so the interpretation layer can read them like any other
point on the chart.
"""

from __future__ import annotations

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]
SIGN_GLYPHS = {
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋",
    "Leo": "♌", "Virgo": "♍", "Libra": "♎", "Scorpio": "♏",
    "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓",
}


def _sign_of(lon: float):
    lon %= 360.0
    return SIGNS[int(lon // 30)], lon % 30.0


def _fmt(deg: float) -> str:
    d = int(deg)
    m = int(round((deg - d) * 60))
    if m == 60:
        d, m = d + 1, 0
    return f"{d}°{m:02d}'"


LOT_MEANINGS = {
    "Part of Fortune": ("Asc + Moon − Sun", "Where luck, flow and natural well-being show up for you — your pot of gold."),
    "Part of Spirit": ("Asc + Sun − Moon", "Your drive, purpose and the mark you're here to make in the world."),
    "Part of Love (Eros)": ("Asc + Venus − Spirit", "How and where your heart chases desire, romance and attraction."),
    "Part of Marriage": ("Asc + Descendant − Venus", "The theme of your committed partnerships and who you bond with."),
    "Part of Career": ("Asc + MC − Moon", "Your calling, reputation and the work that lights you up."),
    "Part of Courage": ("Asc + Mars − Sun", "Where you fight, hustle and find your nerve."),
    "Part of Faith": ("Asc + Mercury − Moon", "Your beliefs, mindset and the wisdom you lean on."),
}


def compute_lots(asc: float, mc: float, sun: float, moon: float,
                 venus: float, mars: float, mercury: float,
                 is_day_chart: bool) -> list[dict]:
    dsc = (asc + 180.0) % 360.0

    if is_day_chart:
        fortune = (asc + moon - sun) % 360.0
        spirit = (asc + sun - moon) % 360.0
    else:
        fortune = (asc + sun - moon) % 360.0
        spirit = (asc + moon - sun) % 360.0

    eros = (asc + venus - spirit) % 360.0
    marriage = (asc + dsc - venus) % 360.0
    career = (asc + mc - moon) % 360.0
    courage = (asc + mars - sun) % 360.0
    faith = (asc + mercury - moon) % 360.0

    raw = {
        "Part of Fortune": fortune,
        "Part of Spirit": spirit,
        "Part of Love (Eros)": eros,
        "Part of Marriage": marriage,
        "Part of Career": career,
        "Part of Courage": courage,
        "Part of Faith": faith,
    }

    out = []
    for name, lon in raw.items():
        s, d = _sign_of(lon)
        formula, meaning = LOT_MEANINGS[name]
        out.append({
            "name": name,
            "longitude": round(lon, 4),
            "sign": s,
            "sign_glyph": SIGN_GLYPHS[s],
            "degree": round(d, 4),
            "degree_str": _fmt(d),
            "formula": formula,
            "meaning": meaning,
        })
    return out
