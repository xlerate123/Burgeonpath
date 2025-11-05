import { create } from "zustand"
import { persist } from "zustand/middleware"

type ProgressState = {
  currentStep: number // zero-based index of the current step in the journey
  highestStepCompleted: number // zero-based index of the highest completed step, -1 if none
  completeStep: (stepIndex: number) => void
  restartJourney: () => void
  setCurrentStep: (stepIndex: number) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Start at step 0 with nothing completed
      currentStep: 0,
      highestStepCompleted: -1,

      setCurrentStep: (stepIndex: number) => {
        set({ currentStep: Math.max(0, stepIndex) })
      },

      completeStep: (stepIndex: number) => {
        const clampedIndex = Math.max(0, stepIndex)
        const currentHighest = get().highestStepCompleted
        const newHighest = Math.max(currentHighest, clampedIndex)
        // Advance current step to the next one after the highest completed
        set({
          highestStepCompleted: newHighest,
          currentStep: newHighest + 1,
        })
      },

      restartJourney: () => {
        set({ currentStep: 0, highestStepCompleted: -1 })
      },
    }),
    {
      name: "progress-store",
      version: 1,
      // Default storage is localStorage in the browser via persist
    },
  ),
)
