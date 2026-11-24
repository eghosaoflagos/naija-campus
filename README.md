# Naija Campus v0.4 — Connected Multiplayer Campus

Mobile-first prototype with a campus map, player profiles, live player movement, online list, and shared chat using WebSockets.

## Update your existing GitHub repository (phone-friendly)
1. Download and extract this ZIP.
2. Open the extracted `naija_campus_v04` folder.
3. Upload these **three files to the root of your existing `naija-campus` GitHub repo**: `index.html`, `server.js`, and `package.json`. Replace the existing files of the same names. Do **not** upload the ZIP itself.
4. Commit directly to `main`.
5. Render should auto-deploy. If not, Render → your service → Manual Deploy → Deploy latest commit.
6. Open `https://naija-campus.onrender.com`.

Render settings: Build Command `npm install`; Start Command `npm start`; Node runtime. The root directory should be blank/default.

## Multiplayer test
Open the site on two phones or browsers. Enter a nickname and university on each. They should appear in the student list and on the campus map. Move with WASD/arrows or mobile directional pad. Send a chat message and check it arrives on the other device.

## Limitations
Prototype only: no accounts, moderation/report tools, persistent chat, voice, or save-state. One shared campus room. Player state is memory-only and resets on server restart. Avoid sharing sensitive personal details in chat.
