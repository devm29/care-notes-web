import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { CareStats } from '../types';

interface StatsDisplayProps {
  stats: CareStats | null;
  loading: boolean;
  error: string | null;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-gray-500 text-center p-4">
        No statistics available
      </div>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Overview Stats */}
      <Grid item xs={12} md={3}>
        <Paper className="p-4">
          <Typography variant="subtitle2" color="text.secondary">Total Notes</Typography>
          <Typography variant="h4">{stats.total_notes}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper className="p-4">
          <Typography variant="subtitle2" color="text.secondary">Avg Notes/Patient</Typography>
          <Typography variant="h4">{stats.avg_notes_per_patient.toFixed(1)}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper className="p-4">
          <Typography variant="subtitle2" color="text.secondary">Active Facilities</Typography>
          <Typography variant="h4">{Object.keys(stats.by_facility).length}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper className="p-4">
          <Typography variant="subtitle2" color="text.secondary">Categories</Typography>
          <Typography variant="h4">{Object.keys(stats.by_category).length}</Typography>
        </Paper>
      </Grid>

      {/* Categories */}
      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h6" gutterBottom>By Category</Typography>
          {Object.entries(stats.by_category).map(([category, count]) => (
            <div key={category} className="mb-2">
              <div className="flex justify-between mb-1">
                <Typography variant="body2" color="text.secondary" className="capitalize">{category}</Typography>
                <Typography variant="body2">{count}</Typography>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(count / stats.total_notes) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </Paper>
      </Grid>

      {/* Priorities */}
      <Grid item xs={12} md={6}>
        <Paper className="p-4">
          <Typography variant="h6" gutterBottom>By Priority</Typography>
          {Object.entries(stats.by_priority)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([priority, count]) => (
              <div key={priority} className="mb-2">
                <div className="flex justify-between mb-1">
                  <Typography variant="body2" color="text.secondary">
                    Priority {priority}
                  </Typography>
                  <Typography variant="body2">{count}</Typography>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPriorityColor(Number(priority))}`}
                    style={{ width: `${(count / stats.total_notes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </Paper>
      </Grid>

      {/* Facilities */}
      <Grid item xs={12}>
        <Paper className="p-4">
          <Typography variant="h6" gutterBottom>By Facility</Typography>
          <Grid container spacing={2}>
            {Object.entries(stats.by_facility)
              .sort(([, a], [, b]) => b - a)
              .map(([facilityId, count]) => (
                <Grid item xs={12} sm={6} md={4} key={facilityId}>
                  <Paper className="p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" color="text.secondary">
                        Facility {facilityId}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {count}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const getPriorityColor = (priority: number): string => {
  switch (priority) {
    case 1:
      return 'bg-red-600';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-blue-500';
    case 5:
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};