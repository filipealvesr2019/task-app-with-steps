// src/components/tasks/TaskCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./EditableText";
import StepItem from "./StepItem";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onUpdateTask, onDeleteTask }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newStepText, setNewStepText] = useState("");

  const completedSteps = task.steps?.filter(step => step.status === "completed").length || 0;
  const totalSteps = task.steps?.length || 0;
  const completionPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const addStep = () => {
    if (newStepText.trim()) {
      const newStep = {
        id: `step-${Date.now()}`,
        text: newStepText.trim(),
        status: "pending"
      };
      const updatedTask = { ...task, steps: [...(task.steps || []), newStep] };
      onUpdateTask(updatedTask);
      setNewStepText("");
    }
  };

  const updateStepText = (stepId, newText) => {
    const updatedSteps = task.steps.map(step =>
      step.id === stepId ? { ...step, text: newText } : step
    );
    onUpdateTask({ ...task, steps: updatedSteps });
  };

  const toggleStepStatus = (stepId) => {
    const updatedSteps = task.steps.map(step =>
      step.id === stepId 
        ? { ...step, status: step.status === "pending" ? "completed" : "pending" }
        : step
    );
    onUpdateTask({ ...task, steps: updatedSteps });
  };

  const deleteStep = (stepId) => {
    const updatedSteps = task.steps.filter(step => step.id !== stepId);
    onUpdateTask({ ...task, steps: updatedSteps });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={styles.card}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <EditableText
            value={task.name}
            onSave={(newName) => onUpdateTask({ ...task, name: newName })}
            className={styles.taskTitle}
            inputClassName={styles.taskTitleInput}
            placeholder="Enter task name..."
          />

          {totalSteps > 0 && (
            <div className={styles.progressSection}>
              <div className={styles.progressMeta}>
                <span className={styles.progressText}>{completedSteps} of {totalSteps} steps completed</span>
                <span className={styles.progressBadge}>{Math.round(completionPercentage)}%</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={styles.progressFill}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.headerRight}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.iconBtn}
          >
            {isExpanded ? (
              <ChevronUp className={styles.iconSmall} />
            ) : (
              <ChevronDown className={styles.iconSmall} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTask(task.id)}
            className={styles.deleteBtn}
          >
            <Trash2 className={styles.iconSmall} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.body}
          >
            <div className={styles.stepsWrapper}>
              {task.steps && task.steps.length > 0 && (
                <div className={styles.stepList}>
                  <AnimatePresence>
                    {task.steps.map((step) => (
                      <StepItem
                        key={step.id}
                        step={step}
                        onUpdateStep={updateStepText}
                        onToggleStatus={toggleStepStatus}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className={styles.addStepRow}>
                <input
                  type="text"
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStep()}
                  placeholder="Add a new step..."
                  className={styles.addStepInput}
                />
                <Button
                  onClick={addStep}
                  disabled={!newStepText.trim()}
                  className={styles.addStepBtn}
                >
                  <Plus className={styles.iconSmall} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
