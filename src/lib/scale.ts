// Array of all possible notes in western music notation
export const allNotes = [
  "C", 
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Type for the different modes of a scale
export type Mode =
  | "Major"
  | "Minor"
  | "Dorian"
  | "Phrygian"
  | "Lydian"
  | "Mixolydian"
  | "Locrian";

// Function to generate a musical scale
// rootNote: The starting note of the scale (e.g., "C", "G#")
// mode: The mode of the scale (e.g., "Major", "Minor", "Dorian")
// Returns: An array of strings representing the notes in the scale, or an empty array if the rootNote or mode is invalid
export function generateScale(rootNote: string, mode: Mode): string[] {
  // Find the index of the root note in the allNotes array
  const rootIndex = allNotes.indexOf(rootNote);
  // If the root note is not found, return an empty array
  if (rootIndex === -1) {
    return [];
  }

    // Define the intervals for each mode
    const intervals: number[] | undefined = {
        // Intervals for Major scale (whole, whole, half, whole, whole, whole, half)
        Major: [2, 2, 1, 2, 2, 2, 1],
        // Intervals for Minor scale (whole, half, whole, whole, half, whole, whole)
        Minor: [2, 1, 2, 2, 1, 2, 2],
        // Intervals for Dorian scale (whole, half, whole, whole, whole, half, whole)
        Dorian: [2, 1, 2, 2, 2, 1, 2],
        // Intervals for Phrygian scale (half, whole, whole, whole, half, whole, whole)
        Phrygian: [1, 2, 2, 2, 1, 2, 2],
        // Intervals for Lydian scale (whole, whole, whole, half, whole, whole, half)
        Lydian: [2, 2, 2, 1, 2, 2, 1],
        // Intervals for Mixolydian scale (whole, whole, half, whole, whole, half, whole)
        Mixolydian: [2, 2, 1, 2, 2, 1, 2],
        // Intervals for Locrian scale (half, whole, whole, half, whole, whole, whole)
        Locrian: [1, 2, 2, 1, 2, 2, 2],
    }[mode];

    // If the mode is not valid, return an empty array
    if (!intervals) {
        return [];
    }
    // Array to store the notes of the scale
  const scale: string[] = [];
  // Start at the root note index
  let currentIndex = rootIndex;
    // Generate the scale by iterating through the intervals
    for (let i = 0; i < intervals.length; i++) {
        // Add the current note to the scale
        scale.push(allNotes[currentIndex]);
        // Move to the next note based on the interval
        currentIndex = (currentIndex + intervals[i]) % allNotes.length;
    }
    return scale;
}