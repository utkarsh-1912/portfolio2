import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-base transition-colors file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
