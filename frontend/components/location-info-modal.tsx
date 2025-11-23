"use client"

import { X, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface LocationInfoModalProps {
  location: { lat: number; lng: number }
  onClose: () => void
  onAddMeasurement: () => void
  isWalletConnected: boolean
  isScanning?: boolean
}

interface LocationDetails {
  formattedAddress?: string
  streetAddress?: string
  city?: string
  state?: string
  country?: string
}

export function LocationInfoModal({
  location,
  onClose,
  onAddMeasurement,
  isWalletConnected,
  isScanning = false,
}: LocationInfoModalProps) {
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reverse geocode the location
    const geocodeLocation = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const result = data.results[0]
          const components = result.address_components

          const getComponent = (type: string) => {
            const comp = components.find((c: any) => c.types.includes(type))
            return comp?.long_name || ""
          }

          setLocationDetails({
            formattedAddress: result.formatted_address,
            streetAddress: getComponent("route"),
            city: getComponent("locality") || getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
            country: getComponent("country"),
          })
        }
      } catch (error) {
        console.error("Geocoding error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    geocodeLocation()
  }, [location])

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`

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
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-6 w-6 text-cyber-cyan" />
                <h2 className="font-space-grotesk text-2xl font-bold text-cyber-cyan">Location</h2>
              </div>
            </div>

            {/* Location Details */}
            {isLoading ? (
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-foreground/10 animate-pulse rounded" />
                <div className="h-4 bg-foreground/10 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-foreground/10 animate-pulse rounded w-1/2" />
              </div>
            ) : locationDetails ? (
              <div className="space-y-2 mb-6">
                {locationDetails.streetAddress && (
                  <p className="font-jetbrains text-base text-foreground">
                    {locationDetails.streetAddress}
                  </p>
                )}
                {locationDetails.city && (
                  <p className="font-jetbrains text-base text-foreground/80">
                    {locationDetails.city}
                  </p>
                )}
                {locationDetails.state && (
                  <p className="font-jetbrains text-base text-foreground/80">
                    {locationDetails.state}
                  </p>
                )}
                {locationDetails.country && (
                  <p className="font-jetbrains text-base text-foreground/80">
                    {locationDetails.country}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                <p className="font-jetbrains text-sm text-foreground/70">
                  Latitude: {location.lat.toFixed(6)}
                </p>
                <p className="font-jetbrains text-sm text-foreground/70">
                  Longitude: {location.lng.toFixed(6)}
                </p>
              </div>
            )}

            {/* Coordinates */}
            <div className="rounded-lg bg-background/50 p-3 mb-6 border border-cyber-cyan/20">
              <div className="font-jetbrains text-xs text-foreground/70 space-y-1">
                <div>Lat: {location.lat.toFixed(6)}</div>
                <div>Lng: {location.lng.toFixed(6)}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add Measurement Button */}
              <Button
                onClick={onAddMeasurement}
                disabled={!isWalletConnected || isScanning}
                className="w-full min-h-[48px] bg-cyber-cyan hover:bg-cyber-cyan/90 text-void font-space-grotesk font-bold touch-manipulation"
              >
                {isScanning 
                  ? "Running Speed Test..." 
                  : isWalletConnected 
                    ? "Add WiFi Measurement Here" 
                    : "Connect Wallet to Add Measurement"
                }
              </Button>

              {/* View on Google Maps Button */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full min-h-[48px] bg-background/80 hover:bg-background border-cyber-cyan/40 hover:border-cyber-cyan/60 text-foreground hover:text-foreground font-jetbrains touch-manipulation"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
