import { useCallback, useEffect, useReducer, useRef } from "react";

export const DEFAULT_SECONDS = 15;
export const ONE_SECOND = 1000;
const MAX_PERCENTAGE = 90;

const ACTIONS = {
  addAnimation: "ADD_ANIMATION",
  done: "DONE",
  reset: "RESET",
  updateBreakpoints: "UPDATE_BREAKPOINTS",
};

const initialState = {
  transitionDuration: 0,
  animatedProgress: 0,
  hasStarted: false,
  breakpointIndex: 0, // We use this to keep iterating until the last breakpoint
};

function init({ breakpoints, ...initState }) {
  // Here we are sorting them so we don't go backwards, filtering values lower than our max (90) and adding the MAX at the end
  let newBreakpoints = breakpoints
    .sort((a, b) => a - b)
    .filter((breakpoint) => breakpoint < MAX_PERCENTAGE);
  newBreakpoints.push(MAX_PERCENTAGE);

  const expectedMilliseconds = initState.expectedSeconds * ONE_SECOND;
  const currentBreakPoint = getBreakPoint(
    newBreakpoints,
    initState.breakpointIndex
  );

  const nextTimeout = getDurationByBP(
    expectedMilliseconds,
    undefined,
    currentBreakPoint
  );

  return {
    ...initState,
    breakpoints: newBreakpoints,
    expectedMilliseconds,
    nextTimeout,
    stopMilliseconds: expectedMilliseconds * (MAX_PERCENTAGE / 100.0),
  };
}

const getBreakPoint = (breakpoints, index) => {
  return breakpoints?.[index];
};

const getBreakpointMilliseconds = (totalMilliseconds, breakpoint) => {
  return breakpoint ? totalMilliseconds * (breakpoint / 100.0) : undefined;
};

const getDurationByBP = (totalMilliseconds, fromBP, toBP) => {
  const fromMs = getBreakpointMilliseconds(totalMilliseconds, fromBP) || 0;
  const toMs = getBreakpointMilliseconds(totalMilliseconds, toBP);
  return toMs ? toMs - fromMs : toMs;
};

function reducer(state, action) {
  const breakpointByIndex = (index) => getBreakPoint(state.breakpoints, index);

  switch (action.type) {
    case ACTIONS.addAnimation:
      const currentBreakPoint = breakpointByIndex(state.breakpointIndex);
      const nextBreakPoint = breakpointByIndex(state.breakpointIndex + 1);
      const prevBreakPoint = breakpointByIndex(state.breakpointIndex - 1);

      const transitionDuration = getDurationByBP(
        state.expectedMilliseconds,
        prevBreakPoint,
        currentBreakPoint
      );
      const nextTimeout = getDurationByBP(
        state.expectedMilliseconds,
        currentBreakPoint,
        nextBreakPoint
      );
      return {
        ...state,
        animatedProgress: currentBreakPoint,
        breakpointIndex: state.breakpointIndex + 1,
        hasStarted: true,
        nextTimeout,
        transitionDuration: transitionDuration,
      };
    case ACTIONS.done:
      return {
        ...state,
        transitionDuration: ONE_SECOND,
        animatedProgress: 100,
      };
    case ACTIONS.reset:
      return init({
        ...initialState,
        expectedSeconds: state.expectedSeconds,
        breakpoints: state.breakpoints,
      });
    case ACTIONS.updateBreakpoints:
      return init({
        ...initialState,
        expectedSeconds: state.expectedSeconds,
        breakpoints: action.payload,
      });
    default:
      return state;
  }
}

export const useProgressBarState = (expectedSeconds, breakpoints) => {
  const resetTimeRef = useRef(null);
  const timePassedRef = useRef(null);
  const [state, dispatch] = useReducer(
    reducer,
    { ...initialState, expectedSeconds, breakpoints },
    init
  );
  // As we're using timeouts, we need a way to consistently get the most updated value, so we're using a ref for this
  const nextTimeoutRef = useRef(state.nextTimeout);
  useEffect(() => {
    nextTimeoutRef.current = state.nextTimeout;
  }, [state.nextTimeout]);

  // Keep adding animations until there's no nextTimeout
  const addAnimation = useCallback(() => {
    dispatch({ type: ACTIONS.addAnimation });

    if (nextTimeoutRef.current) {
      timePassedRef.current = setTimeout(() => {
        addAnimation();
      }, nextTimeoutRef.current);
    }
  }, []);

  const addInitialAnimation = useCallback(() => {
    clearTimeout(resetTimeRef.current);
    clearTimeout(timePassedRef.current);
    dispatch({ type: ACTIONS.reset });
    setTimeout(() => {
      addAnimation();
    }, 0);
  }, [addAnimation]);

  const handleDone = useCallback(() => {
    clearTimeout(timePassedRef.current);
    dispatch({ type: ACTIONS.done });

    resetTimeRef.current = setTimeout(() => {
      dispatch({ type: ACTIONS.reset });
    }, 4 * ONE_SECOND);
  }, []);

  const handleUpdateBreakpoints = useCallback((newBreakpoints) => {
    dispatch({ type: ACTIONS.updateBreakpoints, payload: newBreakpoints });
  }, []);

  // Clear timer when unmounted
  useEffect(() => {
    return () => {
      clearTimeout(timePassedRef.current);
      clearTimeout(resetTimeRef.current);
    };
  }, []);

  return {
    ...state,
    addInitialAnimation,
    dispatch,
    handleDone,
    handleUpdateBreakpoints,
  };
};
