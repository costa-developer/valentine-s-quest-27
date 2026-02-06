import { Heart, Clock, CheckCircle, ArrowLeft, Sparkles, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoveMeter } from "./LoveMeter";

interface Response {
  answer: "yes" | "maybe";
  timestamp: string;
  questionId: number;
}

interface DashboardProps {
  responses: Response[];
  loveMeterValue: number;
  accepted: boolean;
  acceptedAt: string | null;
  onBack: () => void;
  onReset: () => void;
}

export const Dashboard = ({
  responses,
  loveMeterValue,
  accepted,
  acceptedAt,
  onBack,
  onReset,
}: DashboardProps) => {
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-romantic text-valentine-red flex items-center gap-2">
            <Heart className="w-8 h-8 fill-current" />
            Love Dashboard
          </h1>
          <div className="w-20" />
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
                    accepted
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : "bg-valentine-rose"
                  }`}
                >
                  {accepted ? (
                    <CheckCircle className="w-12 h-12 text-white" />
                  ) : (
                    <Clock className="w-12 h-12 text-valentine-red" />
                  )}
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {accepted ? "Accepted! 💕" : "Pending..."}
                </p>
              </div>

              <div className="w-full max-w-xs">
                <LoveMeter value={loveMeterValue} />
              </div>
            </div>

            {accepted && acceptedAt && (
              <div className="mt-6 p-4 bg-valentine-blush rounded-xl text-center">
                <p className="text-sm text-muted-foreground mb-1">She said YES at:</p>
                <p className="text-lg font-semibold text-valentine-red flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {formatDate(acceptedAt)}
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
              Response History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No responses yet. Share the link with your Valentine! 💌
              </p>
            ) : (
              <div className="space-y-3">
                {responses.map((response, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-valentine-blush rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          response.answer === "yes"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {response.answer === "yes" ? "💕" : "🤔"}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Question {response.questionId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {response.answer === "yes" ? "Said Yes!" : "Said Maybe"}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(response.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="text-center">
          <Button variant="reset" onClick={onReset}>
            Reset & Ask Again 💌
          </Button>
        </div>
      </div>
    </div>
  );
};
