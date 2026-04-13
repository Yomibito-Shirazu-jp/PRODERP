import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00a699] disabled:pointer-events-none disabled:opacity-50";
    const variants = {
      primary: "bg-[#00a699] text-white hover:bg-[#008f84] shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
      ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    };
    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-9 px-4 py-2",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    };
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button }
