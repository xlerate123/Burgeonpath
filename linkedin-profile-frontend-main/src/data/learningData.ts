export type ContentBlock =
  | { type: "paragraph" | "quote" | "subheading" | "caseExample"; content: string }
  | { type: "list" | "tasks" | "reflection"; content: string[] }
  | { type: "hack"; content: string }

export type Module = {
  id: string
  title: string
  contentBlocks: ContentBlock[]
}

type Level = { id: number; modules: Module[] }
type Track = { id: string; title: string; description: string; modules: Module[] }

export const learningData: { levels: Level[]; tracks: Track[] } = {
  levels: [
    {
      id: 1,
      modules: [
        {
          id: "L1-M1",
          title: "Level 1 — Foundations",
          contentBlocks: [
            { type: "subheading", content: "Welcome" },
            { type: "paragraph", content: "Lay the groundwork for your journey." },
            {
              type: "list",
              content: ["Set goals", "Define audience", "Outline your timeline"],
            },
            { type: "hack", content: "Use a 30–60–90 day plan to stay focused." },
            { type: "tasks", content: ["Write your 3 goals", "Share with a peer"] },
          ],
        },
      ],
    },
    {
      id: 2,
      modules: [
        {
          id: "L2-M1",
          title: "Level 2 — Building Presence",
          contentBlocks: [
            { type: "subheading", content: "Show Up Consistently" },
            { type: "paragraph", content: "Build a consistent, value-driven presence." },
            {
              type: "list",
              content: ["Create a weekly cadence", "Pick 2 platforms", "Define themes"],
            },
            { type: "caseExample", content: "A creator grew 10x with a clear content system." },
            { type: "reflection", content: ["What do you want to be known for?"] },
          ],
        },
      ],
    },
  ],
  tracks: [
    {
      id: "brand",
      title: "Level 3 – Brand & Story",
      description: "Sharpen your narrative and positioning.",
      modules: [
        {
          id: "T1-M1",
          title: "Brand Narrative",
          contentBlocks: [
            { type: "subheading", content: "Craft Your Story" },
            { type: "paragraph", content: "Define your core narrative and proof." },
            { type: "tasks", content: ["Write a 1-paragraph story", "Collect 3 proofs"] },
          ],
        },
      ],
    },
    {
      id: "growth",
      title: "Level 3 – Growth Systems",
      description: "Design loops and experiments.",
      modules: [
        {
          id: "T2-M1",
          title: "Growth Loops",
          contentBlocks: [
            { type: "subheading", content: "Design Loops" },
            { type: "paragraph", content: "Use feedback loops for sustainable growth." },
            { type: "tasks", content: ["Sketch one loop", "Define inputs/outputs"] },
          ],
        },
      ],
    },
  ],
}

// Map 5-step journey to modules for demo
// 1: Level 1, 2: Level 2, 3: Assessment (custom module), 4: Track module (brand), 5: Finish (wrap-up)
const assessmentModule: Module = {
  id: "ASSESS",
  title: "Quick Assessment",
  contentBlocks: [
    { type: "paragraph", content: "Answer a few questions to tailor your path." },
    { type: "list", content: ["Preferred format?", "Experience level?", "Weekly time?"] },
    { type: "tasks", content: ["Pick your preferences", "Confirm your focus area"] },
  ],
}

const finishModule: Module = {
  id: "FINISH",
  title: "You're All Set!",
  contentBlocks: [
    { type: "paragraph", content: "Congratulations on completing your journey." },
    { type: "reflection", content: ["What did you learn?", "What is your next step?"] },
  ],
}

export function getModuleForStep(stepId: number): Module | null {
  switch (stepId) {
    case 1:
      return learningData.levels[0]?.modules[0] ?? null
    case 2:
      return learningData.levels[1]?.modules[0] ?? null
    case 3:
      return assessmentModule
    case 4:
      return learningData.tracks[0]?.modules[0] ?? null
    case 5:
      return finishModule
    default:
      return null
  }
}
