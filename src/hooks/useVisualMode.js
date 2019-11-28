import { useState } from 'react';

export default function useVisualMode (initialState) {
  const [mode, setMode] = useState(initialState);
  const [history, setHistory] = useState([initialState]);

  const transition = (nextMode, isReplace=false) => {
    setMode(nextMode);
    !isReplace && setHistory((prev) => [...prev, nextMode]);
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory((prev) => prev.slice(0, -1));
      return;
    }
    setMode(history[0]);
  }

  return {
    mode,
    transition,
    back
  }
} 