import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MoodTracker from "@/components/MoodTracker";
import Wishlist from "@/components/Wishlist";
import MoodHistory from "@/components/MoodHistory";
import { Heart } from "lucide-react";

interface MoodEntry {
  id: string;
  emoji: string;
  mood_label: string;
  notes: string | null;
  created_at: string;
}

interface WishlistItem {
  id: string;
  item: string;
  is_fulfilled: boolean;
  created_at: string;
}

const Index = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const fetchMoods = async () => {
    const { data } = await supabase
      .from("moods")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMoods(data);
  };

  const fetchWishlist = async () => {
    const { data } = await supabase
      .from("wishlist")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setWishlistItems(data);
  };

  useEffect(() => {
    fetchMoods();
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen romantic-gradient">
      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-8 w-8 text-primary animate-float" fill="currentColor" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Hey Beautiful 💕
          </h1>
          <p className="text-muted-foreground">
            How are you feeling today?
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <div className="max-w-lg mx-auto space-y-6">
          <MoodTracker onMoodAdded={fetchMoods} />
          <Wishlist items={wishlistItems} onItemChanged={fetchWishlist} />
          <MoodHistory moods={moods} />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 text-sm text-muted-foreground">
        Made with 💖
      </footer>
    </div>
  );
};

export default Index;
