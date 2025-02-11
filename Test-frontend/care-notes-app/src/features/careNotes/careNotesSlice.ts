import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { CareNotesState } from "../../types"
import { loadNotesFromLocalDB, syncNotesFromAPI, addNote } from "./careNotesThunks"
import { DateRange } from '../../components/DateRangeSelector'

const initialState: CareNotesState = {
  notes: [],
  stats: null,
  loading: false,
  error: null,
  lastSync: null,
  selectedTenantId: 1,
  selectedFacilityIds: [],
  selectedDateRange: 'today',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20
  }
}

const careNotesSlice = createSlice({
  name: "careNotes",
  initialState,
  reducers: {
    setTenantId: (state, action) => {
      state.selectedTenantId = action.payload
      state.currentPage = 1 // Reset pagination when tenant changes
    },
    setFacilityIds: (state, action) => {
      state.selectedFacilityIds = action.payload
      state.currentPage = 1 // Reset pagination when facilities change
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setSelectedDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = action.payload
    }
  },
  extraReducers: (builder) => {
    // Load notes from local DB
    builder.addCase(loadNotesFromLocalDB.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loadNotesFromLocalDB.fulfilled, (state, action) => {
      state.notes = action.payload.notes
      state.pagination = {
        currentPage: action.payload.pagination.page,
        totalPages: action.payload.pagination.total_pages,
        totalItems: action.payload.pagination.total,
        pageSize: action.payload.pagination.page_size
      }
      state.loading = false
    })
    builder.addCase(loadNotesFromLocalDB.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to load notes"
    })

    // Sync notes from API
    builder.addCase(syncNotesFromAPI.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(syncNotesFromAPI.fulfilled, (state, action) => {
      state.notes = action.payload.notes
      state.pagination = {
        currentPage: action.payload.pagination.page,
        totalPages: action.payload.pagination.total_pages,
        totalItems: action.payload.pagination.total,
        pageSize: action.payload.pagination.page_size
      }
      state.loading = false
      state.lastSync = new Date().toISOString()
    })
    builder.addCase(syncNotesFromAPI.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to sync notes"
    })

    // Add new note
    builder.addCase(addNote.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(addNote.fulfilled, (state, action) => {
      state.notes.unshift(action.payload)
      state.loading = false
    })
    builder.addCase(addNote.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to add note"
    })
  },
})

export const {
  setTenantId,
  setFacilityIds,
  setPage,
  clearError,
  setStats,
  setLastSync,
  setError,
  setSelectedDateRange,
  setPagination
} = careNotesSlice.actions
export default careNotesSlice.reducer
