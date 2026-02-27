# JamRoom - Demo Guide

## Quick Demo (5 minutes)

### 1. Start the Server

```bash
cd /home/bhavesh/work/codenote_apps/hackathon/jam_room
npm start
```

Server will start on `http://localhost:3001`

### 2. Open Host View (Laptop)

Open browser: `http://localhost:3001`

You'll see the poll creation screen.

### 3. Create a Demo Poll

**Question:** "What should we order for the hackathon snacks?"

**Options:**
- Samosas
- Kachoris
- Burgers
- Pizza

Click **"Start Poll"**

### 4. Participants Join

Share the network URL with your team:
- `http://<your-ip>:3001`

For local testing, open multiple browser tabs/windows with:
- `http://localhost:3001`
- `http://127.0.0.1:3001`
- Or use incognito mode

### 5. Vote

Each participant:
1. Sees the poll question
2. Selects an option
3. Clicks "Submit Vote"
4. Sees confirmation

### 6. View Results

Click **"Results"** in the bottom navigation to see:
- Live vote counts
- Percentages
- Bar graph visualization
- Leading option highlighted

### 7. Manage Poll

In the **Config** tab, you can:
- **End Poll** - Stop voting
- **Reset Poll** - Start fresh

## Demo Script

```
🎤 "Hey team, let's decide on snacks for our hackathon!"

[Open browser to localhost:3001]

🎤 "I'm creating a quick poll: What should we order?"

[Enter question and options, click Start Poll]

🎤 "Now everyone can join using the local network..."

[Open 2-3 more browser tabs as 'participants']

🎤 "Each person selects their choice and votes..."

[Vote from each tab]

🎤 "And look - results update in real-time!"

[Show Results tab]

🎤 "Samosas are winning! Decision made in under 2 minutes."

🎵 JamRoom - Making team decisions easy!
```

## Testing Real-Time Behavior

1. Open two browser windows side by side
2. Vote from one window
3. Watch the other window update instantly
4. Both show the same results

## Mobile Testing

If you have the mobile app running:

1. Find your laptop's IP: `ip addr show` or `ifconfig`
2. Enter IP:port in mobile app (e.g., `192.168.1.50:3001`)
3. Tap Connect
4. Vote from mobile
5. See results update on both web and mobile

## Success Criteria

✅ Multiple devices can connect
✅ Votes update instantly across all clients
✅ No crashes during demo
✅ UI matches the design
✅ Team can make real decisions

---

**Happy Voting! 🎵**
