import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useCharts(chatId) {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  // Fetch all charts for a chat
  const {
    data: charts = [],
    isLoading,
    isError,
    refetch: refetchCharts,
  } = useQuery({
    queryKey: ['charts', chatId],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const data = await api.chart.getCharts(token, chatId);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    enabled: !!chatId,
  });

  // Create a new chart
  const createChartMutation = useMutation({
    mutationFn: async ({ prompt, chartType, label }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        return await api.chart.createChart(token, chatId, { prompt, chartType, label });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch charts query
      queryClient.invalidateQueries(['charts', chatId]);
    },
  });

  // Delete a chart
  const deleteChartMutation = useMutation({
    mutationFn: async (chartId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        return await api.chart.deleteChart(token, chartId);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch charts query
      queryClient.invalidateQueries(['charts', chatId]);
    },
  });

  return {
    charts,
    isLoading,
    isError,
    error,
    createChart: createChartMutation.mutateAsync,
    isCreating: createChartMutation.isLoading,
    deleteChart: deleteChartMutation.mutateAsync,
    isDeleting: deleteChartMutation.isLoading,
    refetchCharts,
  };
}
