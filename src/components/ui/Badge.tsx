import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline" | "info";
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-bold transition-colors";
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    outline: "border border-gray-200 text-gray-800 bg-white",
  };
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  )
}
export { Badge }
