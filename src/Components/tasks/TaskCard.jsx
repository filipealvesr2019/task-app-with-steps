import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableText from "./EditableText";
import StepItem from "./StepItem";

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
      
      const updatedTask = {
        ...task,
        steps: [...(task.steps || []), newStep]
      };
      
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
      
      className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header */}
      <div className="p-6 bg-slate-700 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <EditableText
              value={task.name}
              onSave={(newName) => onUpdateTask({ ...task, name: newName })}
              className="text-xl font-semibold text-white hover:text-slate-200 transition-colors"
              inputClassName="text-xl font-semibold w-full text-slate-900"
              placeholder="Enter task name..."
            />
            
            {totalSteps > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-slate-200">
                    {completedSteps} of {totalSteps} steps completed
                  </span>
                  <span className="text-sm text-white font-medium bg-slate-600 px-2 py-1 rounded">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-slate-500 rounded-full h-2">
                  <motion.div
                    
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    
                    className="bg-green-400 h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-200 hover:text-white hover:bg-slate-600"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTask(task.id)}
              className="text-red-300 hover:text-white hover:bg-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            
            className="overflow-hidden"
          >
            <div className="p-6 bg-slate-25">
              {/* Existing Steps */}
              {task.steps && task.steps.length > 0 && (
                <div className="space-y-3 mb-6">
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

              {/* Add New Step */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStep()}
                  placeholder="Add a new step..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors"
                />
                <Button
                  onClick={addStep}
                  disabled={!newStepText.trim()}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}