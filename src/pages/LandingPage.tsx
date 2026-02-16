import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen romantic-gradient flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <Heart className="h-16 w-16 text-primary animate-float mx-auto" fill="currentColor" />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Our Space 💕
        </h1>
        <p className="text-muted-foreground text-lg">
          A little corner of the internet, just for us.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/girl"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold bg-girl-accent text-primary-foreground hover:opacity-90 transition-all duration-200 hover:scale-105 soft-shadow"
          >
            I'm Her 🌸
          </Link>
          <Link
            to="/boy"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-semibold bg-boy-accent text-primary-foreground hover:opacity-90 transition-all duration-200 hover:scale-105 soft-shadow"
          >
            I'm Him 💙
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        Made with 💖
      </footer>
    </div>
  );
};

export default LandingPage;
