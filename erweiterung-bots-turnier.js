window.addEventListener("error",function(e){try{var d=document.getElementById("errbox");if(!d){d=document.createElement("pre");d.id="errbox";d.style.cssText="position:fixed;left:6px;right:6px;bottom:6px;max-height:40vh;overflow:auto;margin:0;padding:8px;background:#fff;color:#c00;border:3px solid #c00;border-radius:10px;font:12px/1.3 monospace;z-index:999;white-space:pre-wrap";document.body.appendChild(d)}d.textContent+="Fehler: "+e.message+" (Zeile "+e.lineno+")\n"}catch(x){}});
/* Spiele-Lounge: Computer-Mitspieler + Turnier-Spiellänge */
(function(){
/* ---------- Oberfläche ---------- */
var st=document.createElement("style");
st.textContent="#dfw{display:none!important}input[type=checkbox]{width:22px;height:22px;padding:0;margin:0;accent-color:var(--acc);flex:none}.opt{display:inline-flex;align-items:center;gap:6px;background:var(--field);border:2px solid var(--ink);border-radius:999px;padding:6px 12px;margin:3px;font-weight:700;cursor:pointer}";
document.head.appendChild(st);
var card=document.createElement("div");card.className="card";card.id="bcard";card.style.display="none";
card.innerHTML='<b>🤖 Computer-Mitspieler</b><div class="sub" id="bnh" style="margin:4px 0 8px"></div><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><span style="flex:1;text-align:left">Anzahl</span><select id="bn" style="width:auto"></select></div><div style="display:flex;gap:8px;align-items:center"><span style="flex:1;text-align:left">Schwierigkeit</span><span id="dfh"></span></div>';
$("frl2").parentNode.insertBefore(card,$("frl2"));
$("dfh").appendChild($("df"));
var tl=document.createElement("div");tl.id="tnl";
tl.innerHTML='<div class="lbl" style="text-align:left;margin:4px 0">Spiellänge (mindestens eine)</div><label class="opt"><input type="checkbox" id="tl0" checked> ⚡ Kurz</label><label class="opt"><input type="checkbox" id="tl1" checked> ⏱ Mittel</label><label class="opt"><input type="checkbox" id="tl2" checked> 🐢 Lang</label><div class="sub" style="font-size:.78rem;margin:4px 0 10px;text-align:left">Kurz: Tic Tac Toe, Vier gewinnt, Quiz …<br>Mittel: Hex, UNO, Fünf gewinnt …<br>Lang: Dame, Ludo, Werwolf, Kniffel …</div>';
$("tnm").insertAdjacentElement("afterend",tl);
["tl0","tl1","tl2"].forEach(function(id){$(id).onchange=function(){if(!$("tl0").checked&&!$("tl1").checked&&!$("tl2").checked){this.checked=true;toast("Mindestens eine Länge muss aktiv bleiben.")}}});

/* ---------- Hilfen ---------- */
var GL={ttt:0,rps:0,nim:0,choc:0,hang:0,bj:0,c4:0,mem:0,quiz:0,hl:0,pig:1,five:1,code:1,mine:1,kal:1,hex:1,brk:1,dbx:1,snake:1,uno:1,wbi:1,rv:2,dame:2,kn:2,ludo:2,mono:2,wolf:2,imp:2,paint:2,ship:2};
var bt={key:"",at:0,p:{},rv:{}},BI=1,curLen=0,reqL={},kind="";
function isBotKey(k){return typeof k==="string"&&/^bot\d+$/.test(k)}
function botLabel(k){return"Computer "+k.slice(3)+" 🤖"}
function isBotIdx(i){return botOn?i>=1:(net?isBotKey(order[i]):false)}
function nbN(){return net&&!amHost()?0:Math.max(0,+$("bn").value||0)}
function lenOk(k,len){return !!((len||7)&(1<<(GL[k]||0)))}
function tnMask(){return($("tl0").checked?1:0)|($("tl1").checked?2:0)|($("tl2").checked?4:0)||7}
function ML(){return curLen||(T&&T.len)||tnMask()}
function rr(a,b){return a+Math.random()*(b-a)}
function rv(k){if(bt.rv[k]===undefined)bt.rv[k]=Math.random();return bt.rv[k]}
function fillBn(mn,kd){var s=$("bn"),cur=+s.value,i,o;s.innerHTML="";
for(i=mn;i<=9;i++){o=document.createElement("option");o.value=i;o.textContent=i?String(i):"keine";s.appendChild(o)}
s.value=String(Math.max(mn,Math.min(9,cur||mn)));
$("bnh").textContent=kd==="b"?"So viele Computer spielen mit, wie das Spiel braucht (höchstens so viele wie erlaubt).":"Nur du als Host siehst das. Computer füllen freie Plätze auf, bis das Spiel voll ist. Dein Handy steuert sie, lass die App offen. Im Turnier spielen keine Computer mit."}
setInterval(function(){var k=botOn?"b":net?"n":"l";
if(k!==kind){kind=k;if(k!=="l")fillBn(k==="b"?1:0,k)}
card.style.display=(botOn||(net&&amHost()))?"":"none"},400);

/* ---------- Namen ---------- */
var _nm=nm;nm=function(i){if(botOn&&i>=1)return"Computer"+(order.length>2?" "+i:"")+" 🤖";if(net&&isBotKey(order[i]))return botLabel(order[i]);return _nm(i)};
var _lab=lab;lab=function(k){if(isBotKey(k))return botLabel(k);if(botOn&&k!=="0"&&k!=="1")return"Computer "+k+" 🤖";return _lab(k)};

/* ---------- Spiele mit Computern starten ---------- */
var _sg=startGame;
startGame=function(g,sd){var d=G[g],i;
if(net&&amHost()){var hs=shufArr(players().slice(0,d.max).map(function(p){return p.peer})),nb=Math.max(0,Math.min(nbN(),d.max-hs.length)),l=hs.slice();
for(i=1;i<=nb;i++)l.push("bot"+i);l=shufArr(l);
if(l.length<d.min){toast("Für "+d.n+" brauchst du mindestens "+d.min+" Mitspieler. Stell mehr Computer ein.");return}
net.emit("start",{g:g,order:l,seed:sd});return}
if(botOn){if(!d.bot&&!ABOT[g]){toast("Dieses Spiel hat keinen Computergegner.");return}
var P=Math.max(d.min,Math.min(d.max,1+nbN())),o=[];for(i=0;i<P;i++)o.push(String(i));begin(g,o,sd);return}
return _sg(g,sd)};
var _begin=begin;begin=function(g,o,s){bt={key:"",at:0,p:{},rv:{}};return _begin(g,o,s)};
$("rndG").onclick=function(){if(T&&T.wt&&!gid){tnTile(null);return}
var n=net?players().length+nbN():+$("lp").value,ks=Object.keys(G).filter(function(k){var d=G[k];if(!botOn&&(n<d.min||n>d.max))return false;if(botOn&&!d.bot&&!ABOT[k])return false;if(!net&&!botOn&&d.online)return false;return true});
if(!ks.length){toast("Dafür passt gerade kein Spiel.");return}startGame(pick(ks),rnd())};

/* ---------- Züge der Computer ---------- */
botMove=function(){};
function send(i,m){if(net)net.emit("move",{n:moves.length,m:m,b:order[i]});else apply(m,i)}
function botTick(){if(!gid||!S||S.w!==null)return;
if(!(botOn?order.length>1:(net&&amHost()&&order.some(isBotKey))))return;
var g=gid,now=Date.now(),i;
if(G[g].any){var ab=ABOT[g];if(!ab)return;
for(i=0;i<order.length;i++){if(!isBotIdx(i))continue;var d=ab(S,i,+$("df").value);if(!d){delete bt.p[i];continue}
var p=bt.p[i];if(!p||p.k!==d.k)p=bt.p[i]={k:d.k,m:d.m,at:now+d.w*1000};
if(now>=p.at){p.at=now+3000;send(i,p.m)}}return}
if(!isBotIdx(S.t))return;
var key=g+":"+moves.length+":"+S.t;if(bt.key!==key){bt.key=key;bt.at=now+(g==="ship"&&S.pend?300:750)}
if(now<bt.at)return;bt.at=now+2500;
var m;BI=S.t;try{m=pickBot(g)}finally{BI=1}
if(m!==undefined&&m!==null)send(S.t,m)}
setInterval(botTick,400);
var _om=onMove;
onMove=function(msg){var d=msg.data;if(!gid||!d||d.n!==moves.length)return;
if(d.b!==undefined){if(!isHostPeer(msg.peer)||!isBotKey(d.b))return;apply(d.m,order.indexOf(d.b));return}
return _om(msg)};
/* Gegen-Spieler-Logik der Bots war auf Spieler 2 festgelegt: Brett spiegeln, wenn der Computer Spieler 1 ist */
function mir(g,fn){var o=G[g].bot;G[g].bot=function(s,d){if(BI!==0)return o(s,d);var s2=cl(s);fn(s2);return o(s2,d)}}
function flip(s){s.b=s.b.map(function(x){return x===null?null:1-x});s.t=1-s.t}
mir("ttt",flip);mir("c4",flip);
mir("rps",function(s){if(s.lr)s.lr=[s.lr[1],s.lr[0],s.lr[2]]});
mir("ship",function(s){s.sh=[s.sh[1],s.sh[0]]});
/* Spiele ohne Zugreihenfolge (alle gleichzeitig) */
var ABOT={
imp:function(s,i,d){var j,c=[];
if(s.ph==="talk"){if(s.rd[i])return null;for(j=0;j<s.P;j++)if(!isBotIdx(j)&&!s.rd[j])return null;return{k:"talk",m:{r:1,u:i},w:rr(2,6)}}
if(s.ph==="vote"){if(s.vt[i]>=0)return null;var v;
if(i!==s.imp&&Math.random()<[0,.2,.4][d])v=s.imp;else{for(j=0;j<s.P;j++)if(j!==i)c.push(j);v=pick(c)}
return{k:"vote",m:{v:v,u:i},w:rr(3,9)}}
if(s.ph==="guess"&&i===s.imp){var ci=s.op.indexOf(s.wd),g;
if(Math.random()<[.17,.35,.6][d])g=ci;else{for(j=0;j<s.op.length;j++)if(j!==ci)c.push(j);g=pick(c)}
return{k:"guess",m:{g:g,u:i},w:rr(3,7)}}
return null},
wolf:function(s,i,d){if(!s.al[i])return null;var al=[],j,rl=s.role[i],c;
for(j=0;j<s.P;j++)if(s.al[j]&&j!==i)al.push(j);if(!al.length)return null;
if(s.ph==="night"){
if(rl===1&&s.wv[i]<0){c=al.filter(function(x){return s.role[x]!==1});if(!c.length)return null;return{k:"n"+s.rd,m:{w:c[Math.floor(rv("n"+s.rd)*c.length)],u:i},w:rr(3,9)}}
if(rl===2&&s.sv<0){var sn=s.seen.map(function(x){return x[1]});c=al.filter(function(x){return sn.indexOf(x)<0});if(!c.length)c=al;return{k:"s"+s.rd,m:{s:pick(c),u:i},w:rr(3,9)}}
return null}
if(s.vt[i]>=0)return null;
var wv=al.filter(function(x){return s.role[x]===1}),t;
if(rl===1){c=al.filter(function(x){return s.role[x]!==1});if(!c.length)return null;t=c[Math.floor(rv("d"+s.rd)*c.length)]}
else{var fw=rl===2?s.seen.filter(function(x){return x[2]&&s.al[x[1]]}):[];
if(fw.length)t=fw[0][1];else if(wv.length&&Math.random()<[0,.2,.4][d])t=pick(wv);else t=pick(al)}
return{k:"d"+s.rd,m:{v:t,u:i},w:rr(3,10)}},
wbi:function(s,i,d){if(s.out[i])return null;var ci=s.ls.indexOf(s.id[i]),g=ci,c=[],j;
if(Math.random()>=[.25,.5,.75][d]){for(j=0;j<s.ls.length;j++)if(j!==ci&&!s.id.some(function(x,k){return k!==i&&x===s.ls[j]}))c.push(j);if(c.length)g=pick(c)}
var b=[30,20,12][d];return{k:"w"+s.lg.length,m:{g:g,u:i},w:b+Math.random()*b}},
paint:function(s,i,d){if(s.dr===i)return{k:"s"+s.rd,m:{skip:1,u:i},w:rr(3,6)};
var wd=WL[s.wo[Math.min(s.rd,s.P*2-1)]],g=wd;
if(Math.random()>=[.07,.14,.25][d]){do{g=pick(WL)}while(g===wd)}
var b=[14,10,7][d];return{k:"g"+s.rd+":"+moves.length,m:{g:g,u:i},w:b+Math.random()*10}}
};
/* Computer in Spielen für alle, wenn man allein gegen den Computer spielt (kein Online-Raum) */
$("board").addEventListener("click",function(e){
if(net||!botOn||!gid||!G[gid].any)return;
var el=e.target.closest("[data-m]");if(!el)return;e.stopPropagation();
var m=JSON.parse(el.getAttribute("data-m"));
if(m.sel!==undefined){dsel=m.sel;lastH="";render();return}
if(m.col){pcol=m.col;pw=m.w||4;lastH="";render();return}
if(m.clr){strokes=[];pbuf=[];paintInit();return}
if(S.w!==null)return;m.u=0;apply(m,0)},true);
var _sa=sendAny;sendAny=function(m){if(!net){if(botOn&&S&&S.w===null){m.u=0;apply(m,0)}return}return _sa(m)};

/* ---------- Turnier: Spiellänge ---------- */
var _tc=tnClean;tnClean=function(t){var o=_tc(t);if(o)o.len=Math.max(1,Math.min(7,+(t&&t.len)||7));return o};
var _ok=tnOk;tnOk=function(k){return _ok(k)&&lenOk(k,ML())};
tnPick=function(prev){var n=net?players().length:botOn?2:+$("lp").value,len=ML(),
ks=Object.keys(G).filter(function(k){var d=G[k];if(n<d.min||n>d.max||TN_SKIP.indexOf(k)>=0||!lenOk(k,len))return false;if(botOn&&!d.bot)return false;if(!net&&!botOn&&d.online)return false;return true});
var f=ks.filter(function(k){return k!==prev});return f.length?pick(f):ks.length?pick(ks):null};
var _tg=tnGo;tnGo=function(t,fg){if(t&&!t.len)t.len=curLen||tnMask();var p=curLen;curLen=t.len;try{return _tg(t,fg)}finally{curLen=p}};
var _st=startTn;startTn=function(n,m,len){var p=curLen;curLen=len||curLen;try{_st(n,m)}finally{curLen=p}};
var _or=onReq;onReq=function(m){if(m&&m.data&&m.data.k==="tn")reqL[m.peer]=+m.data.l;return _or(m)};
var _dr=doReq;doReq=function(r){if(r&&r.k==="tn"){var p=curLen;curLen=Math.max(1,Math.min(7,+reqL[r.peer]||7));try{return _dr(r)}finally{curLen=p}}return _dr(r)};
$("tnb").onclick=function(){var n=+$("tnr").value,m=+$("tnm").value;
if(net&&!amHost()){sendReq({k:"tn",n:n,m:m,l:tnMask()});return}
startTn(n,m,tnMask())};
})();
