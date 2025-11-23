export interface SpeedTestResult {
  speed: number
  unit: string
  samples?: number[]
  method?: string
  methods?: {
    cdn?: { speed: number; samples: number[] }
    cloudflare?: { speed: number; samples: number[] }
  }
}

/**
 * Dual speed test that runs CDN and Cloudflare tests in parallel.
 * Returns individual results from each method plus an averaged result.
 * 
 * @param durationSeconds optional desired measurement duration in seconds.
 *                         Defaults to ~5 seconds of measurement.
 */
export async function measureConnectionSpeed(
  durationSeconds = 5,
): Promise<SpeedTestResult | { error: string }> {
  try {
    console.log("Starting parallel speedtest with CDN and Cloudflare methods")

    // Run both methods in parallel
    const [cdnResult, cloudflareResult] = await Promise.allSettled([
      testWithCDNFiles(durationSeconds),
      testWithCloudflare(durationSeconds),
    ])

    const results: SpeedTestResult["methods"] = {}
    const allSpeeds: number[] = []

    // Process CDN result
    if (cdnResult.status === "fulfilled" && cdnResult.value) {
      results.cdn = {
        speed: cdnResult.value.speed,
        samples: cdnResult.value.samples,
      }
      allSpeeds.push(cdnResult.value.speed)
      console.log(`✓ CDN test: ${cdnResult.value.speed} Mbps`)
    } else {
      console.warn("✗ CDN test failed")
    }

    // Process Cloudflare result
    if (cloudflareResult.status === "fulfilled" && cloudflareResult.value) {
      results.cloudflare = {
        speed: cloudflareResult.value.speed,
        samples: cloudflareResult.value.samples,
      }
      allSpeeds.push(cloudflareResult.value.speed)
      console.log(`✓ Cloudflare test: ${cloudflareResult.value.speed} Mbps`)
    } else {
      console.warn("✗ Cloudflare test failed")
    }

    // Check if at least one method succeeded
    if (allSpeeds.length === 0) {
      return { error: "All speed test methods failed. Please check your internet connection." }
    }

    // Calculate average speed from all successful tests
    const averageSpeed = Math.round(allSpeeds.reduce((a, b) => a + b, 0) / allSpeeds.length)

    console.log(`\n=== Speed Test Summary ===`)
    console.log(`Successful tests: ${allSpeeds.length}/2`)
    console.log(`Average speed: ${averageSpeed} Mbps`)
    console.log(`Individual results:`, results)

    return {
      speed: averageSpeed,
      unit: "Mbps",
      method: `Average of ${allSpeeds.length} method(s)`,
      methods: results,
    }
  } catch (error: any) {
    console.error("Speed test failed:", error)
    return { error: error?.message || "Failed to measure speed" }
  }
}

/**
 * Test using well-known CDN files (jQuery, Bootstrap, etc.)
 */
async function testWithCDNFiles(
  durationSeconds: number,
): Promise<{ speed: number; unit: string; samples: number[] } | { error: string } | null> {
  try {
    const testFiles = [
      { url: "https://code.jquery.com/jquery-3.7.1.min.js", size: 89476 },
      { url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js", size: 277907 },
      { url: "https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js", size: 696812 },
    ]

    const samples = Math.min(3, Math.max(1, Math.round(durationSeconds / 2)))
    const results: number[] = []

    for (let i = 0; i < samples; i++) {
      try {
        const testFile = testFiles[i % testFiles.length]
        const url = `${testFile.url}?nocache=${Date.now()}-${i}`

        const startTime = performance.now()
        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
          mode: "cors",
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const blob = await response.blob()
        const endTime = performance.now()
        const duration = (endTime - startTime) / 1000
        const speedMbps = (blob.size * 8) / duration / 1_000_000

        if (isFinite(speedMbps) && speedMbps > 0) {
          results.push(speedMbps)
          console.log(`CDN sample ${i + 1}: ${speedMbps.toFixed(2)} Mbps`)
        }
      } catch (err) {
        console.warn(`CDN sample ${i + 1} failed:`, err)
      }

      if (i < samples - 1) await new Promise((r) => setTimeout(r, 500))
    }

    if (results.length === 0) return null

    const avg = results.reduce((a, b) => a + b, 0) / results.length
    return { speed: Math.round(avg), unit: "Mbps", samples: results }
  } catch (error) {
    return null
  }
}

/**
 * Test using Cloudflare's speed test
 */
async function testWithCloudflare(
  durationSeconds: number,
): Promise<{ speed: number; unit: string; samples: number[] } | { error: string } | null> {
  try {
    const samples = Math.min(3, Math.max(1, Math.round(durationSeconds / 2)))
    const fileSize = 10_000_000 // 10 MB
    const results: number[] = []

    for (let i = 0; i < samples; i++) {
      try {
        const url = `https://speed.cloudflare.com/__down?bytes=${fileSize}`

        const startTime = performance.now()
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
          mode: "cors",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const blob = await response.blob()
        const endTime = performance.now()
        const duration = (endTime - startTime) / 1000
        const speedMbps = (blob.size * 8) / duration / 1_000_000

        if (isFinite(speedMbps) && speedMbps > 0) {
          results.push(speedMbps)
          console.log(`Cloudflare sample ${i + 1}: ${speedMbps.toFixed(2)} Mbps`)
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn(`Cloudflare sample ${i + 1} failed:`, err.message)
        }
      }

      if (i < samples - 1) await new Promise((r) => setTimeout(r, 500))
    }

    if (results.length === 0) return null

    const avg = results.reduce((a, b) => a + b, 0) / results.length
    return { speed: Math.round(avg), unit: "Mbps", samples: results }
  } catch (error) {
    return null
  }
}

