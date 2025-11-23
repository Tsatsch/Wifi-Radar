"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
  className?: string
}

export function StarRating({ value, onChange, max = 5, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1 md:gap-1.5", className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-all active:scale-95 md:hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyber-cyan rounded touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center p-1"
          aria-label={`Rate ${star} out of ${max}`}
        >
          <Star
            className={cn(
              "h-7 w-7 md:h-8 md:w-8 transition-colors",
              star <= value
                ? "fill-warning-amber text-warning-amber"
                : "text-foreground/30 md:hover:text-foreground/50"
            )}
          />
        </button>
      ))}
    </div>
  )
}

