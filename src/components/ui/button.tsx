import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary-light to-primary text-white shadow-[0_2px_8px_rgba(74,158,111,0.25)]",
        accent: "bg-gradient-to-br from-accent-light to-accent text-white shadow-[0_2px_8px_rgba(224,135,92,0.35)]",
        danger: "bg-gradient-to-br from-[#E07070] to-danger text-white shadow-[0_2px_8px_rgba(199,91,91,0.25)]",
        outline: "border-2 border-border bg-white/60 text-text-secondary",
        ghost: "bg-transparent text-text-secondary",
        cancel: "bg-[rgba(122,138,124,0.08)] text-text-secondary",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
