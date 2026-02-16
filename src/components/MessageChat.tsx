import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface MessageChatProps {
  role: "boy" | "girl";
  messages: Message[];
}

const MessageChat = ({ role, messages }: MessageChatProps) => {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    setIsSending(true);
    const { error } = await supabase.from("messages").insert({
      role,
      content: content.trim(),
    });
    setIsSending(false);

    if (error) {
      toast({ title: "Couldn't send message", variant: "destructive" });
      return;
    }

    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="glass-card soft-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-2xl text-foreground">
          <MessageCircle className={`h-6 w-6 ${role === "girl" ? "text-girl-accent" : "text-boy-accent"}`} />
          Our Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[300px] overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No messages yet... Say something sweet 💬
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.role === role;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? role === "girl"
                        ? "bg-girl-accent text-primary-foreground rounded-br-sm"
                        : "bg-boy-accent text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.role === "girl" ? "Her" : "Him"} · {format(new Date(msg.created_at), "h:mm a")}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-muted/30 border-border/50 focus:border-primary/50"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !content.trim()}
            size="icon"
            className={`shrink-0 ${role === "girl" ? "bg-girl-accent hover:bg-girl-accent/90" : "bg-boy-accent hover:bg-boy-accent/90"}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageChat;
