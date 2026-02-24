

## Daily 8 AM Bangkok Push Notification Reminders

### What This Does

Every day at 8 AM Bangkok time (1 AM UTC), each user's phone will receive a push notification reminding them to update their mood status. This works even when the browser is closed, as long as they previously granted notification permission.

### How It Works

```text
User opens /#/girl or /#/boy
       ↓
App asks: "Allow notifications?"
       ↓
User taps "Allow" → browser generates a push subscription
       ↓
Subscription saved to database (tagged as "girl" or "boy")
       ↓
Every day at 1 AM UTC (8 AM Bangkok):
  Cron job triggers backend function
       ↓
  Function reads all subscriptions from DB
       ↓
  Sends Web Push notification to each device
       ↓
  Phone shows: "Time to update your mood! 💕"
```

### Important Notes for You

- **Android**: Works in Chrome — just tap "Allow" when prompted
- **iPhone**: You must first **add the site to your Home Screen** (Safari → Share → Add to Home Screen), then open it from there. Only then will the notification permission prompt appear. This is an Apple requirement.
- If you change phones or clear browser data, you'll need to tap "Enable Reminders" again

---

### Technical Implementation

#### 1. VAPID Keys

Web Push requires a cryptographic key pair (VAPID keys) to identify the server as the notification sender. I will:
- Generate a VAPID key pair
- Store the private key + email as backend secrets (you'll need to provide an email address)
- Embed the public key in the frontend (safe to be public)

#### 2. New Database Table — `push_subscriptions`

```sql
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- RLS: open insert/select/delete (no auth in this app)
```

#### 3. Service Worker — `public/sw.js`

A small file that runs in the background and displays the notification when a push event arrives:
```javascript
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  self.registration.showNotification(data.title, { body: data.body, icon: '/favicon.ico' });
});
```

#### 4. Frontend Changes

- New **`src/hooks/usePushNotification.ts`** hook — handles requesting permission, registering the service worker, subscribing to push, and saving the subscription to the database
- **`src/pages/CouplesPage.tsx`** — add an "Enable Reminders 🔔" button in the header area that triggers the hook. Once enabled, it shows "Reminders On ✓"

#### 5. Backend Function — `send-mood-reminders`

A new backend function (`supabase/functions/send-mood-reminders/index.ts`) that:
1. Reads all push subscriptions from the database
2. Sends a Web Push notification to each one using VAPID keys
3. Removes expired/invalid subscriptions automatically

#### 6. Cron Job — Daily at 1 AM UTC (8 AM Bangkok)

A scheduled database job that calls the backend function every day:
```sql
SELECT cron.schedule(
  'daily-mood-reminder',
  '0 1 * * *',  -- 1 AM UTC = 8 AM Bangkok (UTC+7)
  $$ SELECT net.http_post(...) $$
);
```

### Files to Create / Modify

| File | Action | Purpose |
|---|---|---|
| `public/sw.js` | Create | Service worker for push events |
| `src/hooks/usePushNotification.ts` | Create | Hook for push subscription logic |
| `src/pages/CouplesPage.tsx` | Modify | Add "Enable Reminders" button |
| `supabase/functions/send-mood-reminders/index.ts` | Create | Backend function to send pushes |
| New migration | Create | `push_subscriptions` table + RLS |
| Cron SQL | Insert | Schedule the daily 8 AM Bangkok job |

### Secrets Needed

Before I can implement this, I will need to store two secrets:
1. **VAPID_PRIVATE_KEY** — I will generate this and ask you to save it
2. **VAPID_PUBLIC_KEY** — stored as a secret for the backend function
3. **VAPID_SUBJECT** — an email address (e.g. `mailto:you@example.com`) used to identify the push sender

