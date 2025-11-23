 "use client"

import { useState } from "react"
import { useEvmAddress } from "@coinbase/cdp-hooks"
import { measureConnectionSpeed, type SpeedTestResult } from "@/lib/speed-test"
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "@/hooks/use-location"
import { GoogleMapsProvider } from "@/components/google-maps-provider"
import { MapView } from "@/components/map-view"
import { TopNav } from "@/components/top-nav"
import { BottomControls } from "@/components/bottom-controls"
import { SignalCard } from "@/components/signal-card"
import { WiFiFormModal, type WiFiFormData } from "@/components/wifi-form-modal"
import { SidebarLeaderboard } from "@/components/sidebar-leaderboard"
import { useFilecoinUpload } from "@/hooks/use-filecoin-upload"
import { UploadSuccessModal } from "@/components/upload-success-modal"
export default function Page() {
  const [selectedSignal, setSelectedSignal] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showWiFiForm, setShowWiFiForm] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [measurementData, setMeasurementData] = useState<SpeedTestResult | null>(null)
  const { evmAddress } = useEvmAddress()
  const isWalletConnected = !!evmAddress

  const { toast } = useToast()
  const { coordinates } = useLocation()
  const { uploadData, isUploading, statusMessage } = useFilecoinUpload()
  
  // Fallback to San Francisco center if coordinates not available (same as map default)
  const location = coordinates || { lat: 37.7749, lng: -122.4194 }

  const handleAddNew = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to add WiFi measurements",
        variant: "destructive",
      })
      return
    }

    // Open form immediately
    setShowWiFiForm(true)
    setMeasurementData({ speed: 0, unit: "Mbps" }) // Placeholder, will be updated
    
    setIsScanning(true)
    try {
      const result = await measureConnectionSpeed(10)
      
      if ("error" in result) {
        toast({
          title: "Speed test failed",
          description: result.error as string,
          variant: "destructive",
        })
        setShowWiFiForm(false)
        setMeasurementData(null)
        return
      }

      // Update measurement data with full measurement details
      setMeasurementData(result)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to run speed test",
        variant: "destructive",
      })
      setShowWiFiForm(false)
      setMeasurementData(null)
    } finally {
      setIsScanning(false)
    }
  }

  const handleWiFiFormSubmit = async (data: WiFiFormData) => {
    try {
      // Prepare the data for upload (simulated)
      const uploadPayload = {
        ...data,
        // Include measurement details if available
        measurementDetails: measurementData,
        // Add metadata
        version: "1.0",
        uploadedAt: new Date().toISOString(),
      }
      
      console.log("WiFi form submitted:", uploadPayload)
      
      // Simulate upload and get the mock CID
      const cid = await uploadData(uploadPayload)
      
      if (!cid) {
        // Error handling is done in the hook
        return
      }

      console.log("Data upload with CID:", cid)
      
      // Close the form first
      setShowWiFiForm(false)
      setMeasurementData(null)
      
      // Show success modal
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error submitting measurement:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your measurement",
        variant: "destructive",
      })
    }
  }

  return (
    <GoogleMapsProvider>
      <div className="relative h-screen w-full overflow-hidden">
        {/* Map Canvas - Full Screen (Lower layer) */}
        <MapView onMarkerClick={setSelectedSignal} />

        {/* UI Layer - Guaranteed to be above map */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          {/* HUD Layers */}
          <div className="pointer-events-auto">
            <TopNav />
          </div>

          <div className="pointer-events-auto">
            <BottomControls 
              onAddNew={handleAddNew}
              isScanning={isScanning}
              isWalletConnected={isWalletConnected}
            />
          </div>

          {/* Desktop Sidebar */}
          <div className="pointer-events-auto hidden lg:block">
            <SidebarLeaderboard />
          </div>
        </div>

        {/* Modals - Separate high z-index layer */}
        {/* Signal Card Modal */}
        {selectedSignal && <SignalCard signal={selectedSignal} onClose={() => setSelectedSignal(null)} />}

        {/* WiFi Form Modal */}
        {showWiFiForm && measurementData && (
          <WiFiFormModal
            speed={measurementData.speed}
            location={location}
            isLoading={isScanning || isUploading}
            measurementDetails={measurementData}
            walletAddress={evmAddress ?? null}
            onClose={() => {
              if (!isUploading) {
                setShowWiFiForm(false)
                setMeasurementData(null)
              }
            }}
            onSubmit={handleWiFiFormSubmit}
          />
        )}

        {/* Upload Success Modal */}
        {showSuccessModal && (
          <UploadSuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </div>
    </GoogleMapsProvider>
  )
}
