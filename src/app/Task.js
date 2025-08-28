// src/app/TasksPage.jsx
"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListTodo, CheckCircle, Clock } from "lucide-react";
import { Button } from "../Components/UI/Button";

import styles from "./TasksPage.module.css";
import TaskCard from "@/Components/tasks/TaskCard";
import TaskForm from "@/Components/tasks/TaskForm";

const STORAGE_KEY = "taskManagement_tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState("all");

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

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    const completedSteps = task.steps?.filter(step => step.status === "completed").length || 0;
    const totalSteps = task.steps?.length || 0;
    if (filter === "completed") return totalSteps > 0 && completedSteps === totalSteps;
    if (filter === "active") return totalSteps === 0 || completedSteps < totalSteps;
    return true;
  });

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
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.headerWrapper}
        >
          <div className={styles.headerCenter}>
            <h1 className={styles.title}>Task Manager</h1>
            <p className={styles.subtitle}>Organize your work with elegant simplicity</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.card}>
              <div className={styles.cardInner}>
                <div className={`${styles.iconCircle} ${styles.blue}`}>
                  <ListTodo className={styles.iconSmall} />
                </div>
                <div>
                  <p className={styles.cardNumber}>{totalTasks}</p>
                  <p className={styles.cardLabel}>Total Tasks</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <div className={`${styles.iconCircle} ${styles.green}`}>
                  <CheckCircle className={styles.iconSmall} />
                </div>
                <div>
                  <p className={styles.cardNumber}>{completedTasks}</p>
                  <p className={styles.cardLabel}>Completed</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <div className={`${styles.iconCircle} ${styles.amber}`}>
                  <Clock className={styles.iconSmall} />
                </div>
                <div>
                  <p className={styles.cardNumber}>{totalTasks - completedTasks}</p>
                  <p className={styles.cardLabel}>Active</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardInner}>
                <div className={`${styles.iconCircle} ${styles.purple}`}>
                  <span className={styles.percentSign}>%</span>
                </div>
                <div>
                  <p className={styles.cardNumber}>
                    {totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0}%
                  </p>
                  <p className={styles.cardLabel}>Progress</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              {["all", "active", "completed"].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  onClick={() => setFilter(filterType)}
                  className={`${styles.filterBtn} ${filter === filterType ? styles.filterActive : ""}`}
                >
                  {filterType === "all" ? "All Tasks" : `${filterType} Tasks`}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => setShowTaskForm(true)}
              className={styles.createBtn}
            >
              <Plus className={styles.iconSmall + " " + styles.iconWithMargin} />
              Create Task
            </Button>
          </div>
        </motion.div>

        <div className={styles.tasksList}>
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.emptyState}
              >
                <div className={styles.emptyIcon}>
                  <ListTodo className={styles.emptyIconInner} />
                </div>
                <h3 className={styles.emptyTitle}>
                  {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
                </h3>
                <p className={styles.emptyText}>
                  {filter === "all" 
                    ? "Create your first task to get started with better organization."
                    : `You don't have any ${filter} tasks at the moment.`
                  }
                </p>
                {filter === "all" && (
                  <Button
                    onClick={() => setShowTaskForm(true)}
                    className={styles.createBtnAlt}
                  >
                    <Plus className={styles.iconSmall + " " + styles.iconWithMargin} />
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
