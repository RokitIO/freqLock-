"use client";
import type { Mode } from "@/lib/scale";
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

interface MusicalNote { note: string; midiNote: number; frequency: number; }

const musicalNotes: MusicalNote[] = [ //added sharps to this as well
    { note: "C3", midiNote: 48, frequency: 130.81 },
    { note: "C#3", midiNote: 49, frequency: 138.59 },
    { note: "D3", midiNote: 50, frequency: 146.83 },
    { note: "D#3", midiNote: 51, frequency: 155.56 },
    { note: "E3", midiNote: 52, frequency: 164.81 },
    { note: "F3", midiNote: 53, frequency: 174.61 },
    { note: "F#3", midiNote: 54, frequency: 185.00 },
    { note: "G3", midiNote: 55, frequency: 196.00 },
    { note: "G#3", midiNote: 56, frequency: 207.65 },
    { note: "A3", midiNote: 57, frequency: 220.00 },
    { note: "A#3", midiNote: 58, frequency: 233.08 },
    { note: "B3", midiNote: 59, frequency: 246.94 },
    { note: "C4", midiNote: 60, frequency: 261.63 },
    { note: "C#4", midiNote: 61, frequency: 277.18 },
    { note: "D4", midiNote: 62, frequency: 293.66 },
    { note: "D#4", midiNote: 63, frequency: 311.13 },
    { note: "E4", midiNote: 64, frequency: 329.63 },
    { note: "F4", midiNote: 65, frequency: 349.23 },
    { note: "F#4", midiNote: 66, frequency: 369.99 },
    { note: "G4", midiNote: 67, frequency: 392.00 },
    { note: "G#4", midiNote: 68, frequency: 415.30 },
    { note: "A4", midiNote: 69, frequency: 440.00 },
    { note: "A#4", midiNote: 70, frequency: 466.16 },
    { note: "B4", midiNote: 71, frequency: 493.88 },
    { note: "C4", midiNote: 60, frequency: 261.63 },
];

// Chakra tones mapped to keys (7-tone system)
const chakraModes = {
    "C": { chakra: "Root", color: "Red", westernFreq: 130.81, solfeggioFreq: 396, energy: "Grounding | Stability | Presence" },
    "D": { chakra: "Sacral", color: "Orange", westernFreq: 146.83, solfeggioFreq: 417, energy: "Creativity | Sensuality | Pleasure" },
    "E": { chakra: "Solar Plexus", color: "Yellow", westernFreq: 164.81, solfeggioFreq: 528, energy: "Willpower | Confidence | Energy" },
    "F": { chakra: "Heart", color: "Green", westernFreq: 174.61, solfeggioFreq: 639, energy: "Love | Compassion | Healing" },
    "G": { chakra: "Throat", color: "Blue", westernFreq: 196.00, solfeggioFreq: 741, energy: "Truth | Voice | Resonance" },
    "A": { chakra: "Third Eye", color: "Indigo", westernFreq: 220.00, solfeggioFreq: 852, energy: "Intuition | Insight | Wisdom" },
    "B": { chakra: "Crown", color: "Violet", westernFreq: 246.94, solfeggioFreq: 963, energy: "Spirituality | Enlightenment | Connection" }
};

const sealPoints = {
    "C": { label: "Foundation", emoji: "🟫", energy: "Grounding | Power | Presence" },
    "D": { label: "Motion", emoji: "🌊", energy: "Flow | Desire | Creativity" },
    "E": { label: "Drive", emoji: "🔥", energy: "Confidence | Action | Radiance" },
    "F": { label: "Core", emoji: "💚", energy: "Connection | Compassion | Love" },
    "G": { label: "Voice", emoji: "🎙", energy: "Truth | Expression | Clarity" },
    "A": { label: "Vision", emoji: "🌀", energy: "Intuition | Insight | Perception" },
    "B": { label: "Signal", emoji: "👑", energy: "Awareness | Unity | Divine Flow" }
};

const initialTempo = 120;
const initialRootNote = musicalNotes[0];
const initialMultiplier = 1;
const initialSemitoneOffset = 0;
const initialBeatDivisionIndex = 11;

const beatDivisions = [
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

// Master numbers (numerology)
const masterNumbers = [11, 22, 33, 44, 55, 66, 77, 88, 99, 111];

// Common angel number intervals in Hz
const angelIntervals = [111, 222, 333, 444, 555, 666, 777, 888, 999];

type ChakraType = {
    chakra: string;
    color: string;
    westernFreq: number;
    solfeggioFreq: number;
    energy: string;
}

interface ChakraModes {
    [key: string]: ChakraType;
}

// ----------------------
// 2. UTILITY FUNCTIONS
// ----------------------

const beatDivisionToMultiplier = (beatDivision: string): number => {
    switch (beatDivision) {
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

    const [scaleNotes, setScaleNotes] = useState<string[]>(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    const [chordNotes, setChordNotes] = useState<string[]>(['C', 'E', 'G']);
    const [scaleType, setScaleType] = useState<Mode>("Major");
    const [chordType, setChordType] = useState<string>("major");

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

        const noteRoot = rootNote.note[0]; // Get first letter: C, D, etc.
        const seal = sealPoints[noteRoot];

        setChakra(seal ? seal.label : "Unknown");
        setChakraEnergy(seal ? seal.energy : "Unknown");
        //setChakraColor(seal ? seal.color : "grey");

        setChordNotes(generateChord(rootNote.note.replace(/[0-9]/g, ''), chordType));
    }, [tempo, rootNote, multiplier, semitoneOffset, selectedMultiplier, useHarmonicMultiples, beatDivisionIndex, scaleType, chordType]);

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

    // Use Effect to set the scale notes.
     useEffect(() => {
        const root = rootNote.note.replace(/[0-9]/g, '');
        setScaleNotes(generateScale(root, scaleType)); 
    }, [rootNote, scaleType]);

    const handleChordTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setChordType(event.target.value);
    };


    // Function to sort notes by frequency
    const sortNotesByFrequency = (notesArr: string[]): string[] => {
       
        
        return [...notesArr].sort((a, b) => {
            return getNoteIndex(a) - getNoteIndex(b);
        });
    };

    const getSealPointInfo = (note: string) => {
        const root = note[0]; // handle "C#", "D#", etc.
        return sealPoints[root] || {
            label: "—",
            emoji: "—",
            energy: "—"
        };
    };


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
                                        min={30}                                                                       max={240}
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
                                <Label>SealPoint Alignment:</Label>
                                <div className="text-lg font-semibold text-lime-500">
                                    {(() => {
                                        const sealPointInfo = getSealPointInfo(rootNote.note);
                                        return (
                                            <>
                                                {sealPointInfo.emoji} {sealPointInfo.label}
                                                <div>{sealPointInfo.energy}</div>
                                            </>
                                        );
                                    })()}
                                </div>
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
                                <Label htmlFor="scaleType">Scale Type</Label>
                                <Select value={scaleType} onValueChange={(value) => setScaleType(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a scale type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="major">Major</SelectItem>
                                        <SelectItem value="minor">Minor</SelectItem>
                                        <SelectItem value="Dorian">Dorian</SelectItem>
                                        <SelectItem value="Lydian">Lydian</SelectItem>
                                        <SelectItem value="Phrygian">Phrygian</SelectItem>
                                    </SelectContent>
                                </Select> 
                            </div>
                           <div className="grid gap-2">
                                <Label>Scale Notes:</Label>
                                <div>{sortNotesByFrequency(scaleNotes).map(note => `${note} (${noteFrequencies[note] || "N/A"} Hz)`).join(' - ')}</div>
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
                                <Label htmlFor="chordType">Chord Type</Label>
                                <Select value={chordType} onValueChange={(value) => setChordType(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a chord type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="major">Major</SelectItem>
                                        <SelectItem value="minor">Minor</SelectItem>
                                        <SelectItem value="dim">Diminished</SelectItem>
                                        <SelectItem value="aug">Augmented</SelectItem>
                                        <SelectItem value="maj7">Major 7th</SelectItem>
                                        <SelectItem value="min7">Minor 7th</SelectItem>
                                        <SelectItem value="dom7">Dominant 7th</SelectItem>
                                        <SelectItem value="sus2">Suspended 2nd</SelectItem>
                                        <SelectItem value="sus4">Suspended 4th</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Chord Notes:</Label>
                                <div>{chordNotes.map(note => `${note} (${noteFrequencies[note] || "N/A"} Hz)`).join(' - ')}</div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// updated frequencies and added flats
const noteFrequencies: { [key: string]: number } = {
    "C": 261.63, "C#": 277.18, "Db": 277.18, // C#/Db
    "D": 293.66, "D#": 311.13, "Eb": 311.13, // D#/Eb
    "E": 329.63, "F": 349.23, "F#": 369.99,  // F#/Gb
    "Gb": 369.99, "G": 392.00, "G#": 415.30, // G#/Ab
    "Ab": 415.30, "A": 440.00, "A#": 466.16, // A#/Bb
    "Bb": 466.16, "B": 493.88               
};

function getNoteIndex(note: string):number {
        const sanitizedNote = note.replace(/b/g, "#");
    
        let index = notes.indexOf(sanitizedNote);
        
        return index;
}



function transposeNote(root: string, interval: number) {
    const rootIndex = getNoteIndex(root);
    return notes[(rootIndex + interval) % 12];
}

const chordPatterns = {
    major: [0, 4, 7],minor: [0, 3, 7],dim: [0, 3, 6],aug: [0, 4, 8],maj7: [0, 4, 7, 11],min7: [0, 3, 7, 10],dom7: [0, 4, 7, 10],sus2: [0, 2, 7],sus4: [0, 5, 7]};

    function generateChord(root: string, type: string = "major") {
        const pattern = chordPatterns[type as keyof typeof chordPatterns];
        if (!pattern) return [];
    
        const rootIndex = getNoteIndex(root);
        if (rootIndex === -1) return [];
    
        const chordNotes = pattern.map(interval => {
            const transposedIndex = (rootIndex + interval) % 12;
            return notes[transposedIndex];
        });    
        return chordNotes;
    }

function getFrequencies(notesArr: string[]) {
    return notesArr.map(note => ({
        note: note,
        freq: noteFrequencies[note] || "N/A"
    }));    
}

const metaphysicalMap = {
    "C": { chakra: "Root", mood: "Grounding", symbol: "⛰️", energy: "Safety | Earth | Stability" },
    "D": { chakra: "Sacral", mood: "Creative", symbol: "💧", energy: "Desire | Motion | Emotion" },
    "E": { chakra: "Solar Plexus", mood: "Powerful", symbol: "🔥", energy: "Will | Confidence | Action" },
    "F": { chakra: "Heart", mood: "Loving", symbol: "💚", energy: "Compassion | Connection | Healing" },
    "G": { chakra: "Throat", mood: "Expressive", symbol: "🔵", energy: "Truth | Voice | Resonance" },
    "A": { chakra: "Third Eye", mood: "Visionary", symbol: "🌀", energy: "Insight | Intuition | Imagination" },
    "B": { chakra: "Crown", mood: "Spiritual", symbol: "👑", energy: "Unity | Light | Transcendence" }
};

function getMetaphysicalInfo(note: string) {
    const root = note.replace(/[0-9#b]/g, ''); //remove numbers, sharps and flats

    return metaphysicalMap[root] || {
        chakra: "—",
        mood: "—",
        symbol: "—",
        energy: "—"
    };
}


const majorScalePattern = [0, 2, 4, 5, 7, 9, 11];
const minorScalePattern = [0, 2, 3, 5, 7, 8, 10];
const dorianScalePattern = [0, 2, 3, 5, 7, 9, 10];
const lydianScalePattern = [0, 2, 4, 6, 7, 9, 11];
const phrygianScalePattern = [0, 1, 3, 5, 7, 8, 10];


export function generateScale(root: string, mode: Mode) {
    let pattern;

    switch (mode) {
        case "major":
            pattern = majorScalePattern;
            break;
        case "minor":
            pattern = minorScalePattern;
            break;
        case "Dorian":
            pattern = dorianScalePattern;
            break;
        case "Lydian":
            pattern = lydianScalePattern;
            break;
        case "Phrygian":
            pattern = phrygianScalePattern;
            break;
        default:
            pattern = majorScalePattern;
            break;
    }

    const rootIndex = getNoteIndex(root);
    if (rootIndex === -1) return []; // Handle invalid root notes

    return pattern.map(interval => transposeNote(root, interval));
}

export type Mode = "major" | "minor" | "Dorian" | "Lydian" | "Phrygian";




