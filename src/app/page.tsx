"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Circle } from "lucide-react";

// Define the type for a musical note
interface MusicalNote {
  note: string;
  frequency: number;
}

// List of musical notes with their frequencies
const musicalNotes: MusicalNote[] = [
  { note: "C3", frequency: 130.81 },
  { note: "C#3/Db3", frequency: 138.59 },
  { note: "D3", frequency: 146.83 },
  { note: "D#3/Eb3", frequency: 155.56 },
  { note: "E3", frequency: 164.81 },
  { note: "F3", frequency: 174.61 },
  { note: "F#3/Gb3", frequency: 185.00 },
  { note: "G3", frequency: 196.00 },
  { note: "G#3/Ab3", frequency: 207.65 },
  { note: "A3", frequency: 220.00 },
  { note: "A#3/Bb3", frequency: 233.08 },
  { note: "B3", frequency: 246.94 },
  { note: "C4", frequency: 261.63 },
  { note: "C#4/Db4", frequency: 277.18 },
  { note: "D4", frequency: 293.66 },
  { note: "D#4/Eb4", frequency: 311.13 },
  { note: "E4", frequency: 329.63 },
  { note: "F4", frequency: 349.23 },
  { note: "F#4/Gb4", frequency: 369.99 },
  { note: "G4", frequency: 392.00 },
  { note: "G#4/Ab4", frequency: 415.30 },
  { note: "A4", frequency: 440.00 },
  { note: "A#4/Bb4", frequency: 466.16 },
  { note: "B4", frequency: 493.88 },
];

const initialTempo = 120;
const initialRootNote = musicalNotes[6]; // Default to G3
const initialMultiplier = 1;

export default function Home() {
  // State variables for tempo, root note, multiplier, and calculated values
  const [tempo, setTempo] = useState<number>(initialTempo);
  const [rootNote, setRootNote] = useState<MusicalNote>(initialRootNote);
  const [multiplier, setMultiplier] = useState<number>(initialMultiplier);
  const [frequency, setFrequency] = useState<number>(rootNote.frequency);
  const [timePerCycle, setTimePerCycle] = useState<number>(1000 / rootNote.frequency);
  const [musicalDelayTime, setMusicalDelayTime] = useState<number>(timePerCycle * multiplier);
  const [beatTime, setBeatTime] = useState<number>(60000 / tempo);
  const [beatRatio, setBeatRatio] = useState<number>(musicalDelayTime / beatTime);

  // useEffect hook to recalculate values when tempo, root note, or multiplier changes
  useEffect(() => {
    setFrequency(rootNote.frequency);
    setTimePerCycle(1000 / rootNote.frequency);
    setMusicalDelayTime((1000 / rootNote.frequency) * multiplier);
    setBeatTime(60000 / tempo);
  }, [tempo, rootNote, multiplier]);

  // useEffect hook to recalculate beat ratio when musicalDelayTime or beatTime changes
  useEffect(() => {
    setBeatRatio(musicalDelayTime / beatTime);
  }, [musicalDelayTime, beatTime]);

    // Handler for multiplier input change
    const handleMultiplierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      if (!isNaN(value) && value >= 0.25 && value <= 4) {
          setMultiplier(value);
      }
  };

  // Handler for resetting the input fields
  const handleReset = () => {
    setTempo(initialTempo);
    setRootNote(initialRootNote);
    setMultiplier(initialMultiplier);
  };

  const NoteButton = ({ note, frequency }: { note: string; frequency: number }) => (
    <button
      className="flex-1 p-2 rounded font-semibold text-sm text-center bg-secondary hover:bg-accent text-accent-foreground"
      onClick={() => setRootNote({ note, frequency })}
    >
      {note}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-teal-800 mb-4">
          Harmonic Delay Calculator
        </h1>

        <section className="w-full max-w-2xl">
          {/* Input Section */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Input Parameters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="tempo">Tempo (BPM)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="tempo"
                    min={30}
                    max={240}
                    step={1}
                    defaultValue={[tempo]}
                    onValueChange={(value) => setTempo(value[0])}
                    aria-label="Tempo in beats per minute"
                  />
                  <Input
                      type="number"
                      id="tempo-input"
                      className="w-20"
                      value={tempo.toString()}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 30 && value <= 240) {
                          setTempo(value);
                        }
                      }}
                      min={30}
                      max={240}
                      step={1}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Root Note</Label>
                <Sheet>
                  <SheetTrigger className="w-full flex items-center justify-center h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {rootNote.note} ({rootNote.frequency.toFixed(2)} Hz)
                  </SheetTrigger>
                  <SheetContent className="grid gap-4 p-4">
                    <div className="grid grid-cols-6 gap-2">
                      {musicalNotes.map((note) => (
                        <NoteButton key={note.note} note={note.note} frequency={note.frequency} />
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="multiplier">Multiplier</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="multiplier"
                    min={0.25}
                    max={4}
                    step={0.05}
                    defaultValue={[multiplier]}
                    onValueChange={(value) => setMultiplier(value[0])}
                    aria-label="Multiplier for delay time"
                  />
                  <Input
                      type="number"
                      id="multiplier-input"
                      className="w-20"
                      value={multiplier.toString()}
                      onChange={handleMultiplierChange}
                      min={0.25}
                      max={4}
                      step={0.01}
                  />
                </div>
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
                  ~ 1/{(1 / beatRatio).toFixed(0)}th of a beat
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
