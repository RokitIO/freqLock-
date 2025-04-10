"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// Multiplier options for cycle time
const multiplierOptions = [
  { label: "0.25x", value: 0.25 },
  { label: "0.5x", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "4x", value: 4 },
];

export default function Home() {
  // State variables for tempo, root note, multiplier, and calculated values
  const [tempo, setTempo] = useState<number | undefined>(120);
  const [rootNote, setRootNote] = useState<MusicalNote>(musicalNotes[6]); // Default to G3
  const [multiplier, setMultiplier] = useState<number>(1);
  const [frequency, setFrequency] = useState<number>(rootNote.frequency);
  const [timePerCycle, setTimePerCycle] = useState<number>(1000 / rootNote.frequency);
  const [musicalDelayTime, setMusicalDelayTime] = useState<number>(timePerCycle * multiplier);
  const [beatTime, setBeatTime] = useState<number>(60000 / (tempo || 120));
  const [beatRatio, setBeatRatio] = useState<number>(musicalDelayTime / beatTime);

  // useEffect hook to recalculate values when tempo, root note, or multiplier changes
  useEffect(() => {
    // Ensure tempo is a valid number
    const validTempo = tempo !== undefined ? tempo : 120;
    setFrequency(rootNote.frequency);
    setTimePerCycle(1000 / rootNote.frequency);
    setMusicalDelayTime((1000 / rootNote.frequency) * multiplier);
    setBeatTime(60000 / validTempo);
  }, [tempo, rootNote, multiplier]);

  // useEffect hook to recalculate beat ratio when musicalDelayTime or beatTime changes
  useEffect(() => {
    setBeatRatio(musicalDelayTime / beatTime);
  }, [musicalDelayTime, beatTime]);

  // Handler for tempo input change
  const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setTempo(value);
    } else {
      setTempo(undefined);
    }
  };

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
                <Input
                  type="number"
                  id="tempo"
                  placeholder="Enter BPM"
                  value={tempo !== undefined ? tempo.toString() : ''}
                  onChange={handleTempoChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rootNote">Root Note</Label>
                <Select onValueChange={(value) => {
                  const selectedNote = musicalNotes.find(note => note.note === value);
                  if (selectedNote) {
                    setRootNote(selectedNote);
                  }
                }}>
                  <SelectTrigger id="rootNote">
                    <SelectValue placeholder={rootNote.note} />
                  </SelectTrigger>
                  <SelectContent>
                    {musicalNotes.map((note) => (
                      <SelectItem key={note.note} value={note.note}>
                        {note.note} ({note.frequency.toFixed(2)} Hz)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="multiplier">Multiplier</Label>
                <Select onValueChange={(value) => setMultiplier(parseFloat(value))}>
                  <SelectTrigger id="multiplier">
                    <SelectValue placeholder={`${multiplier}x`} />
                  </SelectTrigger>
                  <SelectContent>
                    {multiplierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
