import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

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
        className={`bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors ${inputClassName}`}
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
      className={`group flex items-center gap-2 cursor-pointer ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span className="flex-1">{value}</span>
      {showEditIcon && (
        <Pencil className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  );
}