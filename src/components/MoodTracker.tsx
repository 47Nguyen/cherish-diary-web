import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😍", label: "In Love" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "🥰", label: "Grateful" },
  { emoji: "😎", label: "Confident" },
];

interface MoodTrackerProps {
  onMoodAdded: () => void;
}

const MoodTracker = ({ onMoodAdded }: MoodTrackerProps) => {
  const [selectedMood, setSelectedMood] = useState<{ emoji: string; label: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood 💕",
        description: "How are you feeling today?",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("moods").insert({
      emoji: selectedMood.emoji,
      mood_label: selectedMood.label,
      notes: notes || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Oops!",
        description: "Couldn't save your mood. Try again?",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Mood saved! 💖",
      description: `Feeling ${selectedMood.label.toLowerCase()} today`,
    });

    setSelectedMood(null);
    setNotes("");
    onMoodAdded();
  };

  return (
    <Card className="glass-card soft-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-2xl text-foreground">
          <Heart className="h-6 w-6 text-primary animate-pulse-soft" />
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-200 hover:scale-110 ${
                selectedMood?.label === mood.label
                  ? "bg-primary/20 ring-2 ring-primary scale-105"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Want to share more about your day? 💭"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] resize-none bg-muted/30 border-border/50 focus:border-primary/50"
        />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02]"
        >
          {isSubmitting ? "Saving..." : "Save My Mood 💕"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
