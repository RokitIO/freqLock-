"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ----------------------
// 1. CONFIGS & DATASETS
// ----------------------

// Chakra tones mapped to keys (7-tone system)
const chakraMap = {
    "C": { chakra: "Root", color: "Red", westernFreq: 130.81, solfeggioFreq: 396, energy: "Grounding | Stability | Presence" },
    "D": { chakra: "Sacral", color: "Orange", westernFreq: 146.83, solfeggioFreq: 417, energy: "Creativity | Sensuality | Pleasure" },
    "E": { chakra: "Solar Plexus", color: "Yellow", westernFreq: 164.81, solfeggioFreq: 528, energy: "Willpower | Confidence | Energy" },
    "F": { chakra: "Heart", color: "Green", westernFreq: 174.61, solfeggioFreq: 639, energy: "Love | Compassion | Healing" },
    "G": { chakra: "Throat", color: "Blue", westernFreq: 196.00, solfeggioFreq: 741, energy: "Truth | Voice | Resonance" },
    "A": { chakra: "Third Eye", color: "Indigo", westernFreq: 220.00, solfeggioFreq: 852, energy: "Intuition | Insight | Wisdom" },
    "B": { chakra: "Crown", color: "Violet", westernFreq: 246.94, solfeggioFreq: 963, energy: "Spirituality | Enlightenment | Connection" }
};

// Master numbers (numerology)
const masterNumbers = [11, 22, 33, 44, 55, 66, 77, 88, 99, 111];

// Common angel number intervals in Hz
const angelIntervals = [111, 222, 333, 444, 555, 666, 777, 888, 999];

interface MusicalNote { note: string; midiNote: number; frequency: number; }

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
const initialRootNote = musicalNotes[0];
const initialMultiplier = 1;
const initialSemitoneOffset = 0;
const initialBeatDivisionIndex = 11;

const beatDivisions = [
    "64x", "32x", "16x", "8x", "4x", "2x Dotted 1/2 note", "2x", "Dotted 1/2 note",
    "1/2 note", "1/2 note triplets", "Dotted 1/4 note", "1/4 note", "1/4 note triplets",
    "Dotted 1/8 note", "1/8 note", "1/8 note triplets", "Dotted 1/16 note", "1/16 note",
    "1/16 note triplets", "Dotted 1/32 note", "1/32 note", "1/32 note triplets",
    "Dotted 1/64 note", "1/64 note", "1/64 note triplets"
];

const multipliers = [
    { label: '1/4x (2 octaves below)', value: 0.25 },
    { label: '1/2x (subharmonic)', value: 0.5 },
    { label: '1x (fundamental)', value: 1 },
    { label: '2x (harmonic)', value: 2 },
    { label: '4x (rich tail)', value: 4 },
    { label: '8x', value: 8 },
    { label: '16x', value: 16 },
    { label: '32x', value: 32 },
    { label: '64x', value: 64 },
];

// ----------------------
// 2. UTILITY FUNCTIONS
// ----------------------

const beatDivisionToMultiplier = (beatDivision: string): number => {
    switch (beatDivision) {
        case "64x": return 64;
        case "32x": return 32;
        case "16x": return 16;
        case "8x": return 8;
        case "4x": return 4;
        case "2x Dotted 1/2 note": return 1.5;
        case "2x": return 2;
        case "Dotted 1/2 note": return 0.75;
        case "1/2 note": return 0.5;
        case "1/2 note triplets": return 1 / 3;
        case "Dotted 1/4 note": return 0.375;
        case "1/4 note": return 0.25;
        case "1/4 note triplets": return 1 / 6;
        case "Dotted 1/8 note": return 0.1875;
        case "1/8 note": return 0.125;
        case "1/8 note triplets": return 1 / 12;
        case "Dotted 1/16 note": return 0.09375;
        case "1/16 note": return 0.0625;
        case "1/16 note triplets": return 1 / 24;
        case "Dotted 1/32 note": return 0.046875;
        case "1/32 note": return 0.03125;
        case "1/32 note triplets": return 1 / 48;
        case "Dotted 1/64 note": return 0.0234375;
        case "1/64 note": return 0.015625;
        case "1/64 note triplets": return 1 / 96;
        default: return 0.25;
    }
};

// ----------------------
// 3. React functional component for the Home page
export default function Home() {
    // State variables using the useState hook
    const [tempo, setTempo] = useState<number>(initialTempo);
    const [rootNote, setRootNote] = useState<MusicalNote>(initialRootNote);
    const [multiplier, setMultiplier] = useState<number>(initialMultiplier);
    const [semitoneOffset, setSemitoneOffset] = useState<number>(initialSemitoneOffset);
    const [useHarmonicMultiples, setUseHarmonicMultiples] = useState<boolean>(false);
    const [selectedMultiplier, setSelectedMultiplier] = useState<number>(multipliers[2].value); // Default to 1x
    const [beatDivisionIndex, setBeatDivisionIndex] = useState<number>(initialBeatDivisionIndex);

    const [frequency, setFrequency] = useState<number>(initialRootNote.frequency);
    const [timePerCycle, setTimePerCycle] = useState<number>(1000 / initialRootNote.frequency);
    const [musicalDelayTime, setMusicalDelayTime] = useState<number>(initialMultiplier * (1000 / initialRootNote.frequency));
    const [beatTime, setBeatTime] = useState<number>(60000 / initialTempo);
    const [beatRatio, setBeatRatio] = useState<number>((initialMultiplier * (1000 / initialRootNote.frequency)) / (60000 / initialTempo));
    const [closestNoteDivision, setClosestNoteDivision] = useState<string>("");

    const [chakra, setChakra] = useState<string>("");
    const [chakraEnergy, setChakraEnergy] = useState<string>("");
    const [chakraColor, setChakraColor] = useState<string>("");

    // Recalculate values whenever inputs change
    useEffect(() => {
        const newFrequency = rootNote.frequency * Math.pow(2, semitoneOffset / 12);
        const newTimePerCycle = 1000 / newFrequency;
        const selectedMultiplierValue = useHarmonicMultiples ? selectedMultiplier : beatDivisionToMultiplier(beatDivisions[beatDivisionIndex]);
        const newMusicalDelayTime = newTimePerCycle * selectedMultiplierValue;
        const newBeatTime = 60000 / tempo;
        const newBeatRatio = newMusicalDelayTime / newBeatTime;

        setFrequency(newFrequency);
        setTimePerCycle(newTimePerCycle);
        setMusicalDelayTime(newMusicalDelayTime);
        setBeatTime(newBeatTime);
        setBeatRatio(newBeatRatio);
        setClosestNoteDivision(getClosestNoteDivision(newBeatRatio));

        const chakraData = chakraModes[rootNote.note[0]];
        setChakra(chakraData ? chakraData.chakra : "Unknown");
        setChakraEnergy(chakraData ? chakraData.energy : "Unknown");
        setChakraColor(chakraData ? chakraData.color : "grey");
    }, [tempo, rootNote, multiplier, semitoneOffset, selectedMultiplier, useHarmonicMultiples, beatDivisionIndex]);

    // Handlers
    const handleSemitoneOffsetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value) && value >= -24 && value <= 24) {
            setSemitoneOffset(value);
        }
    };

    const handleTempoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value >= 30 && value <= 240) {
            setTempo(value);
        }
    };

    const handleReset = () => {
        setTempo(initialTempo);
        setRootNote(initialRootNote);
        setMultiplier(initialMultiplier);
        setSemitoneOffset(initialSemitoneOffset);
        setBeatDivisionIndex(initialBeatDivisionIndex);
        setSelectedMultiplier(multipliers[2].value);
        setUseHarmonicMultiples(false);
    };

    const handleMultiplierChange = (value: number[]) => {
        if (value && value.length > 0) {
            const index = Math.round(value[0]);
            setBeatDivisionIndex(index);
            setMultiplier(beatDivisionToMultiplier(beatDivisions[index]));
        }
    };

    const PianoKey = ({ note, midiNote, frequency, isBlack, isSelected }: { note: string; midiNote: number; frequency: number; isBlack: boolean; isSelected: boolean }) => {
        const keyWidth = isBlack ? '1.5rem' : '2rem';
        const keyHeight = isBlack ? '3rem' : '5rem';
        const keyClass = isBlack ? 'bg-black text-white' : 'bg-white text-black border-2 border-gray-200';
        const selectedClass = isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground';
        const lockedClass = isSelected ? 'ring-2 ring-accent ring-inset' : '';

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

    // Sample scale
    const [scaleNotes, setScaleNotes] = useState(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    const [chordNotes, setChordNotes] = useState(['C', 'E', 'G']);

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
                                <Label htmlFor="multiplier">
                                    {!useHarmonicMultiples ? "Beat Division" : "Harmonic Multiplier"}
                                </Label>
                                <Switch id="useHarmonicMultiples" onCheckedChange={setUseHarmonicMultiples} />
                                <Label htmlFor="useHarmonicMultiples">Use Harmonic Multiples</Label>
                                {useHarmonicMultiples ? (
                                    <Select onValueChange={(value) => setSelectedMultiplier(parseFloat(value))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a multiplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {multipliers.map((multiplier) => (
                                                <SelectItem key={multiplier.value} value={multiplier.value.toString()}>
                                                    {multiplier.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Slider
                                        id="multiplier"
                                        min={0}
                                        max={beatDivisions.length - 1}
                                        step={1}
                                        defaultValue={[initialBeatDivisionIndex]}
                                        value={[beatDivisionIndex]}
                                        onValueChange={(value) => {
                                            if (value && value.length > 0) {
                                                const index = Math.round(value[0]);
                                                setBeatDivisionIndex(index);
                                                setMultiplier(beatDivisionToMultiplier(beatDivisions[index]));
                                            }
                                        }}
                                        aria-label="Beat Division"
                                    />
                                )}

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
                                <div className="text-lg font-semibold text-lime-500">{Number(frequency).toFixed(2)} Hz</div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Time per Cycle:</Label>
                                <div className="text-lg font-semibold text-lime-500">{Number(timePerCycle).toFixed(2)} ms</div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Musical Delay Time:</Label>
                                <div className="text-lg font-semibold text-lime-500">{Number(musicalDelayTime).toFixed(2)} ms</div>
                            </div>
                            <div className="grid gap-2">
                                <Label>1 Beat:</Label>
                                <div className="text-lg font-semibold text-lime-500">{Number(beatTime).toFixed(2)} ms</div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Comparison to Beat Divisions:</Label>
                                <div className="text-lg font-semibold text-lime-500">
                                    ~ {closestNoteDivision} of a beat
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Chakra Alignment:</Label>
                                <div className={cn(
                                    "text-lg font-semibold",
                                    {
                                        "text-red-500": chakraColor === "Red",
                                        "text-orange-500": chakraColor === "Orange",
                                        "text-yellow-500": chakraColor === "Yellow",
                                        "text-green-500": chakraColor === "Green",
                                        "text-blue-500": chakraColor === "Blue",
                                        "text-indigo-500": chakraColor === "Indigo",
                                        "text-violet-500": chakraColor === "Violet",
                                        "text-gray-500": chakraColor === "grey",
                                    }
                                )}>{chakra}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Chakra Energy:</Label>
                                <div className="text-lg font-semibold text-lime-500">{chakraEnergy}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scales Section */}
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Scale Generator</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Scale Notes:</Label>
                                <div>{scaleNotes.join(' - ')}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chords Section */}
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Chord Library</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Chord Notes:</Label>
                                <div>{chordNotes.join(' - ')}</div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );

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
}
