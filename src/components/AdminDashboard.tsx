import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Clock, CheckCircle, LogOut, Sparkles, CalendarHeart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoveMeter } from "./LoveMeter";
import { questions } from "@/data/questions";
import { toast } from "sonner";

interface Response {
  id: string;
  question_id: number;
  answer: "yes" | "maybe";
  created_at: string;
}

interface Status {
  id: string;
  accepted: boolean;
  accepted_at: string | null;
  love_meter_value: number;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch responses
    const { data: responsesData, error: responsesError } = await supabase
      .from("valentine_responses")
      .select("*")
      .order("created_at", { ascending: true });

    if (responsesError) {
      console.error("Error fetching responses:", responsesError);
    } else {
      setResponses(responsesData || []);
    }

    // Fetch status
    const { data: statusData, error: statusError } = await supabase
      .from("valentine_status")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (statusError) {
      console.error("Error fetching status:", statusError);
    } else {
      setStatus(statusData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Set up realtime subscription for responses
    const responsesChannel = supabase
      .channel("valentine_responses_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "valentine_responses",
        },
        (payload) => {
          toast("New response received! 💕", { icon: "💌" });
          setResponses((prev) => [...prev, payload.new as Response]);
        }
      )
      .subscribe();

    // Set up realtime subscription for status
    const statusChannel = supabase
      .channel("valentine_status_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "valentine_status",
        },
        (payload) => {
          if ((payload.new as Status)?.accepted) {
            toast.success("SHE SAID YES! 🎉💕", { duration: 10000 });
          }
          setStatus(payload.new as Status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(responsesChannel);
      supabase.removeChannel(statusChannel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQuestionText = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    return question?.text || `Question ${questionId}`;
  };

  const handleReset = async () => {
    // Delete all responses
    await supabase.from("valentine_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    // Delete status
    await supabase.from("valentine_status").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    setResponses([]);
    setStatus(null);
    toast.success("Reset complete! Ready for a new attempt 💌");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-valentine-red text-xl animate-pulse">Loading responses... 💕</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-romantic text-valentine-red flex items-center gap-2">
            <Heart className="w-8 h-8 fill-current" />
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={fetchData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="ghost" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-2 border-valentine-rose bg-card/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="bg-gradient-to-r from-valentine-pink to-valentine-red">
            <CardTitle className="text-center text-primary-foreground flex items-center justify-center gap-2">
              <CalendarHeart className="w-6 h-6" />
              Valentine Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="text-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 ${
                    status?.accepted
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : "bg-valentine-rose"
                  }`}
                >
                  {status?.accepted ? (
                    <CheckCircle className="w-12 h-12 text-white" />
                  ) : (
                    <Clock className="w-12 h-12 text-valentine-red" />
                  )}
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {status?.accepted ? "She Said YES! 💕" : "Waiting for her answer..."}
                </p>
              </div>

              <div className="w-full max-w-xs">
                <LoveMeter value={status?.love_meter_value || 0} />
              </div>
            </div>

            {status?.accepted && status?.accepted_at && (
              <div className="mt-6 p-4 bg-valentine-blush rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-1">She said YES at:</p>
                <p className="text-lg font-semibold text-valentine-red flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {formatDate(status.accepted_at)}
                  <Sparkles className="w-5 h-5" />
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Response History */}
        <Card className="border-2 border-valentine-rose bg-card/90 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-valentine-red flex items-center gap-2">
              <Heart className="w-5 h-5 fill-current" />
              Response History ({responses.length} responses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No responses yet. Share the app with your Valentine! 💌
              </p>
            ) : (
              <div className="space-y-3">
                {responses.map((response) => (
                  <div
                    key={response.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-valentine-blush rounded-xl gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          response.answer === "yes"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {response.answer === "yes" ? "💕" : "🤔"}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {getQuestionText(response.question_id)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {response.answer === "yes" ? "Said Yes!" : "Said Maybe"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(response.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="text-center">
          <Button variant="reset" onClick={handleReset}>
            Reset & Ask Again 💌
          </Button>
        </div>
      </div>
    </div>
  );
};
