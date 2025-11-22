"use client"

import { Trophy, TrendingUp } from "lucide-react"

const topSignals = [
  { ssid: "TechHub_Enterprise", speed: 950, location: "Downtown", verifications: 142 },
  { ssid: "FastCafe_5G", speed: 780, location: "Mission District", verifications: 98 },
  { ssid: "Library_Premium", speed: 650, location: "Castro", verifications: 76 },
  { ssid: "CoWork_Gigabit", speed: 580, location: "SOMA", verifications: 64 },
]

export function SidebarLeaderboard() {
  return (
    <div className="fixed left-6 top-24 z-30 w-[320px] animate-fade-in rounded-2xl bg-glass p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-warning-amber" />
        <h3 className="font-space-grotesk text-lg font-bold text-foreground">Top Signals Nearby</h3>
      </div>

      <div className="space-y-3">
        {topSignals.map((signal, idx) => (
          <div key={idx} className="group cursor-pointer rounded-lg bg-void/20 p-3 transition-all hover:bg-void/40">
            <div className="mb-1 flex items-start justify-between">
              <div className="font-jetbrains text-sm font-semibold text-foreground">{signal.ssid}</div>
              <div className="flex items-center gap-1 text-xs text-signal-green">
                <TrendingUp className="h-3 w-3" />
                {signal.speed}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-foreground/60">
              <span>{signal.location}</span>
              <span>{signal.verifications} verifications</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
