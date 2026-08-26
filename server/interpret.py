"""
Slang Interpretation & Prediction Engine
==========================================
Turns cold chart numbers into warm, plain-English ("street slang") readings.

Two layers:
  1. A built-in rules library (always works, no internet needed) that produces
     solid readings from sign/house/aspect/Sabian/Lot data.
  2. An optional Claude LLM enrichment (`llm_reading`) that, when an
     ANTHROPIC_API_KEY is set, rewrites everything into a flowing, personalized
     report in whatever voice you ask for (default: easy slang).
"""

from __future__ import annotations
import os

from sabian import sabian_for

SIGN_VIBES = {
    "Aries": "bold, first-out-the-gate, ready to fight for what you want",
    "Taurus": "steady, sensual, in it for comfort, money and the good life",
    "Gemini": "quick-witted, chatty, always juggling ten conversations",
    "Cancer": "soft-hearted, protective, ride-or-die for your people",
    "Leo": "the main character, warm, dramatic, born to shine",
    "Virgo": "sharp-eyed, helpful, low-key perfectionist who fixes everything",
    "Libra": "charming, fair, allergic to drama, wants everything balanced and pretty",
    "Scorpio": "deep, magnetic, all-or-nothing, sees straight through people",
    "Sagittarius": "free spirit, truth-teller, gotta roam and gotta know why",
    "Capricorn": "boss energy, patient, building an empire brick by brick",
    "Aquarius": "the weird genius, marches to their own drum, here for the future",
    "Pisces": "dreamy, psychic, big feelings, one foot in another world",
}

PLANET_ROLE = {
    "Sun": ("your core self", "who you are at the deepest level, your main character energy"),
    "Moon": ("your feelings", "your gut, your comfort zone, what makes you feel safe"),
    "Mercury": ("your mind", "how you think, talk, text and figure things out"),
    "Venus": ("your love & money", "what you find attractive, how you love and what you value"),
    "Mars": ("your drive", "your hustle, your temper, how you go after what you want"),
    "Jupiter": ("your luck", "where life hands you growth, blessings and big opportunities"),
    "Saturn": ("your lessons", "where you have to work hard, grow up and earn your wins"),
    "Uranus": ("your rebel streak", "where you break the rules and shock people"),
    "Neptune": ("your dreams", "your imagination, spirituality and where you get foggy"),
    "Pluto": ("your power", "where you transform, obsess and rise from the ashes"),
    "North Node": ("your destiny", "the growth your soul came here to chase"),
    "South Node": ("your comfort zone", "old habits and gifts you already mastered"),
    "Chiron": ("your deep wound", "the old hurt that becomes your superpower to heal others"),
}

ASPECT_SLANG = {
    "Conjunction": "are fused together — these two energies act as one, for better or worse",
    "Opposition": "are in a tug-of-war — you feel pulled between them and have to find balance",
    "Trine": "flow together easy — this is a natural gift that just works for you",
    "Square": "grind against each other — friction that pushes you to grow up",
    "Sextile": "give each other a boost — an opportunity if you put in a little effort",
    "Quincunx": "don't quite fit — you keep having to adjust between these two",
    "Semisextile": "sit side by side — a subtle nudge between two different vibes",
}

HOUSE_MEANING = {
    1: "your look, your vibe, how you come across",
    2: "money, self-worth and what you own",
    3: "your mind, siblings, texting and the neighborhood",
    4: "home, family and your roots",
    5: "romance, creativity, kids and fun",
    6: "work, health and daily grind",
    7: "partners, marriage and your one-on-ones",
    8: "sex, death, other people's money and deep transformation",
    9: "travel, higher learning, beliefs and adventure",
    10: "career, reputation and your public image",
    11: "friends, community and your big dreams",
    12: "the subconscious, secrets, spirituality and what's hidden",
}

ELEMENT_SLANG = {
    "Fire": "you run on passion and action — lead with your gut and go",
    "Earth": "you're grounded and practical — you want real, tangible results",
    "Air": "you live in your head — ideas, talk and connection are your fuel",
    "Water": "you feel everything deeply — emotion and intuition run the show",
}

MODE_SLANG = {
    "Cardinal": "a starter — you kick things off and lead the charge",
    "Fixed": "a finisher — once you commit, you don't budge",
    "Mutable": "a shape-shifter — flexible, adaptable, go with the flow",
}


def _find(bodies, name):
    return next((b for b in bodies if b["name"] == name), None)


def build_core_identity(chart: dict) -> dict:
    bodies = chart["bodies"]
    sun = _find(bodies, "Sun")
    moon = _find(bodies, "Moon")
    asc = chart["angles"]["Ascendant"]

    sun_line = (f"☉ Sun in {sun['sign']} — At your core you're "
                f"{SIGN_VIBES[sun['sign']]}. This is your main character energy: "
                f"the real you underneath everything.")
    moon_line = (f"☽ Moon in {moon['sign']} — On the inside, emotionally, you're "
                 f"{SIGN_VIBES[moon['sign']]}. This is what you need to feel safe and cozy.")
    rising_line = (f"↑ {asc['sign']} Rising — The vibe people catch when they first "
                   f"meet you is {SIGN_VIBES[asc['sign']]}. It's the mask and the doorway.")

    return {"title": "Who You Are (The Big Three)", "sun": sun_line, "moon": moon_line, "rising": rising_line}


def build_balance(chart: dict) -> dict:
    bal = chart["balance"]
    de, dm = bal["dominant_element"], bal["dominant_mode"]
    return {
        "title": "Your Energy Blend",
        "element": f"You're mostly {de} — {ELEMENT_SLANG[de]}.",
        "mode": f"And you're {dm} — {MODE_SLANG[dm]}.",
        "elements": bal["elements"],
        "modes": bal["modes"],
    }


def build_planets(chart: dict) -> list[dict]:
    out = []
    for b in chart["bodies"]:
        role = PLANET_ROLE.get(b["name"])
        if not role:
            continue
        short, long = role
        house = b.get("house")
        house_txt = f" It plays out in the area of {HOUSE_MEANING.get(house, '')} (house {house})." if house else ""
        retro = " It's retrograde, so this energy turns inward and replays until you master it." if b["retrograde"] else ""
        out.append({
            "planet": b["name"], "glyph": b["glyph"], "sign": b["sign"], "degree": b["degree_str"],
            "headline": f"{b['glyph']} {b['name']} in {b['sign']} — {short}",
            "text": (f"Your {short} ({long}) wears a {b['sign']} flavor: "
                     f"{SIGN_VIBES[b['sign']]}.{house_txt}{retro}"),
        })
    return out


def build_aspects(chart: dict, limit: int = 8) -> list[dict]:
    out = []
    for a in chart["aspects"][:limit]:
        slang = ASPECT_SLANG.get(a["aspect"], "connect")
        out.append({
            "pair": f"{a['body1']} {a['aspect']} {a['body2']}", "kind": a["kind"], "orb": a["orb"],
            "text": f"Your {a['body1']} and {a['body2']} {slang}.",
        })
    return out


def build_sabian(chart: dict) -> list[dict]:
    picks = []
    bodies = chart["bodies"]
    for name in ("Sun", "Moon"):
        b = _find(bodies, name)
        if b:
            picks.append((f"{name} ({b['sign']})", b["longitude"]))
    asc = chart["angles"]["Ascendant"]
    picks.append((f"Rising ({asc['sign']})", asc["longitude"]))
    mc = chart["angles"]["Midheaven"]
    picks.append((f"Midheaven ({mc['sign']})", mc["longitude"]))

    out = []
    for label, lon in picks:
        s = sabian_for(lon)
        out.append({
            "point": label, "sabian": s["label"], "symbol": s["symbol"],
            "text": (f"{label} sits on the Sabian symbol \"{s['label']}\": "
                     f"'{s['symbol']}'. Sit with that image — it's a secret clue about this part of your life."),
        })
    return out


def build_lots(lots: list[dict]) -> list[dict]:
    out = []
    for lot in lots:
        out.append({
            "name": lot["name"], "placement": f"{lot['sign']} {lot['degree_str']}",
            "text": f"{lot['name']} lands in {lot['sign']} ({lot['formula']}). {lot['meaning']} "
                    f"Here it takes on that {SIGN_VIBES[lot['sign']]} flavor.",
        })
    return out


def build_predictions(transits: dict, limit: int = 8) -> dict:
    lines = []
    for h in transits["hits"][:limit]:
        tname, aspect, nname = h["transit"], h["aspect"], h["natal"]
        role = PLANET_ROLE.get(nname, ("that part of you", ""))[0]
        t_role = PLANET_ROLE.get(tname, ("cosmic energy", ""))[0]
        vibe = {
            "Conjunction": "is lighting up", "Opposition": "is facing off with",
            "Trine": "is blessing", "Square": "is pushing on", "Sextile": "is opening a door for",
        }.get(aspect, "is touching")
        retro = " (and it's retrograde, so expect a rerun of an old situation)" if h.get("retrograde") else ""
        lines.append({"text": f"{tname} ({t_role}) {vibe} your {nname} ({role}){retro}.", "orb": h["orb"]})
    return {"title": "What The Sky Is Doing To You Right Now", "as_of": transits["datetime"], "lines": lines}


def generate_reading(chart: dict, lots: list[dict], transits: dict | None = None) -> dict:
    report = {
        "core": build_core_identity(chart),
        "balance": build_balance(chart),
        "planets": build_planets(chart),
        "aspects": build_aspects(chart),
        "sabian": build_sabian(chart),
        "lots": build_lots(lots),
    }
    if transits:
        report["predictions"] = build_predictions(transits)
    return report


SLANG_SYSTEM = (
    "You are Starz, a warm, funny, wise street-smart astrologer. You read birth "
    "charts and explain them in plain everyday slang — no fancy jargon, no big "
    "words left unexplained. Talk to the person like a real one who cares about "
    "them. Be specific, hype them up honestly, keep it real about challenges, and "
    "make every line feel personal. Never invent planet positions — only use the "
    "chart data you're given."
)


def llm_reading(chart: dict, lots: list[dict], transits: dict | None,
                voice: str = "easy street slang", question: str | None = None) -> dict:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return {"available": False,
                "reason": "No ANTHROPIC_API_KEY set — showing the built-in reading instead."}
    try:
        import anthropic
    except ImportError:
        return {"available": False, "reason": "anthropic package not installed."}

    facts = _chart_to_facts(chart, lots, transits)
    ask = f"\n\nThe person specifically asked: {question}" if question else ""
    prompt = (
        f"Here is the person's real birth chart data (already calculated with the "
        f"Swiss Ephemeris — trust these numbers):\n\n{facts}\n\n"
        f"Write them a personalized astrology report in {voice}. Cover who they are "
        f"(sun/moon/rising), their strengths and challenges, love and money, their "
        f"purpose, and 2-3 concrete predictions from the current sky. Use the Sabian "
        f"symbols and Arabic Lots as flavor. Keep it real and easy to understand.{ask}"
    )
    try:
        client = anthropic.Anthropic(api_key=api_key)
        msg = client.messages.create(
            model="claude-sonnet-5", max_tokens=2000, system=SLANG_SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(block.text for block in msg.content if getattr(block, "type", "") == "text")
        return {"available": True, "text": text}
    except Exception as e:  # noqa: BLE001
        return {"available": False, "reason": f"LLM call failed: {e}"}


def _chart_to_facts(chart: dict, lots: list[dict], transits: dict | None) -> str:
    lines = []
    for b in chart["bodies"]:
        r = " (retrograde)" if b["retrograde"] else ""
        h = f", house {b['house']}" if b.get("house") else ""
        lines.append(f"- {b['name']}: {b['sign']} {b['degree_str']}{h}{r}")
    a = chart["angles"]
    lines.append(f"- Ascendant: {a['Ascendant']['sign']} {a['Ascendant']['degree_str']}")
    lines.append(f"- Midheaven: {a['Midheaven']['sign']} {a['Midheaven']['degree_str']}")
    lines.append(f"- Dominant element/mode: {chart['balance']['dominant_element']} / {chart['balance']['dominant_mode']}")
    lines.append("Top aspects: " + "; ".join(f"{x['body1']} {x['aspect']} {x['body2']}" for x in chart["aspects"][:6]))
    lines.append("Arabic Lots: " + "; ".join(f"{l['name']} in {l['sign']}" for l in lots))
    if transits and transits.get("hits"):
        lines.append("Current transits: " + "; ".join(f"{h['transit']} {h['aspect']} natal {h['natal']}" for h in transits["hits"][:6]))
    return "\n".join(lines)
