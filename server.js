const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const PORT = process.env.PORT || 10000;
const ROOT = __dirname;
const players = new Map();
const schools = new Set(['FUOYE','UNILAG','OAU','UNIBEN','UI','FUTA','UNN','LASU','Other']);
const clean = (v,max=24)=>String(v||'').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,max);
const server = http.createServer((req,res)=>{
 if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({ok:true,service:'naija-campus',players:players.size}));}
 let pathname;try{pathname=decodeURIComponent((req.url||'/').split('?')[0]);}catch{res.writeHead(400);return res.end('Bad request');}
 if(pathname==='/')pathname='/index.html';
 const file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)&&file!==ROOT){res.writeHead(403);return res.end('Forbidden');}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404,{'Content-Type':'text/plain'});return res.end('Not found');}const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);});
});
const wss=new WebSocket.Server({server,maxPayload:2048});
function broadcast(m){const raw=JSON.stringify(m);for(const c of wss.clients)if(c.readyState===WebSocket.OPEN)c.send(raw)}
function snapshot(){return [...players.values()]}
wss.on('connection',ws=>{const id=Math.random().toString(36).slice(2,10);const p={id,name:'Student',school:'Other',x:440+Math.random()*20,y:300+Math.random()*20,color:`hsl(${Math.floor(Math.random()*360)} 68% 61%)`};players.set(id,p);ws.send(JSON.stringify({type:'welcome',id,players:snapshot()}));broadcast({type:'join',player:p});let chatAt=0,moveAt=Date.now(),moves=0;
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw.toString())}catch{return}if(!m||typeof m!=='object')return;
 if(m.type==='profile'){p.name=clean(m.name,20)||'Student';const s=clean(m.school,32);p.school=schools.has(s)?s:'Other';broadcast({type:'update',player:p});return;}
 if(m.type==='move'){const now=Date.now();if(now-moveAt>1000){moveAt=now;moves=0}if(++moves>35)return;const x=Number(m.x),y=Number(m.y);if(Number.isFinite(x)&&Number.isFinite(y)){p.x=Math.max(24,Math.min(876,x));p.y=Math.max(45,Math.min(565,y));broadcast({type:'move',id,x:p.x,y:p.y});}return;}
 if(m.type==='chat'){const now=Date.now();if(now-chatAt<600)return;chatAt=now;const text=clean(m.text,180);if(text)broadcast({type:'chat',id,name:p.name,school:p.school,text,at:now});}
 });ws.on('close',()=>{players.delete(id);broadcast({type:'leave',id});});});
setInterval(()=>broadcast({type:'state',players:snapshot()}),1500);
server.listen(PORT,()=>console.log(`Naija Campus v0.4 server listening on ${PORT}`));
