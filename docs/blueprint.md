# **App Name**: Harmonic Delay Calculator

## Core Features:

- Tempo Input: Input field for Tempo (BPM).
- Root Note Selection: Selection for Root Note (e.g., C3).
- Multiplier Selection: Dropdown for selecting the Multiplier (e.g., 1x, 2x, 0.5x).
- Calculations and Display: Calculates and displays the Frequency of the Root Note, Time per Cycle, Musical Delay Time, and Comparison to Beat Divisions.

## Style Guidelines:

- Primary color: Dark teal (#008080) for a professional feel.
- Secondary color: Light gray (#F0F0F0) for backgrounds.
- Accent color: Lime green (#32CD32) to highlight calculated values and interactive elements.
- Clean and structured layout with clear sections for input and output.
- Simple, clear icons for musical concepts (e.g., a metronome for BPM, a note for Root Note).

## Original User Request:
🟣 TimeTuned Lite: Tempo x Root Sync
Find delay times that are musically synced to both the tempo (BPM) and the fundamental/root note frequency — harmonically and rhythmically.

✅ User Inputs:
Tempo (BPM) → e.g. 120

Root Note → e.g. C3 (130.81 Hz)

Multiplier (x cycles) → e.g. 1x, 2x, 0.5x

🧠 What It Does:
It calculates:

🎵 Frequency of Root Note (Hz)

🧮 Time per Cycle = 1000 / freq (in ms)

⏱ Musical Delay Time =
cycleTime * multiplier (1x = one full cycle, 2x = two cycles, etc.)

🧩 Comparison to Beat Divisions:

1 Beat (ms) = 60000 / BPM

See how your cycle-aligned delay relates to 1/4, 1/8, 1/16 etc.

🧮 Example:
BPM = 120
Root = G3 (196 Hz)
1 Cycle = 1000 / 196 ≈ 5.10 ms
2x Cycle = ≈ 10.20 ms
1 Beat = 60000 / 120 = 500 ms
→ 10.20 ms is ~1/49th of a beat = super tight flutter

💡 Use Case:
Layer short delays or early reflections that subtly reinforce the key without stepping on rhythmic timing. Perfect for stereo wideners, slapback, ambient tails, or rhythmic pitch shifting.

✅ Final Output Example:
yaml
Copy
Edit
Root Note: G3 (196.00 Hz)
Tempo: 120 BPM

Base Frequency Cycle: 5.10 ms
x2 Harmonic Cycle: 10.20 ms

1 Beat = 500 ms
Your Delay = 10.20 ms (~1/49th of a beat)

Use for: Transient enhancement, reverb pre-delay, harmonic echoes
📄 Want the HTML + JS prototype now?
I can generate a full working version with:

Root note selector

BPM input

Multiplier dropdown

Clean result display

Wanna roll with that?
  