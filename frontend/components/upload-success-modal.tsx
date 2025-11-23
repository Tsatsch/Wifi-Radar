"use client"

import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadSuccessModalProps {
  onClose: () => void
}

export function UploadSuccessModal({ onClose }: UploadSuccessModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[90%] max-w-md">
          <div className="relative rounded-2xl bg-glass p-8 backdrop-blur-xl border border-cyber-cyan/20">
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1 text-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-cyber-cyan opacity-20" />
                <CheckCircle2 className="relative h-16 w-16 text-cyber-cyan" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4">
              <h3 className="font-space-grotesk text-2xl font-bold text-foreground">
                Uploaded
              </h3>
              <p className="text-foreground/80">
                Verification incoming
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-8">
              <Button
                onClick={onClose}
                className="w-full rounded-full bg-cyber-cyan text-void hover:bg-cyber-cyan/90 font-semibold"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

