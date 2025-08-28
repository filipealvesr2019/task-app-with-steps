// src/components/tasks/TaskForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

import styles from "./TaskForm.module.css";


export default function TaskForm({ onAddTask, onCancel }) {
  const [taskName, setTaskName] = useState("");
  const [steps, setSteps] = useState([""]);

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => {
    if (steps.length > 1) setSteps(steps.filter((_, i) => i !== index));
  };
  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    const validSteps = steps
      .filter(step => step.trim())
      .map(step => ({
        id: `step-${Date.now()}-${Math.random()}`,
        text: step.trim(),
        status: "pending"
      }));
    const newTask = {
      id: `task-${Date.now()}`,
      name: taskName.trim(),
      steps: validSteps
    };
    onAddTask(newTask);
    setTaskName("");
    setSteps([""]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={styles.overlay}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className={styles.modal}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Create New Task</div>
          <button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className={styles.closeBtn}
          >
            <X className={styles.iconSmall} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Task Name *</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Check instructions"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.stepsHeader}>
              <label className={styles.label}>Steps (optional)</label>
              <button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
                className={styles.addStepBtn}
              >
                <Plus className={styles.iconSmall} />
                Add Step
              </button>
            </div>

            <div className={styles.stepsList}>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={styles.stepRow}
                >
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Step ${index + 1} (e.g., Check PDF)`}
                    className={styles.input}
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(index)}
                      className={styles.removeBtn}
                    >
                      <X className={styles.iconSmall} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.createBtn}
              disabled={!taskName.trim()}
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
