import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Check, Trash2, Star } from "lucide-react";

interface WishlistItem {
  id: string;
  item: string;
  is_fulfilled: boolean;
  created_at: string;
}

interface WishlistProps {
  items: WishlistItem[];
  onItemChanged: () => void;
}

const Wishlist = ({ items, onItemChanged }: WishlistProps) => {
  const [newWish, setNewWish] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddWish = async () => {
    if (!newWish.trim()) {
      toast({
        title: "What do you wish for? ✨",
        description: "Please enter your wish",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("wishlist").insert({
      item: newWish.trim(),
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Oops!",
        description: "Couldn't save your wish. Try again?",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Wish added! ⭐",
      description: "May it come true soon!",
    });

    setNewWish("");
    onItemChanged();
  };

  const toggleFulfilled = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("wishlist")
      .update({ is_fulfilled: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Oops!",
        description: "Couldn't update the wish",
        variant: "destructive",
      });
      return;
    }

    if (!currentStatus) {
      toast({
        title: "Wish fulfilled! 🎉",
        description: "How wonderful!",
      });
    }

    onItemChanged();
  };

  const deleteWish = async (id: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", id);

    if (error) {
      toast({
        title: "Oops!",
        description: "Couldn't delete the wish",
        variant: "destructive",
      });
      return;
    }

    onItemChanged();
  };

  const activeWishes = items.filter((item) => !item.is_fulfilled);
  const fulfilledWishes = items.filter((item) => item.is_fulfilled);

  return (
    <Card className="glass-card soft-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-2xl text-foreground">
          <Sparkles className="h-6 w-6 text-lavender animate-pulse-soft" />
          My Wishlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="I wish for..."
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddWish()}
            className="bg-muted/30 border-border/50 focus:border-lavender/50"
          />
          <Button
            onClick={handleAddWish}
            disabled={isSubmitting}
            className="bg-lavender hover:bg-lavender/80 text-secondary-foreground px-6 shrink-0"
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>

        {activeWishes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Wishes ✨</h4>
            <div className="space-y-2">
              {activeWishes.map((wish) => (
                <div
                  key={wish.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group transition-all duration-200 hover:bg-muted/50"
                >
                  <button
                    onClick={() => toggleFulfilled(wish.id, wish.is_fulfilled)}
                    className="h-6 w-6 rounded-full border-2 border-lavender/50 hover:border-lavender hover:bg-lavender/20 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Check className="h-3 w-3 text-lavender opacity-0 group-hover:opacity-50" />
                  </button>
                  <span className="flex-1 text-foreground">{wish.item}</span>
                  <button
                    onClick={() => deleteWish(wish.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {fulfilledWishes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Fulfilled 🎉</h4>
            <div className="space-y-2">
              {fulfilledWishes.map((wish) => (
                <div
                  key={wish.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 group transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFulfilled(wish.id, wish.is_fulfilled)}
                    className="h-6 w-6 rounded-full bg-lavender flex items-center justify-center shrink-0"
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </button>
                  <span className="flex-1 text-muted-foreground line-through">{wish.item}</span>
                  <button
                    onClick={() => deleteWish(wish.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No wishes yet... What do you dream of? ✨
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Wishlist;
