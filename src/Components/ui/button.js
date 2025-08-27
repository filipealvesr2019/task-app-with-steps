"use client"
import React from "react";

// Props: children (texto), icon (React component), className, ...rest
export function Button({ children, icon: Icon, className = "", ...rest }) {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors bg-slate-700 text-white hover:bg-slate-800 shadow-md hover:shadow-lg ${className}`}
      {...rest}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}
