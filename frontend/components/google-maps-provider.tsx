"use client"

import { APIProvider } from "@vis.gl/react-google-maps"

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  // You'll need to add your Google Maps API key here
  // Get it from: https://console.cloud.google.com/google/maps-apis
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  if (!apiKey || apiKey === "REPLACE_WITH_YOUR_API_KEY") {
    console.error(
      "🗺️  Google Maps API key not found or not configured. Please add a valid NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file"
    )
    console.log("Current API key:", apiKey || "(empty)")
    return (
      <div className="flex h-screen w-full items-center justify-center bg-void">
        <div className="max-w-2xl rounded-2xl border border-cyber-cyan/20 bg-glass p-8 backdrop-blur-xl">
          <div className="mb-4 text-2xl font-bold text-cyber-cyan">🗺️ Google Maps API Key Required</div>
          <div className="mb-6 space-y-3 text-foreground/80">
            <p>To display the interactive map, you need to set up a Google Maps API key.</p>
            <div className="rounded-lg bg-void/40 p-4 font-mono text-sm">
              <div className="mb-2 text-warning-amber">Steps:</div>
              <ol className="ml-4 list-decimal space-y-2">
                <li>Get API key from: console.cloud.google.com/google/maps-apis</li>
                <li>Create a file: <code className="text-cyber-cyan">.env.local</code> in the frontend folder</li>
                <li>Add: <code className="text-signal-green">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code></li>
                <li>Restart the dev server</li>
              </ol>
            </div>
          </div>
          <div className="text-sm text-foreground/60">
            See <code className="text-cyber-cyan">GOOGLE_MAPS_SETUP.md</code> for detailed instructions
          </div>
        </div>
      </div>
    )
  }

  return <APIProvider apiKey={apiKey}>{children}</APIProvider>
}

