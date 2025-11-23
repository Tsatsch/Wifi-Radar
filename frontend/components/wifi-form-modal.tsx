"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/ui/star-rating"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WiFiFormModalProps {
  speed: number
  location: { lat: number; lng: number } | null
  onClose: () => void
  onSubmit: (data: WiFiFormData) => void
}

export interface WiFiFormData {
  wifiName: string
  speed: number
  location: { lat: number; lng: number } | null
  satisfaction: number
}

export function WiFiFormModal({ speed, location, onClose, onSubmit }: WiFiFormModalProps) {
  const [wifiName, setWifiName] = useState("")
  const [satisfaction, setSatisfaction] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wifiName.trim()) {
      toast({
        title: "WiFi name required",
        description: "Please enter a name for your WiFi network",
        variant: "destructive",
      })
      return
    }

    if (satisfaction === 0) {
      toast({
        title: "Rating required",
        description: "Please rate your satisfaction with this network",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        wifiName,
        speed,
        location,
        satisfaction,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 animate-scale-in">
        <div className="relative rounded-2xl bg-glass p-8 backdrop-blur-xl border border-cyber-cyan/20">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1 text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="mb-6 font-space-grotesk text-2xl font-bold text-foreground">
            Submit WiFi Measurement
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* WiFi Name */}
            <div className="space-y-2">
              <Label htmlFor="wifi-name" className="text-foreground/80">
                WiFi Network Name
              </Label>
              <Input
                id="wifi-name"
                type="text"
                placeholder="Enter network name"
                value={wifiName}
                onChange={(e) => setWifiName(e.target.value)}
                className="bg-void/40 border-foreground/20 text-foreground placeholder:text-foreground/40"
              />
            </div>

            {/* Speed (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="speed" className="text-foreground/80">
                Measured Speed
              </Label>
              <div className="flex items-baseline gap-2 rounded-lg bg-void/40 border border-foreground/20 px-4 py-3">
                <span className="font-jetbrains text-3xl font-bold text-cyber-cyan">
                  {speed}
                </span>
                <span className="text-sm text-foreground/60">Mbps</span>
              </div>
            </div>

            {/* Location (Read-only) */}
            <div className="space-y-2">
              <Label className="text-foreground/80">Location</Label>
              <div className="rounded-lg bg-void/40 border border-foreground/20 px-4 py-3">
                {location ? (
                  <div className="font-jetbrains text-sm text-foreground/80">
                    <div>Lat: {location.lat.toFixed(6)}</div>
                    <div>Lng: {location.lng.toFixed(6)}</div>
                  </div>
                ) : (
                  <div className="text-sm text-foreground/40">Location unavailable</div>
                )}
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div className="space-y-3">
              <Label className="text-foreground/80">How fast is Wifi?</Label>
              <div className="flex justify-center py-2">
                <StarRating value={satisfaction} onChange={setSatisfaction} />
              </div>
              {satisfaction > 0 && (
                <p className="text-center text-sm text-foreground/60">
                  {satisfaction === 1 && "Very Poor"}
                  {satisfaction === 2 && "Poor"}
                  {satisfaction === 3 && "Average"}
                  {satisfaction === 4 && "Good"}
                  {satisfaction === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-cyber-cyan text-void hover:bg-cyber-cyan/90 font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Measurement"}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

