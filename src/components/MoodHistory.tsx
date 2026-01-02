import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface MoodEntry {
  id: string;
  emoji: string;
  mood_label: string;
  notes: string | null;
  created_at: string;
}

interface MoodHistoryProps {
  moods: MoodEntry[];
}

const MoodHistory = ({ moods }: MoodHistoryProps) => {
  if (moods.length === 0) {
    return (
      <Card className="glass-card soft-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 font-display text-2xl text-foreground">
            <Calendar className="h-6 w-6 text-peach" />
            Mood History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No moods logged yet... How are you feeling today? 💭
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card soft-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-2xl text-foreground">
          <Calendar className="h-6 w-6 text-peach" />
          Mood History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {moods.map((mood) => (
            <div
              key={mood.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 transition-all duration-200 hover:bg-muted/50"
            >
              <div className="text-4xl shrink-0">{mood.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{mood.mood_label}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(mood.created_at), "MMM d, h:mm a")}
                  </span>
                </div>
                {mood.notes && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mood.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodHistory;
