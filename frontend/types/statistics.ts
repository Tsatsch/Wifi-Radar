/**
 * Statistics types for Wi-Fi network statistics from backend API
 */

export interface WifiStatistics {
  wifiName: string
  totalMeasurements: number
  averageSpeed: number
  medianSpeed: number
  minSpeed: number
  maxSpeed: number
  speedRange: number
  locations: Array<{ lat: number; lon: number }>
  latestTimestamp: string
}

export interface StatisticsResponse {
  success: boolean
  data: WifiStatistics[]
  count: number
  timestamp: string
  error?: string
  message?: string
}

