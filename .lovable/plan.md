
## UI Behavior Update: Role-Focused Layout

### What's Changing

The user wants the page to show only the **current user's mood tracker** at the top (no dimmed/disabled opposite side), and then display **both mood histories side by side at the bottom** so each person can see what the other logged. The messaging section stays in the middle.

### New Page Structure (for `/girl` and `/boy`)

```text
┌──────────────────────────────────────┐
│           Header (Our Space 💕)       │
├──────────────────────────────────────┤
│   YOUR Mood Tracker (full width)     │
│   (only shows the current side's     │
│    mood tracker, no other side)      │
├──────────────────────────────────────┤
│       Our Messages (chat)            │
├──────────────────────────────────────┤
│   Her Moods 🌸   │   His Moods 💙    │
│   (history)      │   (history)       │
└──────────────────────────────────────┘
```

- **Top section**: Only the mood tracker for the current role (girl sees only her tracker, boy sees only his). Full width, no dimmed side.
- **Middle section**: Shared chat/messages (unchanged).
- **Bottom section**: Side-by-side mood history for **both** girl and boy — so each person can scroll down and see both mood histories.

### Files to Modify

**`src/pages/CouplesPage.tsx`**
- Replace the 2-column `MoodTracker` grid with a single full-width `MoodTracker` rendered only for the current role (passing `role` as prop).
- Keep `MessageChat` in the middle.
- Keep the 2-column `MoodHistory` grid at the bottom (showing both girl and boy histories).

That's the only file that needs to change — `MoodTracker` and `MoodHistory` components themselves are already fine.

### Technical Details

Current problematic code (lines 88–100 of `CouplesPage.tsx`):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className={`... ${role !== "girl" ? "opacity-60 pointer-events-none" : ""}`}>
    <MoodTracker role="girl" ... />
  </div>
  <div className={`... ${role !== "boy" ? "opacity-60 pointer-events-none" : ""}`}>
    <MoodTracker role="boy" ... />
  </div>
</div>
```

Replaced with a single tracker:
```tsx
<div className="space-y-4">
  <h2 ...>{role === "girl" ? "Your Mood 🌸" : "Your Mood 💙"}</h2>
  <MoodTracker role={role} onMoodAdded={fetchMoods} />
</div>
```

The mood history section at the bottom stays as-is (both sides visible), which is exactly what the user wants — scroll down to see what both people have logged.
