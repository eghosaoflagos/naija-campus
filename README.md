# Naija Campus v0.5 — Living Campus

Mobile-first multiplayer campus prototype for Nigerian students.

## v0.5 upgrades
- Student avatar selection (six student looks) synced to other connected players.
- Avatar-style player rendering on the shared campus map.
- Temporary speech bubbles above players when they send campus chat messages.
- Tap campus buildings to see their activity descriptions.
- Retains v0.4 WebSocket multiplayer, shared chat, online roster and movement.

## Update existing GitHub repository
Upload these five files to the root of your existing `naija-campus` repository, replacing files with the same names: `index.html`, `server.js`, `package.json`, `render.yaml`, `README.md`. Commit to `main`. Render should auto-deploy from the connected GitHub repository. If it does not, open the existing Render service and choose Manual Deploy → Deploy latest commit.

## Test
Open the deployed URL in two separate browsers/devices. Join with different nicknames and avatar choices. Confirm both players appear, move, see each other's avatar, and see chat speech bubbles. Tap the buildings to test location cards.

## Limitations
This remains a prototype. Building taps show informational prompts; they do not yet load separate interiors. No accounts, persistence, friend system, moderation/report system, voice chat, or mini-games are implemented.
