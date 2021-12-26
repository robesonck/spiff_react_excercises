import React, { useEffect, useMemo } from "react";
import "./ProgressBar.scss";
import { DEFAULT_SECONDS, useProgressBarState } from "./useProgressBarState";
const DEFAULT_BREAKPOINTS = [];

// Normally we would be using prop-types or typescript to type-check our props
const ProgressBar = ({
  loading,
  expectedSeconds = DEFAULT_SECONDS,
  breakpoints = DEFAULT_BREAKPOINTS,
}) => {
  const {
    hasStarted,
    transitionDuration,
    animatedProgress,
    addInitialAnimation,
    handleDone,
    handleUpdateBreakpoints,
  } = useProgressBarState(expectedSeconds, breakpoints);

  useEffect(() => {
    handleUpdateBreakpoints(breakpoints);
  }, [handleUpdateBreakpoints, breakpoints]);

  useEffect(() => {
    if (loading) {
      addInitialAnimation();
    }
  }, [addInitialAnimation, loading]);

  useEffect(() => {
    if (!loading && hasStarted) {
      handleDone();
    }
  }, [handleDone, hasStarted, loading]);

  const classNames = useMemo(() => {
    let className = "";
    if (animatedProgress === 100) {
      className += " done";
    } else if (animatedProgress !== 0) {
      className += " normal-step";
    }
    return className;
  }, [animatedProgress]);

  return (
    <div
      data-testid="progress-bar"
      className={`progress-bar ${loading ? "visible" : "hidden"}`}
    >
      <div
        data-testid="progress-bar-inner"
        className={`progress-bar__inner ${classNames}`}
        style={{
          width: `${animatedProgress}%`,
          transitionDuration: `${transitionDuration}ms`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
