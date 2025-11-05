// src/components/common/RocketProgress.tsx

"use client"

import { useEffect, type KeyboardEvent } from "react"
import { motion, useAnimation } from "framer-motion"

const rocketImgSrc = "/images/rocket.jpg"

interface JourneyStep {
  id: number
  title: string
  desc: string
  x: number
  y: number
}

interface RocketProgressProps {
  steps: JourneyStep[]
  currentStep: number
  highestStepCompleted: number
  onStepClick?: (index: number) => void
}

const RocketProgress = ({ steps, currentStep, highestStepCompleted, onStepClick }: RocketProgressProps) => {
  const rocketControls = useAnimation()
  const pathControls = useAnimation()

  const pathSegments = steps.slice(0, -1).map((step, index) => {
    const nextStep = steps[index + 1]
    return `M ${step.x} ${step.y} L ${nextStep.x} ${nextStep.y}`
  })

  useEffect(() => {
    const activeStep = steps[currentStep]
    if (activeStep) {
      rocketControls.start({
        x: activeStep.x,
        y: activeStep.y,
        transition: { duration: 1.2, ease: "easeInOut" },
      })
    }

    pathControls.start((i) =>
      i < currentStep
        ? { pathLength: 1, transition: { duration: 1.2, ease: "easeInOut" } }
        : { pathLength: 0, transition: { duration: 0.2 } },
    )
  }, [currentStep, steps, rocketControls, pathControls])

  const onKeyActivate = (e: KeyboardEvent, index: number, isLocked: boolean) => {
    if (isLocked) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onStepClick?.(index)
    }
  }

  if (!steps || steps.length === 0) return <div>Loading journey...</div>

  return (
    <div className="w-full flex justify-center my-8 md:my-12 relative z-10">
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 1000 450"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        style={{ overflow: "visible", maxWidth: 1000 }}
        role="img"
        aria-label="Learning journey roadmap with rocket indicating current progress"
      >
        {/* Layer 1: Dotted path for the entire roadmap */}
        {pathSegments.map((path, index) => (
          <path
            key={`dotted-${index}`}
            d={path}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="1 12"
          />
        ))}

        {/* Layer 2: Animated solid path for completed segments */}
        {pathSegments.map((path, index) => (
          <motion.path
            key={`animated-${index}`}
            d={path}
            stroke="hsl(var(--primary))" // themed color for completed path
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            custom={index}
            animate={pathControls}
          />
        ))}

        {/* Layer 3: Rocket is rendered before nodes so nodes remain clickable */}
        <motion.g
          initial={{ x: steps[0]?.x || 0, y: steps[0]?.y || 0 }}
          animate={rocketControls}
          aria-label="Rocket position"
        >
          <foreignObject x={-40} y={-40} width={80} height={80}>
            <img
              src={rocketImgSrc || "/placeholder.svg"}
              alt="Rocket"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              crossOrigin="anonymous"
            />
          </foreignObject>
        </motion.g>

        {/* Layer 4: Stage nodes (clickable and keyboard accessible) */}
        {steps.map(({ id, title, desc, x, y }, i) => {
          const isCurrent = currentStep === i
          const isCompleted = i < currentStep
          const isLocked = i > highestStepCompleted + 1

          const fill = isLocked
            ? "hsl(var(--locked))"
            : isCurrent
              ? "hsl(var(--primary))"
              : isCompleted
                ? "hsl(var(--accent))"
                : "hsl(var(--secondary))"

          return (
            <g key={id}>
              <motion.g
                onClick={() => {
                  if (!isLocked) onStepClick?.(i)
                }}
                onKeyDown={(e) => onKeyActivate(e, i, isLocked)}
                role="button"
                tabIndex={isLocked ? -1 : 0}
                aria-disabled={isLocked}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${title}. ${isLocked ? "Locked" : isCompleted ? "Completed" : isCurrent ? "Current step" : "Available"}`}
                style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
                whileHover={!isLocked ? { scale: 1.08 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
              >
                {isCurrent && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={42}
                    fill={fill}
                    opacity={0.25}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.1, 0.25] }}
                    transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                )}

                <motion.circle
                  cx={x}
                  cy={y}
                  r={isCurrent ? 34 : 26}
                  fill={fill}
                  stroke={isCurrent ? "hsl(var(--background))" : "transparent"}
                  strokeWidth={4}
                />
                <text x={x} y={y + 6} fill="hsl(var(--background))" fontWeight="bold" fontSize="16" textAnchor="middle">
                  {id}
                </text>
              </motion.g>

              <foreignObject x={x - 110} y={y + 44} width={220} height={110}>
                <div
                  className={`step-description ${isLocked ? "opacity-60" : ""}`}
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{title}</h3>
                  <p style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.8 }}>{desc}</p>
                </div>
              </foreignObject>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default RocketProgress
