

# Couples Mood & Messaging App

## Overview
Transform the single-person mood tracker into a couples app with two separate URLs -- one for the boy (`/boy`) and one for the girl (`/girl`). Each person can only interact with their own side, but both see each other's moods and messages in real-time. The wishlist section will be removed and replaced with a messaging section.

## How It Works

- **Girl's URL**: `/girl` -- She can log her mood and send messages. She sees both her and his mood history + shared messages.
- **Boy's URL**: `/boy` -- He can log his mood and send messages. He sees both his and her mood history + shared messages.
- Each person can only submit moods for their own "side" (enforced by the URL/role parameter stored with each entry).
- Both sides see all moods and messages from both people, updated in real-time.

## Changes

### 1. Database Changes
- **Modify `moods` table**: Add a `role` column (`text`, values: `'boy'` or `'girl'`) so each mood entry is tagged with who submitted it.
- **Create `messages` table**: Stores messages between the couple with columns: `id`, `role` (who sent it), `content`, `created_at`.
- **Remove `wishlist` table**: Drop the table as it's no longer needed.
- **Enable Realtime**: Add both `moods` and `messages` tables to the realtime publication so changes appear instantly on both sides.
- RLS policies will remain open (public access, no login required) consistent with the current approach.

### 2. Routing
- Update `App.tsx` to add two routes: `/boy` and `/girl`.
- The root `/` route will show a landing/splash page where the user picks their side (or you can just share the direct links).
- Each route passes a `role` prop (`"boy"` or `"girl"`) to the main page component.

### 3. UI/Page Redesign
- **New landing page** (`/`): A simple romantic page with two buttons -- "I'm Her" and "I'm Him" -- linking to `/girl` and `/boy`.
- **Couples page** (shared component for both `/boy` and `/girl`):
  - Header shows a personalized greeting based on role (e.g., "Hey Beautiful" for girl, "Hey Handsome" for boy).
  - **My Mood section**: Only the current user can submit moods (tagged with their role).
  - **Our Moods section**: Shows mood history from both sides, labeled with who posted each one (with different color accents for boy vs girl).
  - **Messages section**: A chat-like interface where both can send messages to each other. Messages are displayed in a conversation format with sender labels.
  - Wishlist section is removed entirely.

### 4. Real-time Updates
- Subscribe to Supabase Realtime on both `moods` and `messages` tables so that when one person submits a mood or sends a message, the other person sees it instantly without refreshing.

### 5. Files to Create/Modify
- **New**: `src/pages/LandingPage.tsx` -- Role selection page
- **New**: `src/pages/CouplesPage.tsx` -- Main couples page (replaces Index for `/boy` and `/girl`)
- **New**: `src/components/MessageChat.tsx` -- Chat/messaging component
- **Modified**: `src/components/MoodTracker.tsx` -- Accept `role` prop, tag moods with role
- **Modified**: `src/components/MoodHistory.tsx` -- Show moods from both sides with role labels
- **Modified**: `src/App.tsx` -- Add new routes
- **Modified**: `src/pages/Index.tsx` -- Redirect to landing page or become the landing page
- **Deleted**: `src/components/Wishlist.tsx` -- No longer needed

### 6. Design Enhancements
- Boy's side gets a slightly different color accent (soft blue tones) while girl's side keeps the pink/rose tones.
- Messages styled like a chat bubble UI (left/right alignment based on sender).
- Both sides maintain the soft romantic aesthetic.

## Technical Details

### Database Migration SQL
```sql
-- Add role column to moods
ALTER TABLE public.moods ADD COLUMN role text NOT NULL DEFAULT 'girl';

-- Create messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for messages (public access)
CREATE POLICY "Anyone can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.moods;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Drop wishlist table
DROP TABLE public.wishlist;
```

### Route Structure
```text
/         --> LandingPage (pick boy or girl)
/boy      --> CouplesPage (role="boy")
/girl     --> CouplesPage (role="girl")
```

### Realtime Subscriptions
Both `/boy` and `/girl` pages subscribe to postgres_changes on `moods` and `messages` tables, automatically refreshing data when either person makes changes.
