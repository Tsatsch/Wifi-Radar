"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/ui/star-rating"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AddPointModalProps {
  location: { lat: number; lng: number } | null
  walletAddress: string | null
  customLocation?: { lat: number; lng: number } | null
  onClose: () => void
  onSubmit: (data: AddPointFormData) => void
}

export interface AddPointFormData {
  wifiName: string
  satisfaction: number
  location: { lat: number; lng: number } | null
  walletAddress: string | null
  timestamp: string
  // Estimated speed based on satisfaction
  estimatedSpeed: number
}

export function AddPointModal({
  location,
  walletAddress,
  customLocation,
  onClose,
  onSubmit,
}: AddPointModalProps) {
  const [wifiName, setWifiName] = useState("")
  const [satisfaction, setSatisfaction] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Use custom location if provided, otherwise use user's location
  const actualLocation = customLocation || location

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
        description: "Please rate this WiFi network",
        variant: "destructive",
      })
      return
    }

    if (!actualLocation) {
      toast({
        title: "Location required",
        description: "Location is required to add a point",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Estimate speed based on satisfaction (1-5 stars)
      // 5 stars = ~180 Mbps (strong)
      // 4 stars = ~120 Mbps (strong)
      // 3 stars = ~60 Mbps (weak)
      // 2 stars = ~25 Mbps (weak)
      // 1 star = ~10 Mbps (dead)
      const estimatedSpeed = satisfaction * 36

      const formData: AddPointFormData = {
        wifiName,
        satisfaction,
        location: actualLocation,
        walletAddress,
        timestamp: new Date().toISOString(),
        estimatedSpeed,
      }
      console.log("Submitting add point data:", JSON.stringify(formData, null, 2))
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        <div className="w-full max-w-md md:w-[90%] md:max-h-[90vh] overflow-y-auto">
          <div className="relative rounded-t-3xl md:rounded-2xl bg-glass p-6 md:p-8 backdrop-blur-xl border border-cyber-cyan/20 md:border-t md:border-l md:border-r md:border-b">
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-foreground/60 hover:text-foreground active:text-foreground transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="font-space-grotesk text-2xl font-bold text-cyber-cyan">Add WiFi Point</h2>
              <p className="mt-2 font-jetbrains text-sm text-foreground/70">
                {customLocation 
                  ? "Add a WiFi measurement at the selected location" 
                  : "Add a WiFi location to the map (no speed test required)"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* WiFi Name Field */}
              <div className="space-y-2">
                <Label htmlFor="wifi-name" className="font-jetbrains text-sm font-medium">
                  WiFi Network Name (SSID)
                </Label>
                <Input
                  id="wifi-name"
                  type="text"
                  placeholder="e.g., CoffeeShop_Guest"
                  value={wifiName}
                  onChange={(e) => setWifiName(e.target.value)}
                  className="font-jetbrains bg-background/50 border-cyber-cyan/30 focus:border-cyber-cyan min-h-[44px]"
                  required
                />
              </div>

              {/* Location Display */}
              {actualLocation && (
                <div className="space-y-2">
                  <Label className="font-jetbrains text-sm font-medium">Location</Label>
                  <div className="rounded-lg bg-background/50 p-3 font-jetbrains text-xs text-foreground/70 border border-cyber-cyan/20">
                    <div>Latitude: {actualLocation.lat.toFixed(6)}</div>
                    <div>Longitude: {actualLocation.lng.toFixed(6)}</div>
                  </div>
                </div>
              )}

              {/* Satisfaction Rating */}
              <div className="space-y-3">
                <Label className="font-jetbrains text-sm font-medium">
                  How would you rate this WiFi?
                </Label>
                <div className="flex justify-center py-2">
                  <StarRating value={satisfaction} onChange={setSatisfaction} />
                </div>
                <p className="text-center font-jetbrains text-xs text-foreground/60">
                  {satisfaction === 0 && "Tap to rate"}
                  {satisfaction === 1 && "Poor - Very slow connection"}
                  {satisfaction === 2 && "Fair - Below average"}
                  {satisfaction === 3 && "Good - Decent speed"}
                  {satisfaction === 4 && "Very Good - Fast connection"}
                  {satisfaction === 5 && "Excellent - Very fast!"}
                </p>
              </div>

              {/* Wallet Address Display */}
              {walletAddress && (
                <div className="space-y-2">
                  <Label className="font-jetbrains text-sm font-medium">Wallet Address</Label>
                  <div className="rounded-lg bg-background/50 p-3 font-jetbrains text-xs text-foreground/70 border border-cyber-cyan/20 break-all">
                    {walletAddress}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] bg-cyber-cyan hover:bg-cyber-cyan/90 text-void font-space-grotesk font-bold touch-manipulation"
                >
                  {isSubmitting ? "Adding Point..." : "Add to Map"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
