import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MoodTracker from "@/components/MoodTracker";
import MoodHistory from "@/components/MoodHistory";
import MessageChat from "@/components/MessageChat";
import { Heart } from "lucide-react";

interface MoodEntry {
  id: string;
  emoji: string;
  mood_label: string;
  notes: string | null;
  role: string;
  created_at: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface CouplesPageProps {
  role: "boy" | "girl";
}

const CouplesPage = ({ role }: CouplesPageProps) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMoods = async () => {
    const { data } = await supabase
      .from("moods")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMoods(data as MoodEntry[]);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  useEffect(() => {
    fetchMoods();
    fetchMessages();

    const moodChannel = supabase
      .channel("moods-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "moods" }, () => fetchMoods())
      .subscribe();

    const msgChannel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => fetchMessages())
      .subscribe();

    return () => {
      supabase.removeChannel(moodChannel);
      supabase.removeChannel(msgChannel);
    };
  }, []);

  const girlMoods = moods.filter((m) => m.role === "girl");
  const boyMoods = moods.filter((m) => m.role === "boy");

  return (
    <div className="min-h-screen romantic-gradient">
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Heart className="h-8 w-8 text-primary animate-float mx-auto mb-2" fill="currentColor" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
            Our Space 💕
          </h1>
          <p className="text-muted-foreground text-sm">
            You're on the {role === "girl" ? "girl's 🌸" : "boy's 💙"} side
          </p>
        </div>
      </header>

      <main className="px-4 pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Single mood tracker for current role */}
          <div className="space-y-4">
            <h2 className={`font-display text-xl font-semibold text-center ${role === "girl" ? "text-girl-accent" : "text-boy-accent"}`}>
              {role === "girl" ? "Your Mood 🌸" : "Your Mood 💙"}
            </h2>
            <MoodTracker role={role} onMoodAdded={fetchMoods} />
          </div>

          {/* Shared messages */}
          <MessageChat role={role} messages={messages} />

          {/* Side by side mood histories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodHistory moods={girlMoods} currentRole="girl" />
            <MoodHistory moods={boyMoods} currentRole="boy" />
          </div>
        </div>
      </main>

      <footer className="text-center pb-8 text-sm text-muted-foreground">
        Made with 💖
      </footer>
    </div>
  );
};

export default CouplesPage;
