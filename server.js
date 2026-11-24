const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end('Naija Campus multiplayer server is running.');
});
const wss = new WebSocket.Server({server});
const players = new Map();
const clean = (s, max=24) => String(s || '').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,max);
function broadcast(payload) {
  const msg = JSON.stringify(payload);
  wss.clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
}
function snapshot() { return [...players.values()]; }
wss.on('connection', (ws) => {
  const id = Math.random().toString(36).slice(2,10);
  const p = {id, name:'Student', school:'Other', x:420+Math.random()*80, y:300+Math.random()*80, color:`hsl(${Math.floor(Math.random()*360)} 70% 60%)`};
  players.set(id,p);
  ws.send(JSON.stringify({type:'welcome', id, players:snapshot()}));
  broadcast({type:'join', player:p});
  ws.on('message', raw => {
    let data; try { data = JSON.parse(raw.toString()); } catch { return; }
    if (data.type==='profile') { p.name=clean(data.name,20)||'Student'; p.school=clean(data.school,32)||'Other'; broadcast({type:'update',player:p}); }
    if (data.type==='move') { const x=Number(data.x), y=Number(data.y); if(Number.isFinite(x)&&Number.isFinite(y)){ p.x=Math.max(24,Math.min(816,x)); p.y=Math.max(40,Math.min(510,y)); broadcast({type:'move',id,x:p.x,y:p.y}); } }
    if (data.type==='chat') { const text=clean(data.text,180); if(text) broadcast({type:'chat',id,name:p.name,school:p.school,text,at:Date.now()}); }
  });
  ws.on('close', () => { players.delete(id); broadcast({type:'leave',id}); });
});
setInterval(()=>broadcast({type:'state',players:snapshot()}),1500);
server.listen(PORT,()=>console.log(`Naija Campus server listening on :${PORT}`));
