import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./ProgressBar.scss";

const TIME_STEP = 500;
const DEFAULT_SECONDS = 15;
const ONE_SECOND = 1000;
const PERCENTAGE_STOP = 90;

// Normally we would be using prop-types or typescript to type-check our props
const ProgressBar = ({ loading }) => {
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const [passedMilliseconds, setPassedMilliseconds] = useState(0);

  const expectedMilliseconds = DEFAULT_SECONDS * ONE_SECOND;
  const stopMilliseconds = expectedMilliseconds * (PERCENTAGE_STOP / 100.0);

  const progress = useMemo(
    () => Math.round((passedMilliseconds / expectedMilliseconds) * 100),
    [passedMilliseconds, expectedMilliseconds]
  );

  const handleDone = useCallback(() => {
    setPassedMilliseconds(expectedMilliseconds);
    timeoutRef.current = setTimeout(() => {
      setPassedMilliseconds(0);
    }, 4 * ONE_SECOND);
  }, [expectedMilliseconds]);

  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setPassedMilliseconds((oldMilliseconds) => {
          if (oldMilliseconds === stopMilliseconds) {
            clearInterval(intervalRef.current);
          }
          return Math.min(oldMilliseconds + TIME_STEP, stopMilliseconds);
        });
      }, TIME_STEP);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        handleDone();
      }
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [handleDone, loading, stopMilliseconds]);

  const classNames = useMemo(() => {
    let className = "";
    if (progress === 100) {
      className += " done";
    } else if (progress !== 0) {
      className += " normal-step";
    }
    return className;
  }, [progress]);

  return (
    <div className={`progress-bar  ${loading ? "visible" : "hidden"}`}>
      <div
        className={`progress-inner ${classNames}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
