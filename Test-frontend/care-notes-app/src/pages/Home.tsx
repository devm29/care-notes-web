"use client"

import type React from "react"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../app/store"
import { CareNoteCard } from "../components/CareNoteCard"
import { TenantSelector } from "../components/TenantSelector"
import { syncNotesFromAPI, syncStatsFromAPI } from "../features/careNotes/careNotesThunks"
import { clearError, setPage, setSelectedDateRange } from "../features/careNotes/careNotesSlice"
import { careNotesAPI } from "../api/careNotesAPI"
import { DateRangeSelector } from '../components/DateRangeSelector'
import { Container, Box, Grid, Paper, Typography } from '@mui/material'
import { StatsDisplay } from '../components/StatsDisplay'
import { NotesList } from '../components/NotesList'

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    notes,
    loading,
    error,
    lastSync,
    selectedTenantId,
    selectedFacilityIds,
    selectedDateRange,
    stats,
    pagination
  } = useSelector((state: RootState) => state.careNotes)

  useEffect(() => {
    // Initial load
    dispatch(syncNotesFromAPI(pagination.currentPage))

    // Set up polling every 60 seconds
    const interval = setInterval(() => {
      dispatch(syncNotesFromAPI(pagination.currentPage))
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, pagination.currentPage])

  useEffect(() => {
    // Fetch stats when tenant, facilities, or date range changes
    console.log('Selection changed:', {
      selectedTenantId,
      selectedFacilityIds,
      selectedDateRange
    })
    dispatch(syncStatsFromAPI())
  }, [dispatch, selectedTenantId, selectedFacilityIds, selectedDateRange])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(syncNotesFromAPI(pagination.currentPage))
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
    dispatch(syncNotesFromAPI(newPage))
  }

  const handleDateRangeChange = (range: DateRange) => {
    dispatch(setSelectedDateRange(range))
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TenantSelector />
          </Grid>
          <Grid item xs={12} md={4}>
            <DateRangeSelector
              selectedRange={selectedDateRange}
              onRangeChange={handleDateRangeChange}
            />
          </Grid>

          {/* Stats Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Care Notes Statistics
                {stats?.date_range && (
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(stats.date_range.start).toLocaleDateString()} - {new Date(stats.date_range.end).toLocaleDateString()}
                  </Typography>
                )}
              </Typography>
              <StatsDisplay stats={stats} loading={loading} error={error} />
            </Paper>
          </Grid>

          {/* Notes List Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Care Notes List
              </Typography>
              <NotesList
                notes={notes}
                loading={loading}
                error={error}
                pagination={pagination}
                onPageChange={(page) => dispatch(syncNotesFromAPI(page))}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
