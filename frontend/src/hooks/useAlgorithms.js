/* Custom React hooks for algorithm operations.

This module provides reusable hooks for interacting with backend algorithms,
replacing the monolithic code in App.jsx.
*/

import { useCallback } from 'react';
import apiClient from '../api/client';
import { useUI } from '../context/AppContext';
import { useResults } from '../context/AppContext';

/**
 * Hook for MST algorithm operations.
 */
export function useMst() {
  const { setMstResult } = useResults();
  const { setActiveTab, setLoading, setError } = useUI();

  const runMst = useCallback(async ({ algorithm, includeNew }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/mst', {
        params: { algorithm, include_new: includeNew },
      });
      setMstResult(response.data);
      setActiveTab('MST Designer');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setMstResult, setActiveTab, setLoading, setError]);

  return { runMst };
}

/**
 * Hook for routing algorithm operations.
 */
export function useRouting() {
  const { setRouteResult } = useResults();
  const { setActiveTab, setLoading, setError } = useUI();

  const runRoute = useCallback(async ({ source, destination, timeOfDay, mode }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/route', {
        params: { from: source, to: destination, time: timeOfDay, mode },
      });
      setRouteResult(response.data);
      setActiveTab('Route Planner');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setRouteResult, setActiveTab, setLoading, setError]);

  return { runRoute };
}

/**
 * Hook for algorithm comparison operations.
 */
export function useComparison() {
  const { setCompareResult } = useResults();
  const { setActiveTab, setLoading, setError } = useUI();

  const runCompare = useCallback(async ({ source, destination }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/compare/dijkstra-vs-astar', {
        params: { from: source, to: destination },
      });
      setCompareResult(response.data);
      setActiveTab('Algorithm Race');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setCompareResult, setActiveTab, setLoading, setError]);

  return { runCompare };
}

/**
 * Hook for dynamic programming operations (bus scheduling, road maintenance).
 */
export function useDynamicProgramming() {
  const { setBusResult, setMaintenanceResult } = useResults();
  const { setActiveTab, setLoading, setError } = useUI();

  const runBusScheduling = useCallback(async (totalBuses) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/dp/bus-scheduling', {
        params: { total_buses: totalBuses },
      });
      setBusResult(response.data);
      setActiveTab('Public Transit');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBusResult, setActiveTab, setLoading, setError]);

  const runMaintenance = useCallback(async (budget) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/dp/road-maintenance', {
        params: { budget },
      });
      setMaintenanceResult(response.data);
      setActiveTab('Public Transit');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setMaintenanceResult, setActiveTab, setLoading, setError]);

  return { runBusScheduling, runMaintenance };
}

/**
 * Hook for greedy algorithm operations (traffic signals, emergency).
 */
export function useGreedy() {
  const { setSignalsResult, setEmergencyResult } = useResults();
  const { setActiveTab, setLoading, setError } = useUI();

  const runSignals = useCallback(async (timeOfDay) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/greedy/signals', {
        params: { time: timeOfDay },
      });
      setSignalsResult(response.data);
      setActiveTab('Traffic Signals');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setSignalsResult, setActiveTab, setLoading, setError]);

  const runEmergency = useCallback(async ({ startNode, hospitalId }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/greedy/emergency', {
        params: { from: startNode, to: hospitalId },
      });
      setEmergencyResult(response.data);
      setActiveTab('Traffic Signals');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setEmergencyResult, setActiveTab, setLoading, setError]);

  return { runSignals, runEmergency };
}

/**
 * Hook for ML operations (training, prediction).
 */
export function useMachineLearning() {
  const { setMlTrainResult, setMlPredictResult } = useResults();
  const { setActiveTab, setLoading, setError } = useUI();

  const runTrain = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/ml/train');
      setMlTrainResult(response.data);
      setActiveTab('ML Prediction');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setMlTrainResult, setActiveTab, setLoading, setError]);

  const runPredict = useCallback(async ({ road, timeOfDay }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/ml/predict', {
        params: { road, time: timeOfDay },
      });
      setMlPredictResult(response.data);
      setActiveTab('ML Prediction');
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setMlPredictResult, setActiveTab, setLoading, setError]);

  return { runTrain, runPredict };
}
