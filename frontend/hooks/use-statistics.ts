"use client"

import { useState, useEffect, useCallback } from 'react'
import { fetchStatistics } from '@/lib/api'
import type { StatisticsResponse, WifiStatistics } from '@/types/statistics'

/**
 * Hook to fetch Wi-Fi statistics from the backend API
 * Statistics are aggregated by Wi-Fi name and computed using Chainlink CRE workflow
 */
export function useStatistics() {
  const [statistics, setStatistics] = useState<WifiStatistics[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

  const loadStatistics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response: StatisticsResponse = await fetchStatistics()

      if (!response.success) {
        throw new Error(response.error || response.message || 'Failed to fetch statistics')
      }

      setStatistics(response.data || [])
      setLastFetchTime(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics'
      setError(errorMessage)
      console.error('Error loading statistics:', err)
      setStatistics([]) // Clear statistics on error
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-load on mount
  useEffect(() => {
    loadStatistics()
  }, [loadStatistics])

  return {
    statistics,
    loading,
    error,
    lastFetchTime,
    loadStatistics,
    refresh: loadStatistics,
  }
}

