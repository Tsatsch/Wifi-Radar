"use client"

import { X, Lock, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SignalCardProps {
  signal: any
  onClose: () => void
}

export function SignalCard({ signal, onClose }: SignalCardProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card - Mobile: Bottom Sheet, Desktop: Floating */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up rounded-t-3xl bg-glass p-6 backdrop-blur-xl md:bottom-auto md:right-6 md:top-24 md:left-auto md:w-[400px] md:animate-fade-in md:rounded-2xl">
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 text-foreground/60 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-start gap-3">
          <div className="font-space-grotesk text-xl font-bold text-foreground">{signal.ssid}</div>
          {signal.ssid.includes("Guest") || signal.ssid.includes("Free") ? (
            <LockOpen className="h-5 w-5 text-signal-green" />
          ) : (
            <Lock className="h-5 w-5 text-warning-amber" />
          )}
        </div>

        {/* Hero Metric */}
        <div className="mb-6">
          <div className="font-jetbrains text-5xl font-bold text-cyber-cyan">
            {signal.speed} <span className="text-2xl text-foreground/60">Mbps</span>
          </div>
        </div>

        {/* Trust Score */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-foreground/60">Trust Score</span>
            <span className="font-jetbrains text-signal-green">Verified by {signal.verified} peers</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-void/40">
            <div
              className="h-full bg-gradient-to-r from-signal-green to-cyber-cyan"
              style={{ width: `${Math.min((signal.verified / 30) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <Button className="w-full rounded-full bg-cyber-cyan text-void hover:bg-cyber-cyan/90">Connect Network</Button>
      </div>
    </>
  )
}
