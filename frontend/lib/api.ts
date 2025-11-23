/**
 * API utility functions for backend communication
 */

const getApiBaseUrl = (): string => {
  // Use environment variable if set, otherwise default to localhost for development
  // In production, this should be set to the actual backend URL
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
}

/**
 * Fetch statistics from the backend API
 */
export async function fetchStatistics(): Promise<import('@/types/statistics').StatisticsResponse> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}/api/statistics`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for fresh data
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Failed to fetch statistics',
        message: `HTTP ${response.status}: ${response.statusText}`,
      }))

      throw new Error(errorData.message || errorData.error || 'Failed to fetch statistics')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred while fetching statistics')
  }
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth(): Promise<{ status: string; service: string; timestamp: string }> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}/health`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unknown error occurred during health check')
  }
}

