import React from "react";
import { motion } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Brain, Info } from "lucide-react";

const ConfidenceCard = ({ confidence }) => {
  const value = Number(confidence);

  const getStatus = () => {
    if (value >= 90)
      return {
        text: "Excellent Confidence",
        color: "text-emerald-700",
        bg: "bg-emerald-100",
        dot: "bg-emerald-500",
      };

    if (value >= 80)
      return {
        text: "Very High Confidence",
        color: "text-blue-700",
        bg: "bg-blue-100",
        dot: "bg-blue-500",
      };

    if (value >= 70)
      return {
        text: "High Confidence",
        color: "text-cyan-700",
        bg: "bg-cyan-100",
        dot: "bg-cyan-500",
      };

    if (value >= 50)
      return {
        text: "Moderate Confidence",
        color: "text-amber-700",
        bg: "bg-amber-100",
        dot: "bg-amber-500",
      };

    return {
      text: "Low Confidence",
      color: "text-red-700",
      bg: "bg-red-100",
      dot: "bg-red-500",
    };
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-custom p-6 border border-slate-100 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
          <Brain className="w-6 h-6 text-primary" />
        </div>

        <div>
          <h3 className="font-bold text-lg text-accent">
            AI Confidence Score
          </h3>

          <p className="text-xs text-slate-500">
            Prediction Reliability
          </p>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="relative w-38 h-38 mx-auto">

        <div className="absolute inset-0 rounded-full bg-blue-200/20 blur-2xl"></div>

        <CircularProgressbar
          value={value}
          strokeWidth={10}
          text={`${value.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: "#4A9DE8",
            trailColor: "#EAF2FD",
            textColor: "#1E3A5F",
            textSize: "20px",
            strokeLinecap: "round",
          })}
        />
      </div>

      {/* Status Badge */}
      <div className="mt-6 flex justify-center">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${status.bg} ${status.color}`}
        >
          <span
            className={`w-0.5 h-0.5 rounded-full ${status.dot}`}
          ></span>

          {status.text}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Prediction Reliability</span>
          <span>{value.toFixed(1)}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">

        <div className="flex items-center gap-2 mb-2">

          <Info className="w-4 h-4 text-primary" />

          <span className="text-sm font-semibold text-accent">
            What does this mean?
          </span>

        </div>

        <p className="text-xs leading-6 text-slate-500">
          This score represents how confident the AI model is in its
          predicted skin condition based on the uploaded image. Higher
          confidence generally indicates a stronger match with patterns
          learned during model training, but it should not be considered
          a substitute for a professional medical diagnosis.
        </p>
      </div>
    </motion.div>
  );
};

export default ConfidenceCard;