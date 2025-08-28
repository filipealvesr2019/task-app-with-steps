// src/components/tasks/EditableText.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import styles from "./EditableText.module.css";

export default function EditableText({ 
  value, 
  onSave, 
  className = "", 
  inputClassName = "",
  placeholder = "Enter text...",
  showEditIcon = true 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <motion.input
        ref={inputRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${styles.input} ${inputClassName}`}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div 
      className={`${styles.viewWrapper} ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span className={styles.viewValue}>{value}</span>
      {showEditIcon && (
        <Pencil className={styles.pencilIcon} />
      )}
    </div>
  );
}
