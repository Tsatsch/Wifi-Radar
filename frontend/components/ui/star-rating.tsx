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
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyber-cyan rounded"
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              star <= value
                ? "fill-warning-amber text-warning-amber"
                : "text-foreground/30 hover:text-foreground/50"
            )}
          />
        </button>
      ))}
    </div>
  )
}

