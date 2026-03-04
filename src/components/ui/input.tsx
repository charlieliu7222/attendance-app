import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[10px] border-[1.5px] border-[rgba(74,158,111,0.15)] bg-white/70 px-4 py-3 text-base outline-none transition-all",
          "placeholder:text-text-secondary/60",
          "focus:border-primary focus:bg-white/90 focus:ring-[3px] focus:ring-primary/10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
