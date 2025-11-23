"use client"

import { useStatistics } from "@/hooks/use-statistics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, TrendingUp, TrendingDown, Minus } from "lucide-react"

/**
 * Statistics Panel Component
 * Displays Wi-Fi statistics aggregated by network name from the backend API
 */
export function StatisticsPanel() {
  const { statistics, loading, error, lastFetchTime, refresh } = useStatistics()

  if (loading && statistics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wi-Fi Statistics</CardTitle>
          <CardDescription>Loading statistics from backend...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-cyber-cyan" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wi-Fi Statistics</CardTitle>
          <CardDescription>Error loading statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refresh()}
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (statistics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wi-Fi Statistics</CardTitle>
          <CardDescription>No statistics available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No Wi-Fi statistics found. Statistics are computed from data points stored on Filecoin.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-cyber-cyan" />
              Wi-Fi Statistics
            </CardTitle>
            <CardDescription>
              {statistics.length} network{statistics.length !== 1 ? 's' : ''} • 
              {lastFetchTime && ` Last updated: ${lastFetchTime.toLocaleTimeString()}`}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refresh()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statistics.map((stat) => (
            <div
              key={stat.wifiName}
              className="rounded-lg border border-cyber-cyan/20 bg-glass/50 p-4 backdrop-blur-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{stat.wifiName}</h3>
                <span className="text-xs text-muted-foreground">
                  {stat.totalMeasurements} measurement{stat.totalMeasurements !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Average</span>
                  </div>
                  <p className="text-lg font-semibold text-cyber-cyan">
                    {stat.averageSpeed.toFixed(1)} Mbps
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Minus className="h-3 w-3" />
                    <span>Median</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {stat.medianSpeed.toFixed(1)} Mbps
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Max</span>
                  </div>
                  <p className="text-sm font-medium text-signal-green">
                    {stat.maxSpeed.toFixed(1)} Mbps
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingDown className="h-3 w-3" />
                    <span>Min</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {stat.minSpeed.toFixed(1)} Mbps
                  </p>
                </div>
              </div>

              {stat.speedRange > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Range: {stat.minSpeed.toFixed(1)} - {stat.maxSpeed.toFixed(1)} Mbps
                  {" "}({stat.speedRange.toFixed(1)} Mbps)
                </div>
              )}

              {stat.locations.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {stat.locations.length} location{stat.locations.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

