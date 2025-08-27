
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskForm({ onAddTask, onCancel }) {
  const [taskName, setTaskName] = useState("");
  const [steps, setSteps] = useState([""]);

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
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
    
    // Reset form
    setTaskName("");
    setSteps([""]);
  };

  return (
    <motion.div
      
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
      >
        <div className="p-6 bg-slate-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Create New Task</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-slate-200 hover:text-white hover:bg-slate-600"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Task Name *
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g., Check instructions"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  Steps (optional)
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  className="text-slate-600 border-slate-300 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1} (e.g., Check PDF)`}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors"
                    />
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 py-3 border-slate-300 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white"
              disabled={!taskName.trim()}
            >
              Create Task
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
