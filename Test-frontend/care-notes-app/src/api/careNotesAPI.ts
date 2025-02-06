import type { CareNote, CareNoteInput, CareStats } from "../types"
import { DateRange } from '../components/DateRangeSelector'

const API_BASE_URL = 'http://localhost:8000/api'

export interface CareNoteDTO {
  id: number
  tenant_id: number
  facility_id: number
  patient_id: string
  category: 'medication' | 'observation' | 'treatment'
  priority: 1 | 2 | 3 | 4 | 5
  created_at: string
  created_by: string
  note_content: string
}

class CareNotesAPI {
  private baseURL = "http://localhost:8000" // FastAPI backend URL

  async fetchStats(tenantId: number, facilityIds?: number[], dateRange: DateRange = 'today'): Promise<CareStats> {
    const params = new URLSearchParams({
      tenant_id: tenantId.toString(),
      range: dateRange,
      optimized: 'true'
    })

    if (facilityIds?.length) {
      params.append('facility_ids', facilityIds.join(','))
    }

    const url = `${this.baseURL}/api/care-stats?${params}`
    console.log('Fetching stats with URL:', url)
    console.log('Request parameters:', {
      tenantId,
      facilityIds,
      dateRange,
      queryParams: Object.fromEntries(params.entries())
    })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`)
    }

    const stats = await response.json()
    console.log('Received stats:', stats)
    return stats
  }

  async fetchNotes(tenantId?: number, facilityIds?: number[], page: number = 1, pageSize: number = 20): Promise<PaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      })

      if (tenantId) {
        params.append('tenant_id', tenantId.toString())
      }

      if (facilityIds?.length) {
        params.append('facility_ids', facilityIds.join(','))
      }

      const response = await fetch(`${API_BASE_URL}/care-notes?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return response.json()
    } catch (error) {
      console.error("Error fetching notes from API:", error)
      throw new Error("Failed to fetch notes from server")
    }
  }

  async createNote(noteInput: CareNoteInput): Promise<CareNote> {
    try {
      const response = await fetch(`${API_BASE_URL}/care-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteInput),
      })

      if (!response.ok) {
        throw new Error('Failed to create note')
      }

      return response.json()
    } catch (error) {
      console.error("Error creating note via API:", error)
      throw new Error("Failed to create note")
    }
  }

  async runPerformanceTest(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/run-performance-test`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error running performance test:", error)
      throw new Error("Failed to run performance test")
    }
  }
}

interface PaginatedResponse {
  notes: CareNote[]
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}

export const careNotesAPI = new CareNotesAPI()
