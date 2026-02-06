import { useState, useEffect } from "react";

interface Response {
  answer: "yes" | "maybe";
  timestamp: string;
  questionId: number;
}

interface ValentineState {
  responses: Response[];
  loveMeterValue: number;
  accepted: boolean;
  acceptedAt: string | null;
  currentQuestion: number;
}

const STORAGE_KEY = "valentine-state";

const initialState: ValentineState = {
  responses: [],
  loveMeterValue: 0,
  accepted: false,
  acceptedAt: null,
  currentQuestion: 0,
};

export const useValentineState = () => {
  const [state, setState] = useState<ValentineState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addResponse = (answer: "yes" | "maybe", questionId: number) => {
    const newResponse: Response = {
      answer,
      timestamp: new Date().toISOString(),
      questionId,
    };

    const loveIncrease = answer === "yes" ? 25 : 10;
    const newLoveMeter = Math.min(100, state.loveMeterValue + loveIncrease);

    setState((prev) => ({
      ...prev,
      responses: [...prev.responses, newResponse],
      loveMeterValue: newLoveMeter,
      currentQuestion: prev.currentQuestion + 1,
    }));
  };

  const setAccepted = () => {
    setState((prev) => ({
      ...prev,
      accepted: true,
      acceptedAt: new Date().toISOString(),
      loveMeterValue: 100,
    }));
  };

  const reset = () => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    ...state,
    addResponse,
    setAccepted,
    reset,
  };
};
