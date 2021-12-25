import React, { useEffect, useMemo } from "react";
import "./ProgressBar.scss";
import { DEFAULT_SECONDS, useProgressBarState } from "./useProgressBarState";

// Normally we would be using prop-types or typescript to type-check our props
const ProgressBar = ({ loading, expectedSeconds = DEFAULT_SECONDS }) => {
  const {
    hasStarted,
    transitionDuration,
    stopMilliseconds,
    animatedProgress,
    addNormalAnimation,
    handleDone,
  } = useProgressBarState(expectedSeconds);

  useEffect(() => {
    if (loading) {
      addNormalAnimation(stopMilliseconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

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
    <div className={`progress-bar  ${loading ? "visible" : "hidden"}`}>
      <div
        className={`progress-inner ${classNames}`}
        style={{
          width: `${animatedProgress}%`,
          transitionDuration: `${transitionDuration}ms`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
