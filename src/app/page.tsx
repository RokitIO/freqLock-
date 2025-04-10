"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the type for a musical note
interface MusicalNote {
  note: string;
  midiNote: number;
  frequency: number;
}

// List of musical notes for one octave (C3 to C4)
const musicalNotes: MusicalNote[] = [
  { note: "C3", midiNote: 48, frequency: 130.81 },
  { note: "C#3/Db3", midiNote: 49, frequency: 138.59 },
  { note: "D3", midiNote: 50, frequency: 146.83 },
  { note: "D#3/Eb3", midiNote: 51, frequency: 155.56 },
  { note: "E3", midiNote: 52, frequency: 164.81 },
  { note: "F3", midiNote: 53, frequency: 174.61 },
  { note: "F#3/Gb3", midiNote: 54, frequency: 185.00 },
  { note: "G3", midiNote: 55, frequency: 196.00 },
  { note: "G#3/Ab3", midiNote: 56, frequency: 207.65 },
  { note: "A3", midiNote: 57, frequency: 220.00 },
  { note: "A#3/Bb3", midiNote: 58, frequency: 233.08 },
  { note: "B3", midiNote: 59, frequency: 246.94 },
  { note: "C4", midiNote: 60, frequency: 261.63 },
];

const initialTempo = 120;
const initialRootNote = musicalNotes[0]; // Default to C3
const initialMultiplier = 0.25;
const initialSemitoneOffset = 0;
const initialBeatDivisionIndex = 11; // Index of "1/4 note"

const beatDivisions = [
    "64x",
    "32x",
    "16x",
    "8x",
    "4x",
    "2x Dotted 1/2 note",
    "2x",
    "Dotted 1/2 note",
    "1/2 note",
    "1/2 note triplets",
    "Dotted 1/4 note",
    "1/4 note",
    "1/4 note triplets",
    "Dotted 1/8 note",
    "1/8 note",
    "1/8 note triplets",
    "Dotted 1/16 note",
    "1/16 note",
    "1/16 note triplets",
    "Dotted 1/32 note",
    "1/32 note",
    "1/32 note triplets",
    "Dotted 1/64 note",
    "1/64 note",
    "1/64 note triplets"
];

// React functional component for the Home page
export default function Home() {
  // State variables using the useState hook
  const [tempo, setTempo] = useState<number>(initialTempo);
  const [rootNote, setRootNote] = useState<MusicalNote>(initialRootNote);
  const [multiplier, setMultiplier] = useState<number>(initialMultiplier);
  const [semitoneOffset, setSemitoneOffset] = useState<number>(initialSemitoneOffset);
  const [frequency, setFrequency] = useState<number>(rootNote.frequency * Math.pow(2, semitoneOffset / 12));
  const [timePerCycle, setTimePerCycle] = useState<number>(1000 / (rootNote.frequency * Math.pow(2, semitoneOffset / 12)));
  const [musicalDelayTime, setMusicalDelayTime] = useState<number>(timePerCycle * multiplier);
  const [beatTime, setBeatTime] = useState<number>(60000 / tempo);
  const [beatRatio, setBeatRatio] = useState<number>(musicalDelayTime / beatTime);
  const [beatDivisionIndex, setBeatDivisionIndex] = useState<number>(initialBeatDivisionIndex);
  const [closestNoteDivision, setClosestNoteDivision] = useState<string>(getClosestNoteDivision(beatRatio));

  // useEffect hook to recalculate values when tempo, root note, or multiplier changes
  useEffect(() => {
    const newFrequency = rootNote.frequency * Math.pow(2, semitoneOffset / 12);
    setFrequency(newFrequency);
    setTimePerCycle(1000 / newFrequency);
    setBeatTime(60000 / tempo);
  }, [tempo, rootNote, semitoneOffset]);

  useEffect(() => {
    setMusicalDelayTime(timePerCycle * multiplier);
  }, [timePerCycle, multiplier]);

  // useEffect hook to recalculate beat ratio when musicalDelayTime or beatTime changes
  useEffect(() => {
    const newBeatRatio = musicalDelayTime / beatTime;
    setBeatRatio(newBeatRatio);
    setClosestNoteDivision(getClosestNoteDivision(newBeatRatio));
  }, [musicalDelayTime, beatTime]);

    // Handler for semitone offset input change
    const handleSemitoneOffsetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      if (!isNaN(value) && value >= -24 && value <= 24) {
        setSemitoneOffset(value);
      }
    };

    // Function to convert beat division/multiple to a multiplier
    const beatDivisionToMultiplier = (beatDivision: string): number => {
      switch (beatDivision) {
        case "64x":
            return 64;
        case "32x":
            return 32;
        case "16x":
          return 16;
        case "8x":
          return 8;
        case "4x":
          return 4;
        case "2x Dotted 1/2 note":
          return 1.5;
        case "2x":
          return 2;
        case "Dotted 1/2 note":
          return 0.75;
        case "1/2 note":
          return 0.5;
        case "1/2 note triplets":
          return 1/3;
        case "Dotted 1/4 note":
          return 0.375;
        case "1/4 note":
          return 0.25;
        case "1/4 note triplets":
          return 1/6;
        case "Dotted 1/8 note":
          return 0.1875;
        case "1/8 note":
          return 0.125;
        case "1/8 note triplets":
          return 1/12;
        case "Dotted 1/16 note":
          return 0.09375;
        case "1/16 note":
          return 0.0625;
        case "1/16 note triplets":
          return 1/24;
        case "Dotted 1/32 note":
          return 0.046875;
        case "1/32 note":
          return 0.03125;
        case "1/32 note triplets":
          return 1/48;
        case "Dotted 1/64 note":
          return 0.0234375;
        case "1/64 note":
          return 0.015625;
        case "1/64 note triplets":
          return 1/96;
        default:
          return 0.25; // Default to 1/4 note
      }
    };

  // Handler for resetting the input fields
  const handleReset = () => {
    setTempo(initialTempo);
    setRootNote(initialRootNote);
    setMultiplier(initialMultiplier);
    setSemitoneOffset(initialSemitoneOffset);
    setBeatDivisionIndex(initialBeatDivisionIndex);
  };

  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 30 && value <= 240) {
      setTempo(value);
    }
  };

  // Piano key component
  const PianoKey = ({ note, midiNote, frequency, isBlack, isSelected }: { note: string; midiNote: number; frequency: number; isBlack: boolean; isSelected: boolean }) => {
    const keyWidth = isBlack ? '1.5rem' : '2rem'; // Slightly narrower keys
    const keyHeight = isBlack ? '3rem' : '5rem';
    const keyClass = isBlack ? 'bg-black text-white' : 'bg-white text-black border-2 border-gray-200';
    const selectedClass = isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground';
    const lockedClass = isSelected ? 'ring-2 ring-accent ring-inset' : ''; // Add ring only when selected

    return (
      <button
        className={`relative z-10 ${keyClass} ${selectedClass} ${lockedClass} focus:outline-none`}
        style={{ width: keyWidth, height: keyHeight }}
        onClick={() => setRootNote({ note, midiNote, frequency })}
      >
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs">{note}</span>
      </button>
    );
  };

    const handleMultiplierChange = (value: number[]) => {
      if (value && value.length > 0) {
        const index = Math.round(value[0]);
        setBeatDivisionIndex(index);
        setMultiplier(beatDivisionToMultiplier(beatDivisions[index]));
      }
    };

    // Function to get the closest musical note division
    function getClosestNoteDivision(ratio: number): string {
      const divisions = [
        { label: "1/1", value: 1 },
        { label: "1/2", value: 0.5 },
        { label: "1/4", value: 0.25 },
        { label: "1/8", value: 0.125 },
        { label: "1/16", value: 0.0625 },
        { label: "1/32", value: 0.03125 },
        { label: "1/64", value: 0.015625 },
      ];
      let closest = divisions.reduce((prev, curr) =>
        Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev
      );
      return closest.label;
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-teal-800 mb-4">
          Harmonic Delay Calculator
        </h1>

        <section className="w-full max-w-md">
          {/* Input Section */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* Tempo Input */}
              <div className="grid gap-2">
                <Label htmlFor="tempo">Tempo (BPM)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="tempo"
                    min={30}
                    max={240}
                    step={1}
                    defaultValue={[tempo]}
                    onValueChange={(value) => setTempo(parseFloat(value[0].toFixed(1)))}
                    aria-label="Tempo in beats per minute"
                  />
                  <Input
                    type="number"
                    id="tempo-input"
                    className="w-20"
                    value={tempo.toString()}
                    onChange={handleTempoChange}
                    min={30}
                    max={240}
                    step={1}
                  />
                </div>
              </div>

              {/* Root Note Selection */}
              <div className="grid gap-2">
                <Label>Root Note</Label>
                <div className="flex justify-center items-center py-2">
                  {/* Piano Keyboard */}
                  <div className="flex">
                    {musicalNotes.map((note) => {
                      const isBlackKey = note.note.includes("#") || note.note.includes("b");
                      const isSelected = rootNote.note === note.note;
                      return (
                        <PianoKey
                          key={note.note}
                          note={note.note}
                          midiNote={note.midiNote}
                          frequency={note.frequency}
                          isBlack={isBlackKey}
                          isSelected={isSelected}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

               {/* Semitone Offset Input */}
               <div className="grid gap-2">
                <Label htmlFor="semitoneOffset">Semitone Offset</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="semitoneOffset"
                    min={-24}
                    max={24}
                    step={1}
                    defaultValue={[semitoneOffset]}
                    onValueChange={(value) => setSemitoneOffset(value[0])}
                    aria-label="Semitone Offset"
                  />
                  <Input
                    type="number"
                    id="semitoneOffset-input"
                    className="w-20"
                    value={semitoneOffset.toString()}
                    onChange={handleSemitoneOffsetChange}
                    min={-24}
                    max={24}
                    step={1}
                  />
                </div>
              </div>

              {/* Multiplier Input */}
              <div className="grid gap-2">
                <Label htmlFor="multiplier">Beat Division</Label>
                <Slider
                  id="multiplier"
                  min={0}
                  max={beatDivisions.length - 1}
                  step={1}
                  defaultValue={[initialBeatDivisionIndex]}
                    value={[beatDivisionIndex]}
                  onValueChange={(value) => {
                    if (value && value.length > 0) {
                      handleMultiplierChange(value);
                    }
                  }}
                  aria-label="Beat Division"
                />
                <Input
                  type="text"
                  id="multiplier-input"
                  className="w-full"
                  value={beatDivisions[beatDivisionIndex] || "1/4 note"}
                  readOnly
                />
              </div>
              <Button type="button" onClick={handleReset}>
                Reset
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Calculated Results</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label>Frequency of Root Note:</Label>
                <div className="text-lg font-semibold text-lime-500">{frequency.toFixed(2)} Hz</div>
              </div>
              <div className="grid gap-2">
                <Label>Time per Cycle:</Label>
                <div className="text-lg font-semibold text-lime-500">{timePerCycle.toFixed(2)} ms</div>
              </div>
              <div className="grid gap-2">
                <Label>Musical Delay Time:</Label>
                <div className="text-lg font-semibold text-lime-500">{musicalDelayTime.toFixed(2)} ms</div>
              </div>
              <div className="grid gap-2">
                <Label>1 Beat:</Label>
                <div className="text-lg font-semibold text-lime-500">{beatTime.toFixed(2)} ms</div>
              </div>
                <div className="grid gap-2">
                    <Label>Comparison to Beat Divisions:</Label>
                    <div className="text-lg font-semibold text-lime-500">
                    ~ {closestNoteDivision} of a beat
                    </div>
                </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
