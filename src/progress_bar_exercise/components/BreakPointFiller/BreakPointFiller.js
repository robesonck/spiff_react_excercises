import React, { useRef } from "react";
import Button from "../Button/Button";

import "./BreakPointFiller.scss";

const BreakPointFiller = ({ breakpoints, setBreakpoints, loading }) => {
  const newValueRef = useRef(null);
  const handleEditBreakpoint = (index, value) => {
    setBreakpoints((oldBreakpoints) => {
      const newBPs = [...oldBreakpoints];
      newBPs[index] = value;
      return newBPs;
    });
  };

  const handleAddBreakpoint = () => {
    setBreakpoints((oldBreakpoints) => {
      return [...oldBreakpoints, Number(newValueRef.current.value)];
    });
  };

  const handleRemoveBreakpoint = (index) => {
    setBreakpoints((oldBreakpoints) => {
      const newBPs = [...oldBreakpoints];
      newBPs.splice(index, 1);
      return newBPs;
    });
  };

  return (
    <div className="breakpoint-filler">
      <div className="breakpoint-filler__summary">
        <p>
          Breakpoints:{" "}
          <span>
            {breakpoints.length > 0
              ? JSON.stringify(breakpoints)
              : "No breakpoints"}
          </span>
        </p>
      </div>
      {!loading && (
        <div className="breakpoint-filler__defaults">
          <Button size="s" onClick={() => setBreakpoints([])}>
            No breakpoints
          </Button>
          <Button size="s" onClick={() => setBreakpoints([50, 75])}>
            Default breakpoints
          </Button>
        </div>
      )}
      {!loading && (
        <div>
          {breakpoints.map((breakpoint, index) => {
            return (
              <div key={index} className="breakpoint-filler__row">
                <input
                  type="number"
                  max={90}
                  value={breakpoint}
                  onChange={(e) =>
                    handleEditBreakpoint(index, Number(e.target.value))
                  }
                />
                <Button
                  size="s"
                  variant="danger"
                  onClick={() => handleRemoveBreakpoint(index)}
                >
                  -
                </Button>
              </div>
            );
          })}
          <div className="breakpoint-filler__add-container">
            <input ref={newValueRef} type="number" max={90} />
            <Button onClick={handleAddBreakpoint} size="s">
              +
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakPointFiller;
