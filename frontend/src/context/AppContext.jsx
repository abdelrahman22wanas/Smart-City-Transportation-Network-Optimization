/* React Context for global application state management.

This module provides a centralized state management solution using React Context,
replacing prop drilling with a more maintainable approach.
*/

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

/**
 * Initial state for the application.
 */
const initialState = {
  // UI State
  activeTab: 'Network Map',
  isLoading: false,
  error: null,
  
  // MST State
  mstResult: null,
  
  // Routing State
  routeResult: null,
  
  // Comparison State
  compareResult: null,
  
  // Public Transit State
  busResult: null,
  maintenanceResult: null,
  
  // Traffic Signals State
  signalsResult: null,
  emergencyResult: null,
  
  // ML State
  mlTrainResult: null,
  mlPredictResult: null,
  
  // Dashboard Metrics
  dashboardMetrics: {
    totalNetworkKm: '—',
    avgCongestionRatio: '—',
    busiestRoad: '—',
    mostIsolatedNode: '—',
  },
};

/**
 * Action types for the reducer.
 */
const ActionTypes = {
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_MST_RESULT: 'SET_MST_RESULT',
  SET_ROUTE_RESULT: 'SET_ROUTE_RESULT',
  SET_COMPARE_RESULT: 'SET_COMPARE_RESULT',
  SET_BUS_RESULT: 'SET_BUS_RESULT',
  SET_MAINTENANCE_RESULT: 'SET_MAINTENANCE_RESULT',
  SET_SIGNALS_RESULT: 'SET_SIGNALS_RESULT',
  SET_EMERGENCY_RESULT: 'SET_EMERGENCY_RESULT',
  SET_ML_TRAIN_RESULT: 'SET_ML_TRAIN_RESULT',
  SET_ML_PREDICT_RESULT: 'SET_ML_PREDICT_RESULT',
  SET_DASHBOARD_METRICS: 'SET_DASHBOARD_METRICS',
  RESET: 'RESET',
};

/**
 * Reducer function for state management.
 */
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload, error: action.payload ? null : state.error };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.SET_MST_RESULT:
      return { ...state, mstResult: action.payload };
    
    case ActionTypes.SET_ROUTE_RESULT:
      return { ...state, routeResult: action.payload };
    
    case ActionTypes.SET_COMPARE_RESULT:
      return { ...state, compareResult: action.payload };
    
    case ActionTypes.SET_BUS_RESULT:
      return { ...state, busResult: action.payload };
    
    case ActionTypes.SET_MAINTENANCE_RESULT:
      return { ...state, maintenanceResult: action.payload };
    
    case ActionTypes.SET_SIGNALS_RESULT:
      return { ...state, signalsResult: action.payload };
    
    case ActionTypes.SET_EMERGENCY_RESULT:
      return { ...state, emergencyResult: action.payload };
    
    case ActionTypes.SET_ML_TRAIN_RESULT:
      return { ...state, mlTrainResult: action.payload };
    
    case ActionTypes.SET_ML_PREDICT_RESULT:
      return { ...state, mlPredictResult: action.payload };
    
    case ActionTypes.SET_DASHBOARD_METRICS:
      return { ...state, dashboardMetrics: action.payload };
    
    case ActionTypes.RESET:
      return initialState;
    
    default:
      return state;
  }
}

/**
 * Create the App Context.
 */
const AppContext = createContext(null);

/**
 * Provider component for the App Context.
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // UI Actions
  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tab });
  }, []);
  
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);
  
  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);
  
  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);
  
  // Data Actions
  const setMstResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_MST_RESULT, payload: result });
  }, []);
  
  const setRouteResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_ROUTE_RESULT, payload: result });
  }, []);
  
  const setCompareResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_COMPARE_RESULT, payload: result });
  }, []);
  
  const setBusResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_BUS_RESULT, payload: result });
  }, []);
  
  const setMaintenanceResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_MAINTENANCE_RESULT, payload: result });
  }, []);
  
  const setSignalsResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_SIGNALS_RESULT, payload: result });
  }, []);
  
  const setEmergencyResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_EMERGENCY_RESULT, payload: result });
  }, []);
  
  const setMlTrainResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_ML_TRAIN_RESULT, payload: result });
  }, []);
  
  const setMlPredictResult = useCallback((result) => {
    dispatch({ type: ActionTypes.SET_ML_PREDICT_RESULT, payload: result });
  }, []);
  
  const setDashboardMetrics = useCallback((metrics) => {
    dispatch({ type: ActionTypes.SET_DASHBOARD_METRICS, payload: metrics });
  }, []);
  
  const reset = useCallback(() => {
    dispatch({ type: ActionTypes.RESET });
  }, []);
  
  // Memoized value
  const value = useMemo(() => ({
    state,
    actions: {
      setActiveTab,
      setLoading,
      setError,
      clearError,
      setMstResult,
      setRouteResult,
      setCompareResult,
      setBusResult,
      setMaintenanceResult,
      setSignalsResult,
      setEmergencyResult,
      setMlTrainResult,
      setMlPredictResult,
      setDashboardMetrics,
      reset,
    },
  }), [
    state,
    setActiveTab,
    setLoading,
    setError,
    clearError,
    setMstResult,
    setRouteResult,
    setCompareResult,
    setBusResult,
    setMaintenanceResult,
    setSignalsResult,
    setEmergencyResult,
    setMlTrainResult,
    setMlPredictResult,
    setDashboardMetrics,
    reset,
  ]);
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access the App Context.
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/**
 * Hook to access UI state.
 */
export function useUI() {
  const { state, actions } = useApp();
  return {
    activeTab: state.activeTab,
    isLoading: state.isLoading,
    error: state.error,
    setActiveTab: actions.setActiveTab,
    setLoading: actions.setLoading,
    setError: actions.setError,
    clearError: actions.clearError,
  };
}

/**
 * Hook to access algorithm results.
 */
export function useResults() {
  const { state, actions } = useApp();
  return {
    mstResult: state.mstResult,
    routeResult: state.routeResult,
    compareResult: state.compareResult,
    busResult: state.busResult,
    maintenanceResult: state.maintenanceResult,
    signalsResult: state.signalsResult,
    emergencyResult: state.emergencyResult,
    mlTrainResult: state.mlTrainResult,
    mlPredictResult: state.mlPredictResult,
    setMstResult: actions.setMstResult,
    setRouteResult: actions.setRouteResult,
    setCompareResult: actions.setCompareResult,
    setBusResult: actions.setBusResult,
    setMaintenanceResult: actions.setMaintenanceResult,
    setSignalsResult: actions.setSignalsResult,
    setEmergencyResult: actions.setEmergencyResult,
    setMlTrainResult: actions.setMlTrainResult,
    setMlPredictResult: actions.setMlPredictResult,
  };
}
