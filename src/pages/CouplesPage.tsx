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
      .on("postgres_changes", { event: "*", schema: "public", table: "moods" }, () => {
        fetchMoods();
      })
      .subscribe();

    const msgChannel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(moodChannel);
      supabase.removeChannel(msgChannel);
    };
  }, []);

  const greeting = role === "girl" ? "Hey Beautiful 🌸" : "Hey Handsome 💙";

  return (
    <div className="min-h-screen romantic-gradient">
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          <Heart
            className={`h-8 w-8 mx-auto mb-2 animate-float ${role === "girl" ? "text-girl-accent" : "text-boy-accent"}`}
            fill="currentColor"
          />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {greeting}
          </h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>
      </header>

      <main className="px-4 pb-12">
        <div className="max-w-lg mx-auto space-y-6">
          <MoodTracker role={role} onMoodAdded={fetchMoods} />
          <MessageChat role={role} messages={messages} />
          <MoodHistory moods={moods} currentRole={role} />
        </div>
      </main>

      <footer className="text-center pb-8 text-sm text-muted-foreground">
        Made with 💖
      </footer>
    </div>
  );
};

export default CouplesPage;
