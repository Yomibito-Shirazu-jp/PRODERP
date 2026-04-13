import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#00a699] focus:ring-offset-2";
  const variants = {
    default: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    success: "border-transparent bg-green-50 text-green-700 border-green-200 border",
    warning: "border-transparent bg-yellow-50 text-yellow-700 border-yellow-200 border",
    danger: "border-transparent bg-red-50 text-red-700 border-red-200 border",
    outline: "text-gray-950 border-gray-200",
  };
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  )
}
export { Badge }
