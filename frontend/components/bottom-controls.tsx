"use client"

import { Filter, Crosshair, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface BottomControlsProps {
  onAddNew: () => void
  isScanning: boolean
  isWalletConnected?: boolean
}

export function BottomControls({ onAddNew, isScanning, isWalletConnected = false }: BottomControlsProps) {
  return (
    <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center">
      <div className="flex items-center gap-4">
        {/* Secondary Controls */}
        <Button size="icon" className="h-12 w-12 rounded-full bg-glass backdrop-blur-xl hover:bg-glass/80">
          <Filter className="h-5 w-5 text-foreground/80" />
        </Button>

        {/* Main Add WiFi Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <button
                  onClick={onAddNew}
                  disabled={isScanning || !isWalletConnected}
                  className="group relative h-20 w-20 rounded-full bg-gradient-to-br from-cyber-cyan to-signal-green shadow-[0_0_25px_rgba(34,211,238,0.6),0_0_50px_rgba(34,211,238,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_35px_rgba(34,211,238,0.8),0_0_70px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_0_25px_rgba(34,211,238,0.6),0_0_50px_rgba(34,211,238,0.4)]"
                >
                  {/* Animated background pulse */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyber-cyan to-signal-green ${isScanning ? "animate-ping opacity-75" : "animate-pulse-slow opacity-40"}`}
                  />
                  
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/40" />
                  
                  {/* Inner content container */}
                  <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <Plus
                      className={`h-10 w-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform ${isScanning ? "animate-spin" : "group-hover:scale-110"}`}
                      strokeWidth={3}
                    />
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/0 to-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </span>
            </TooltipTrigger>
            {!isWalletConnected && (
              <TooltipContent>
                <p>Connect your wallet to add WiFi measurements</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <Button size="icon" className="h-12 w-12 rounded-full bg-glass backdrop-blur-xl hover:bg-glass/80">
          <Crosshair className="h-5 w-5 text-foreground/80" />
        </Button>
      </div>
    </div>
  )
}
