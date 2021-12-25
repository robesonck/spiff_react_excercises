import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

export const DEFAULT_SECONDS = 15;
export const ONE_SECOND = 1000;
const PERCENTAGE_STOP = 90;

const ACTIONS = {
  reset: "RESET",
  addNormalAnimation: "ADD_NORMAL_ANIMATION",
  setTime: "SET_TIME",
  done: "DONE",
};

const initialState = {
  passedMilliseconds: 0,
  transitionDuration: 0,
  realProgress: 0,
  animatedProgress: 0,
  hasStarted: false,
};

function init(initialState) {
  const expectedMilliseconds = initialState.expectedSeconds * ONE_SECOND;
  return {
    ...initialState,
    expectedMilliseconds,
    stopMilliseconds: expectedMilliseconds * (PERCENTAGE_STOP / 100.0),
  };
}

const getProgress = (passedTime, totalTime) => {
  return Math.round((passedTime / totalTime) * 100);
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.addNormalAnimation:
      return {
        ...state,
        hasStarted: true,
        transitionDuration: action.payload,
        animatedProgress: getProgress(
          action.payload,
          state.expectedMilliseconds
        ),
      };
    case ACTIONS.setTime:
      return {
        ...state,
        passedMilliseconds: action.payload,
        realProgress: getProgress(action.payload, state.expectedMilliseconds),
      };
    case ACTIONS.done:
      return {
        ...state,
        transitionDuration: ONE_SECOND,
        animatedProgress: 100,
        realProgress: 0,
      };
    case ACTIONS.reset:
      return { ...state, ...initialState };
    default:
      return state;
  }
}

export const useProgressBarState = (expectedSeconds) => {
  const resetTimeRef = useRef(null);
  const timePassedRef = useRef(null);
  const [state, dispatch] = useReducer(
    reducer,
    { ...initialState, expectedSeconds },
    init
  );

  const isFinishingDoneAnimation = useMemo(
    () => state.hasStarted && state.realProgress === 0,
    [state.hasStarted, state.realProgress]
  );

  // Add animation for 15 seconds, then set a timer to when that time has passed to actually set that time has passed
  const addNormalAnimation = useCallback(
    (animationTime) => {
      if (isFinishingDoneAnimation) {
        // When we're finishing an animation
        clearTimeout(resetTimeRef.current);
        dispatch({ type: ACTIONS.reset });
      }
      setImmediate(() => {
        dispatch({ type: ACTIONS.addNormalAnimation, payload: animationTime });
      });

      timePassedRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.setTime, payload: animationTime });
      }, animationTime);
    },
    [isFinishingDoneAnimation]
  );

  const handleDone = useCallback(() => {
    clearTimeout(timePassedRef.current);
    dispatch({ type: ACTIONS.done });

    resetTimeRef.current = setTimeout(() => {
      dispatch({ type: ACTIONS.reset });
    }, 4 * ONE_SECOND);
  }, []);

  // Clear timer when unmounted
  useEffect(() => {
    return () => {
      clearTimeout(timePassedRef.current);
      clearTimeout(resetTimeRef.current);
    };
  }, []);

  return { ...state, addNormalAnimation, handleDone, dispatch };
};
