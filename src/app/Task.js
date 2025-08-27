
"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle, Clock, ListTodo } from "lucide-react";
import { Button } from "../components/ui/button";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";

const STORAGE_KEY = "taskManagement_tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Filter tasks based on completion status
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    
    const completedSteps = task.steps?.filter(step => step.status === "completed").length || 0;
    const totalSteps = task.steps?.length || 0;
    
    if (filter === "completed") return totalSteps > 0 && completedSteps === totalSteps;
    if (filter === "active") return totalSteps === 0 || completedSteps < totalSteps;
    
    return true;
  });

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => {
    const completedSteps = task.steps?.filter(step => step.status === "completed").length || 0;
    const totalSteps = task.steps?.length || 0;
    return totalSteps > 0 && completedSteps === totalSteps;
  }).length;
  const totalSteps = tasks.reduce((sum, task) => sum + (task.steps?.length || 0), 0);
  const completedSteps = tasks.reduce((sum, task) => 
    sum + (task.steps?.filter(step => step.status === "completed").length || 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Task Manager</h1>
            <p className="text-lg text-slate-600">Organize your work with elegant simplicity</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalTasks}</p>
                  <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{completedTasks}</p>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{totalTasks - completedTasks}</p>
                  <p className="text-sm font-medium text-slate-600">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0}%
                  </p>
                  <p className="text-sm font-medium text-slate-600">Progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              {["all", "active", "completed"].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  onClick={() => setFilter(filterType)}
                  className={`capitalize font-medium ${
                    filter === filterType 
                      ? "bg-slate-700 text-white hover:bg-slate-800" 
                      : "text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {filterType === "all" ? "All Tasks" : `${filterType} Tasks`}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowTaskForm(true)}
              className="bg-slate-700 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-shadow px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </Button>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div
                
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-slate-200">
                  <ListTodo className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
                </h3>
                <p className="text-slate-600 mb-6">
                  {filter === "all" 
                    ? "Create your first task to get started with better organization."
                    : `You don't have any ${filter} tasks at the moment.`
                  }
                </p>
                {filter === "all" && (
                  <Button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-slate-700 hover:bg-slate-800 text-white font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Task
                  </Button>
                )}
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Task Form Modal */}
        <AnimatePresence>
          {showTaskForm && (
            <TaskForm
              onAddTask={addTask}
              onCancel={() => setShowTaskForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
