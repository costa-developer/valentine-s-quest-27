import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const syncResponseToDb = async (answer: "yes" | "maybe", questionId: number) => {
    try {
      await supabase.from("valentine_responses").insert({
        question_id: questionId,
        answer: answer,
      });
    } catch (error) {
      console.error("Error syncing response:", error);
    }
  };

  const syncStatusToDb = async (accepted: boolean, loveMeterValue: number, acceptedAt: string | null) => {
    try {
      // Check if status exists
      const { data: existing } = await supabase
        .from("valentine_status")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from("valentine_status")
          .update({
            accepted,
            love_meter_value: loveMeterValue,
            accepted_at: acceptedAt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        // Insert new
        await supabase.from("valentine_status").insert({
          accepted,
          love_meter_value: loveMeterValue,
          accepted_at: acceptedAt,
        });
      }
    } catch (error) {
      console.error("Error syncing status:", error);
    }
  };

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

    // Sync to database
    syncResponseToDb(answer, questionId);
    syncStatusToDb(false, newLoveMeter, null);
  };

  const setAccepted = () => {
    const acceptedAt = new Date().toISOString();
    
    setState((prev) => ({
      ...prev,
      accepted: true,
      acceptedAt,
      loveMeterValue: 100,
    }));

    // Sync to database
    syncStatusToDb(true, 100, acceptedAt);
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
