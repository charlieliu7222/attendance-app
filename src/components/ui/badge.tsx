import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-[rgba(122,138,124,0.1)] text-text-secondary",
        present: "bg-[rgba(74,158,111,0.12)] text-[#2D6E4A]",
        late: "bg-[rgba(212,162,78,0.15)] text-[#8B6914]",
        absent: "bg-[rgba(199,91,91,0.12)] text-[#8B2E2E]",
        lunch: "bg-[rgba(91,158,170,0.12)] text-[#2D616E]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
