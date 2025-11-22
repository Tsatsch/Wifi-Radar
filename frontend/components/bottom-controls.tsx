"use client"

import { Radar, Filter, Crosshair } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomControlsProps {
  onScan: () => void
  isScanning: boolean
}

export function BottomControls({ onScan, isScanning }: BottomControlsProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center">
      <div className="flex items-center gap-4">
        {/* Secondary Controls */}
        <Button size="icon" className="h-12 w-12 rounded-full bg-glass backdrop-blur-xl hover:bg-glass/80">
          <Filter className="h-5 w-5 text-foreground/80" />
        </Button>

        {/* Main Scan Button */}
        <button
          onClick={onScan}
          disabled={isScanning}
          className="relative h-16 w-16 rounded-full bg-cyber-cyan shadow-glow-cyan transition-all hover:scale-110 disabled:opacity-50"
        >
          <div
            className={`absolute inset-0 rounded-full bg-cyber-cyan ${isScanning ? "animate-ping" : "animate-pulse-slow"}`}
          />
          <Radar
            className={`relative z-10 h-8 w-8 text-void ${isScanning ? "animate-spin" : ""}`}
            style={{ margin: "0 auto", marginTop: "1rem" }}
          />
        </button>

        <Button size="icon" className="h-12 w-12 rounded-full bg-glass backdrop-blur-xl hover:bg-glass/80">
          <Crosshair className="h-5 w-5 text-foreground/80" />
        </Button>
      </div>
    </div>
  )
}
