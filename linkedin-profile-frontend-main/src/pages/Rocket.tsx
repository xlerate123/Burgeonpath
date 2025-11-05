import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import rocketImg from "../../public/rocket.png";
import "../Rocket.css";

const steps = [
  { id: 1, title: "Learning Journey", desc: "Discover. Learn. Transform.", cx: 0, cy: 400, color: "#9966ff", tx: 59, ty: 40 },
  { id: 2, title: "Quick Assessment", desc: "Think. Reflect. Realign.", cx: 380, cy: 400, color: "#9966ff", tx: 50, ty: 40 },
  { id: 3, title: "Build Your Profile", desc: "Learn before doing.", cx: 500, cy: 300, color: "#9966ff", tx: 50, ty: 40 },
  { id: 4, title: "Profile Analysis & Suggestions", desc: "AI-powered deep dive into your profile.", cx: 790, cy: 270, color: "#9966ff", tx: 50, ty: 40 },
  { id: 5, title: "Continuous Growth with Community", desc: "Never grow alone.", cx: 877, cy: 118, color: "#9966ff", tx: 50, ty: 40 },
];

const pathData = "M 0 400 L 400 400 L 500 300 L 800 270 L 900 120";

export default function Rocket() {
  const navigate = useNavigate();
  const pathControls = useAnimation();
  const rocketControls = useAnimation();

  React.useEffect(() => {
    pathControls.start({
      pathLength: 1,
      transition: { duration: 4, ease: "easeInOut" },
    });

    rocketControls.start({
      translateX: [90, 300, 500, 700, 900],
      translateY: [400, 400, 300, 270, 70],
      rotate: [45, 0, 45, 0, 0],
      transition: { duration: 4, ease: "easeInOut" },
    });
  }, []);

  const lockControllers = React.useRef(
    steps.reduce((acc, s) => {
      acc[s.id] = useAnimation();
      return acc;
    }, {})
  ).current;

  const handleStepClick = (id) => {
    if (id === 1) {
      navigate("/educational-content");
      return;
    }

    const control = lockControllers[id];
    control.start({
      rotate: [0, -15, 15, -8, 8, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    });
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        transform: "scale(0.9)", // <-- Scales the whole component to 80%
        transformOrigin: " left  center", // keeps it centered
      }}
    >
      <svg
        width="100%"
        height="600"
        viewBox="0 0 900 450"
        fill="none"
        style={{
          overflow: "visible",
          maxWidth: "100%",
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill="#444"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>

        {/* Path */}
        <motion.path
          d={pathData}
          stroke="#0b5ed7"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={pathControls}
        />

        {/* Rocket */}
        <motion.g
          style={{ originX: 0.5, originY: 0.5 }}
          animate={rocketControls}
          initial={{
            translateX: 90,
            translateY: 400,
            rotate: 45,
          }}
        >
          <foreignObject x={-25} y={-25} width={120} height={80}>
            <img
              src={rocketImg}
              alt="rocket"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </foreignObject>
        </motion.g>

        {/* Steps */}
        {steps.map(({ id, title, desc, cx, cy, color, tx, ty }, i) => {
          const txPos = cx + tx;
          const tyPos = cy + ty;

          return (
            <motion.g
              key={id}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.8, duration: 0.6 }}
              style={{ cursor: "pointer" }}
              onClick={() => handleStepClick(id)}
            >
              {/* Step Circle */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={30}
                fill={color}
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.2 }}
              />

              {/* Step ID */}
              <motion.text
                x={cx}
                y={cy + 6}
                fill="#fff"
                fontWeight="bold"
                fontSize="20"
                textAnchor="middle"
                style={{ userSelect: "none" }}
              >
                {id.toString().padStart(2, "0")}
              </motion.text>

              {/* Lock above step */}
              {id !== 1 && (
                <foreignObject x={cx - 25} y={cy - 75} width={50} height={50}>
                  <motion.div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    animate={lockControllers[id]}
                  >
                    <Lock color="#333" size={32} />
                  </motion.div>
                </foreignObject>
              )}

              {/* Arrow to description */}
              <motion.line
                x1={cx + 32}
                y1={cy + 20}
                x2={txPos}
                y2={tyPos}
                stroke="#555"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1 + i * 0.8, duration: 0.8 }}
              />

              {/* Description */}
              <foreignObject x={txPos} y={tyPos - 10} width={280} height={230}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#222",
                    lineHeight: "1.3em",
                  }}
                >
                  <div style={{ marginTop: 39 }}>
                    {title}
                    <br />
                    <span style={{ fontWeight: 100 }}>{desc}</span>
                  </div>
                </div>
              </foreignObject>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
