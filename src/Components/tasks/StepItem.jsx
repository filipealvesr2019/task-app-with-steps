import React from "react";
import { motion } from "framer-motion";
import { Circle, CheckCircle2 } from "lucide-react";
import EditableText from "./EditableText";

export default function StepItem({ step, onUpdateStep, onToggleStatus }) {
  const isCompleted = step.status === "completed";

  return (
    <motion.div
      
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      
      className={`group flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
        isCompleted 
          ? "bg-green-50 border border-green-200" 
          : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
      }`}
    >
      <button
        onClick={() => onToggleStatus(step.id)}
        className={`mt-0.5 p-1 rounded-full transition-colors duration-200 ${
          isCompleted 
            ? "text-green-600 hover:text-green-700" 
            : "text-slate-500 hover:text-slate-600"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <EditableText
          value={step.text}
          onSave={(newText) => onUpdateStep(step.id, newText)}
          className={`text-base leading-relaxed font-medium ${
            isCompleted 
              ? "line-through text-green-700" 
              : "text-slate-700"
          }`}
          inputClassName="w-full text-base"
          placeholder="Enter step description..."
          showEditIcon={false}
        />
      </div>
    </motion.div>
  );
}