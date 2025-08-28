// src/components/tasks/StepItem.jsx
import React from "react";
import { motion } from "framer-motion";
import { Circle, CheckCircle2 } from "lucide-react";
import EditableText from "./EditableText";
import styles from "./StepItem.module.css";

export default function StepItem({ step, onUpdateStep, onToggleStatus }) {
  const isCompleted = step.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`${styles.stepItem} ${isCompleted ? styles.completed : styles.pending}`}
    >
      <button
        onClick={() => onToggleStatus(step.id)}
        className={`${styles.toggleBtn} ${isCompleted ? styles.toggleDone : styles.togglePending}`}
        aria-label="toggle step status"
      >
        {isCompleted ? (
          <CheckCircle2 className={styles.iconLarge} />
        ) : (
          <Circle className={styles.iconLarge} />
        )}
      </button>

      <div className={styles.stepContent}>
        <EditableText
          value={step.text}
          onSave={(newText) => onUpdateStep(step.id, newText)}
          className={isCompleted ? styles.stepTextCompleted : styles.stepText}
          inputClassName={styles.stepInput}
          placeholder="Enter step description..."
          showEditIcon={false}
        />
      </div>
    </motion.div>
  );
}
