import React, { useState } from "react";
import Exercise from "../exercise/Exercise";
import BreakPointFiller from "./components/BreakPointFiller/BreakPointFiller";
import Button from "./components/Button/Button";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import "./Solution.scss";

const ProgressBarExercise = () => {
  return (
    <div className="progress-bar-exercise">
      <Exercise
        solution={<Solution />}
        specsUrl="https://github.com/SpiffInc/spiff_react_exercises/issues/1"
        title="Progress Bar Exercise"
      />
    </div>
  );
};

export default ProgressBarExercise;

// ----------------------------------------------------------------------------------

const Solution = () => {
  const [loading, setLoading] = useState(false);
  const [breakpoints, setBreakpoints] = useState([50, 75]);

  return (
    <div className="solution">
      <ProgressBar
        loading={loading}
        breakpoints={breakpoints}
        expectedSeconds={10}
      />
      <div className="solution__buttons">
        <Button onClick={() => setLoading(true)}>
          {loading ? "Loading..." : "Start Request"}
        </Button>
        <Button variant="danger" onClick={() => setLoading(false)}>
          Finish Request
        </Button>
      </div>
      <BreakPointFiller
        breakpoints={breakpoints}
        setBreakpoints={setBreakpoints}
        loading={loading}
      />
    </div>
  );
};
