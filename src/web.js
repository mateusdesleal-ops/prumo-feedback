/* ================= Versão web de testes: Supabase + Gemini ================= */
const CFG=window.PRUMO_CONFIG||{};
let SB=null,USER=null;
function sbReady(){return !!(window.supabase&&CFG.SUPABASE_URL&&CFG.SUPABASE_KEY&&!/COLE_AQUI/.test(CFG.SUPABASE_URL+CFG.SUPABASE_KEY))}

/* ---- IA pelo servidor ---- */
async function callFn(name,body,tent=0){const {data,error}=await SB.functions.invoke(name,{body});if(error&&!error.context&&tent<1){try{await SB.auth.refreshSession()}catch(e){}await new Promise(r=>setTimeout(r,800));return callFn(name,body,tent+1)}if(error){let code='erro',msg='Não foi possível falar com o servidor. Confira a internet e tente de novo'+(error.name?' ('+error.name+')':'')+'.';try{const st=error.context&&error.context.status;const j=error.context&&await error.context.json();if(st===429){code='rate_limited';msg=j&&j.error==='limite_diario'?'Limite diário de uso atingido. Tente amanhã.':'Muitas solicitações. Aguarde alguns segundos.'}else if(st===401){code='auth';msg='Sua sessão expirou. Entre de novo.'}else if(j&&j.error==='sobrecarga'){code='sobrecarga';msg='A IA do Google está muito procurada agora. Espere alguns segundos e envie de novo.'}else if(j&&j.error==='limite_fornecedor'){msg='Limite gratuito da IA atingido por agora. Tente em alguns minutos.'}else if(j&&j.error){msg='IA indisponível agora ('+j.error+').'}}catch(e){}throw {code,message:msg}}return data}
function makeSample(){const f=async(input,opts={})=>{const prompt=typeof input==='string'?input:input.map(m=>(m.role==='user'?'':'Assistente: ')+m.content).join('\n\n');const d=await callFn('ai',{prompt,tier:opts.modelTier||'default',task:opts.task||'geral'});const text=d.text||'';if(opts.onText)opts.onText({text,delta:text});return {text,truncated:false}};
 f.json=async(input,opts={})=>{const prompt=typeof input==='string'?input:input.map(m=>m.content).join('\n\n');const d=await callFn('ai',{prompt:prompt+'\nResponda apenas com JSON válido.',tier:opts.modelTier||'default',json:true,task:'json'});const t=d.text||'';const m=t.match(/\{[\s\S]*\}/);return JSON.parse(m?m[0]:t)};return f}

/* ---- dados no Supabase (mesma interface usada pelo app) ---- */
const dbShim={collection(){return{doc(){return{
 async get(){const {data,error}=await SB.from('app_state').select('data').eq('user_id',USER.id).maybeSingle();if(error)throw error;return data&&data.data&&Object.keys(data.data).length?{j:JSON.stringify(data.data)}:null},
 async set(o){const {error}=await SB.from('app_state').upsert({user_id:USER.id,data:JSON.parse(o.j),updated_at:new Date().toISOString()});if(error)throw error}}}}}};

/* ---- reconhecimento de fala do navegador ---- */
function makeDict(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return null;let r=null,cbP=()=>{},cbF=()=>{},cbS=()=>{};
 return{onPartial(f){cbP=f},onFinal(f){cbF=f},onState(f){cbS=f},
  start(){return new Promise((res,rej)=>{try{r=new SR();r.lang='pt-BR';r.interimResults=true;r.continuous=true;
   r.onresult=e=>{let part='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)cbF({text:t.trim()});else part+=t}if(part)cbP({text:part})};
   r.onerror=e=>{cbS({state:'idle',reason:e.error});if(e.error==='not-allowed')rej({code:'not_granted'})};r.onend=()=>cbS({state:'idle',reason:'stopped'});r.onstart=()=>{cbS({state:'listening'});res()};r.start()}catch(e){rej(e)}})},
  stop(){try{r&&r.stop()}catch(e){}return Promise.resolve()}}}

/* ---- login ---- */
let authMode='entrar',authMsg='';
function authView(){const c=sbReady();return `<div class="ob"><div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px"><span style="width:56px;height:70px;color:var(--pri)">${LOGO}</span><div class="brandrow" style="font-size:28px">Prumo <b>Feedback</b></div><p class="mut">Ambiente de testes</p>
 ${!c?`<div class="card"><h3>Falta configurar</h3><p class="sm mut" style="margin-top:6px">Preencha o arquivo config.js com a URL e a chave pública do seu projeto Supabase.</p></div>`:`
 <div class="seg">${[['entrar','Entrar'],['criar','Criar conta']].map(x=>`<button class="${authMode===x[0]?'on':''}" data-a="authMode" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>
 <label class="f">E-mail<input id="au_e" type="email" autocomplete="email"></label>
 <label class="f">Senha<input id="au_p" type="password" autocomplete="${authMode==='criar'?'new-password':'current-password'}" placeholder="${authMode==='criar'?'Mínimo de 6 caracteres':''}"></label>
 <button class="btn full" data-a="authGo">${authMode==='criar'?'Criar conta':'Entrar'}</button>
 ${authMode==='entrar'?`<button class="btn ghost full" data-a="authReset">Esqueci minha senha</button>`:''}
 <p class="sm" id="au_msg" role="status" style="min-height:20px;color:var(--acc)">${esc(authMsg)}</p>`}</div></div>`}
A.authMode=d=>{authMode=d.m;authMsg='';$('#app').innerHTML=authView()};
A.authGo=async(d,b)=>{const e=val('au_e'),p=val('au_p');if(!e||!p)return toast('Informe e-mail e senha.');b.disabled=true;b.innerHTML='<span class="spin"></span>';
 const r=authMode==='criar'?await SB.auth.signUp({email:e,password:p,options:{emailRedirectTo:location.origin+location.pathname}}):await SB.auth.signInWithPassword({email:e,password:p});
 if(r.error){authMsg=r.error.message.includes('Invalid login')?'E-mail ou senha incorretos.':r.error.message;$('#app').innerHTML=authView();return}
 if(authMode==='criar'&&!r.data.session){authMsg='Conta criada! Confirme pelo link enviado ao seu e-mail e depois entre.';authMode='entrar';$('#app').innerHTML=authView();return}};
A.authReset=async()=>{const e=val('au_e');if(!e)return toast('Digite seu e-mail primeiro.');await SB.auth.resetPasswordForEmail(e,{redirectTo:location.origin+location.pathname});authMsg='Se o e-mail existir, enviamos um link para redefinir a senha.';$('#app').innerHTML=authView()};
A.sair=()=>confirmBox('Sair da conta neste aparelho?','Sair',async()=>{await SB.auth.signOut();try{localStorage.removeItem(KEY)}catch(e){}location.reload()});
const _moreV=V.more;V.more=()=>{const r=_moreV();r.h+=`<button class="btn line full" style="margin-top:20px" data-a="sair">Sair da conta${USER&&USER.email?' · '+esc(USER.email):''}</button><p class="xs mut" style="text-align:center;margin-top:10px">Prumo Feedback · versão de testes</p>`;return r};

/* ---- chamada de voz em tempo real (Gemini Live) ---- */
const VOZ_GEMINI={lucas:'Puck',mariana:'Aoede',rafael:'Charon',camila:'Leda',andre:'Fenrir',fernanda:'Kore'};
function livePrompt(C){const p=C.pers,c=C.cen;return `Você está interpretando um personagem FICTÍCIO numa chamada de voz de treino de liderança. Fale sempre em português do Brasil, com sotaque e ritmo naturais de uma conversa telefônica. Nunca saia do papel, nunca diga que é uma IA e nunca avalie o líder durante a conversa.
Personagem: ${p.nome}, ${p.idade} anos, ${p.cargo}. Estilo: ${p.estilo}. ${p.desc}
Cenário: ${c.titulo}. ${c.contexto}
O que você pensa e sente: ${c.papel}
Dificuldade (${C.nivel.nome}): ${C.nivel.prompt}
Regras: respostas curtas (1 a 3 frases), reaja ao que o líder acabou de dizer, mude de postura gradualmente conforme a escuta e a clareza dele. Se ele for desrespeitoso, reaja como uma pessoa real, sem agressividade. Se houver um acordo claro com próximos passos e o líder encerrar, despeça-se.`}
const b64=buf=>{let s='';const u=new Uint8Array(buf);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const WORKLET=`class P extends AudioWorkletProcessor{constructor(){super();this.b=[];this.n=0}process(i){const c=i[0]&&i[0][0];if(c){this.b.push(new Float32Array(c));this.n+=c.length;if(this.n>=2048){const o=new Float32Array(this.n);let k=0;for(const x of this.b){o.set(x,k);k+=x.length}this.port.postMessage(o,[o.buffer]);this.b=[];this.n=0}}return true}}registerProcessor('cap',P)`;
let MIC_PRE=null;
const IOS=/iPhone|iPad|iPod/.test(navigator.userAgent),CRIOS=/CriOS/.test(navigator.userAgent);
async function pedirMic(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return{erro:'Este navegador não oferece acesso ao microfone. Use o modo alternativo ou abra no Safari/Chrome atualizado.'};
 let e1;for(const cons of [{audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}},{audio:true}]){try{return{stream:await navigator.mediaDevices.getUserMedia(cons)}}catch(e){e1=e;if(e.name==='NotAllowedError'||e.name==='SecurityError')break}}
 const n=e1&&e1.name;
 if(n==='NotAllowedError'||n==='SecurityError')return{erro:IOS?`O microfone está bloqueado para este site. No iPhone: abra Ajustes › ${CRIOS?'Chrome':'Safari'} › ative Microfone. Depois recarregue a página e, quando aparecer o pedido, toque em Permitir.`:'O microfone está bloqueado para este site. Clique no cadeado ao lado do endereço, permita o Microfone e recarregue a página.'};
 if(n==='NotFoundError'||n==='OverconstrainedError')return{erro:'Nenhum microfone foi encontrado neste aparelho.'};
 if(n==='NotReadableError'||n==='AbortError')return{erro:'O microfone está sendo usado por outro app (ligação, gravador, outra aba). Feche-o e tente de novo.'};
 return{erro:'Não consegui acessar o microfone ('+(n||'erro')+').'}}
async function liveStart(){
 const c=cenBy(SC.cen),p=persBy(SC.pers);SC.modo='voz';
 if(saldo('voz')<1)return sheet(`<h3>Sem minutos disponíveis</h3><p class="mut" style="margin:8px 0">Seu saldo de voz acabou neste mês.</p><div class="btns"><button class="btn full" data-a="goPlanos">Ver opções</button></div>`);
 const ctxIn=new (window.AudioContext||window.webkitAudioContext)(),ctxOut=new (window.AudioContext||window.webkitAudioContext)({sampleRate:24000});
 ctxIn.resume();ctxOut.resume();
 const max=Math.min(SC.dur*60,saldo('voz')*60);
 CALL={cen:c,pers:p,nivel:NIVEIS.find(n=>n.id===SC.nivel),modo:'voz',max,turns:[],t0:Date.now(),elapsed:0,paused:false,muted:false,cc:true,kb:false,state:'idle',busy:false,timer:null,dict:null,buf:'',silT:null,fimSug:false,charged:false,connecting:true};
 const C=CALL;renderCall();
 const L={muted:false,session:null,stream:null,node:null,sources:[],next:0,gain:ctxOut.createGain(),closed:false,sid:null};L.gain.connect(ctxOut.destination);C.live=L;
 const falhar=msg=>{L.closed=true;try{L.session&&L.session.close()}catch(e){}try{L.stream&&L.stream.getTracks().forEach(t=>t.stop())}catch(e){}ctxIn.close();ctxOut.close();clearInterval(C.timer);CALL=null;const el=$('#call');if(el)el.remove();
  sheet(`<h3>Não foi possível iniciar a chamada em tempo real</h3><p class="mut" style="margin:8px 0">${esc(msg)}</p><div class="btns"><button class="btn line" data-a="closeSheet">Fechar</button><button class="btn" style="flex:1" data-a="simTexto">Usar modo alternativo</button></div>`)};
 if(MIC_PRE){L.stream=MIC_PRE;MIC_PRE=null}else{const r=await pedirMic();if(r.erro)return falhar(r.erro);L.stream=r.stream}
 let tk;try{tk=await callFn('live-token',{scenario:c.id})}catch(e){return falhar(e.message)}
 L.sid=tk.session_id;
 let G;try{G=await import('https://esm.sh/@google/genai')}catch(e){return falhar('Não consegui carregar o módulo de voz. Verifique a conexão.')}
 const stopPlayback=()=>{L.sources.forEach(s=>{try{s.stop()}catch(e){}});L.sources=[];L.next=0;if(CALL===C&&C.state==='speaking')setCallState('idle')};
 const play=data=>{const bin=atob(data),n=bin.length/2,f=new Float32Array(n);for(let i=0;i<n;i++){let v=bin.charCodeAt(2*i)|(bin.charCodeAt(2*i+1)<<8);if(v>=32768)v-=65536;f[i]=v/32768}
  const buf=ctxOut.createBuffer(1,n,24000);buf.copyToChannel(f,0);const s=ctxOut.createBufferSource();s.buffer=buf;s.connect(L.gain);const t=Math.max(ctxOut.currentTime+.03,L.next);s.start(t);L.next=t+buf.duration;L.sources.push(s);
  s.onended=()=>{L.sources=L.sources.filter(x=>x!==s);if(!L.sources.length&&CALL===C&&C.state==='speaking')setCallState('idle')};if(C.state!=='speaking')setCallState('speaking')};
 const addTurn=(w,t)=>{const last=C.turns[C.turns.length-1];if(last&&last.w===w&&!last.done)last.t=(last.t+t).replace(/\s+/g,' ');else C.turns.push({w,t:t.trim(),ts:C.elapsed});const cc=$('#ccap');if(cc){const lt=C.turns[C.turns.length-1];cc.innerHTML=`<b>${w==='u'?'Você':esc(p.nome)}:</b> ${esc(lt.t)}`}};
 const config={responseModalities:[G.Modality?G.Modality.AUDIO:'AUDIO'],systemInstruction:{parts:[{text:livePrompt(C)}]},inputAudioTranscription:{},outputAudioTranscription:{},speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:p.vozG||VOZ_GEMINI[p.id]||(p.g==='f'?'Kore':'Puck')}}}};
 const conectar=cfg=>new G.GoogleGenAI({apiKey:tk.token,httpOptions:{apiVersion:'v1beta'}}).live.connect({model:tk.model,config:cfg,callbacks:{
  onopen:()=>{},onerror:e=>{console.error('live',e)},onclose:e=>{if(!L.closed&&CALL===C){toast('A chamada foi encerrada pela conexão.');endCall('conexao')}},
  onmessage:m=>{if(CALL!==C)return;const sc=m.serverContent;if(!sc)return;
   if(sc.interrupted){stopPlayback();const lp=C.turns[C.turns.length-1];if(lp&&lp.w==='p')lp.done=true}
   if(sc.inputTranscription&&sc.inputTranscription.text){const lp=C.turns[C.turns.length-1];if(lp&&lp.w==='p')lp.done=true;addTurn('u',sc.inputTranscription.text)}
   if(sc.outputTranscription&&sc.outputTranscription.text){const lu=C.turns[C.turns.length-1];if(lu&&lu.w==='u')lu.done=true;addTurn('p',sc.outputTranscription.text)}
   if(sc.modelTurn&&sc.modelTurn.parts)sc.modelTurn.parts.forEach(pt=>{if(pt.inlineData&&pt.inlineData.data&&!C.muted&&!C.paused)play(pt.inlineData.data)});
   if(sc.turnComplete){const lp=C.turns[C.turns.length-1];if(lp)lp.done=true}}}});
 try{L.session=await conectar(config)}catch(e){try{delete config.speechConfig;L.session=await conectar(config)}catch(e2){return falhar('O serviço de voz recusou a conexão. Confira a chave do Gemini e o nome do modelo de voz.')}}
 // microfone → PCM 16 kHz
 try{const url=URL.createObjectURL(new Blob([WORKLET],{type:'application/javascript'}));await ctxIn.audioWorklet.addModule(url);const src=ctxIn.createMediaStreamSource(L.stream);L.node=new AudioWorkletNode(ctxIn,'cap');src.connect(L.node);
  const ratio=ctxIn.sampleRate/16000;L.node.port.onmessage=e=>{if(L.muted||C.paused||L.closed)return;const f=e.data,n=Math.floor(f.length/ratio),o=new Int16Array(n);for(let i=0;i<n;i++){const v=Math.max(-1,Math.min(1,f[Math.floor(i*ratio)]));o[i]=v<0?v*32768:v*32767}try{L.session.sendRealtimeInput({audio:{data:b64(o.buffer),mimeType:'audio/pcm;rate=16000'}})}catch(err){}}}
 catch(e){return falhar('Este navegador não permitiu capturar o áudio do microfone.')}
 L.cleanup=dur=>{L.closed=true;stopPlayback();try{L.session.close()}catch(e){}try{L.stream.getTracks().forEach(t=>t.stop())}catch(e){}try{ctxIn.close();ctxOut.close()}catch(e){}if(L.sid)callFn('live-token',{action:'end',session_id:L.sid,seconds:dur}).catch(()=>{});C.turns=C.turns.filter(t=>t.t&&t.t.trim()).map(t=>({w:t.w,t:t.t.trim(),ts:t.ts}))};
 C.connecting=false;C.t0=Date.now();C.timer=setInterval(tick,500);renderCall();
 try{L.session.sendClientContent({turns:[{role:'user',parts:[{text:'(O líder acabou de entrar na chamada. Cumprimente de forma breve, no seu estilo, e aguarde ele falar.)'}]}],turnComplete:true})}catch(e){}
}
A.simTexto=()=>{closeSheet();_simStartCascata()};
const _simStartCascata=A.simStart;
A.simStart=async()=>{const durs=chipsVal('sc_dur');if(durs[0])SC.dur=parseInt(durs[0]);if(!(navigator.mediaDevices&&window.AudioWorkletNode))return _simStartCascata();
 const r=await pedirMic();/* pede o microfone logo no toque, antes de qualquer outra coisa (exigência do iPhone) */
 if(r.erro)return sheet(`<h3>Microfone não liberado</h3><p class="mut" style="margin:8px 0">${esc(r.erro)}</p><div class="btns"><button class="btn line" data-a="closeSheet">Fechar</button><button class="btn" style="flex:1" data-a="simTexto">Usar modo alternativo</button></div>`);
 MIC_PRE=r.stream;liveStart()};
const _callMic=A.callMic;A.callMic=()=>{if(CALL&&CALL.live){CALL.live.muted=!CALL.live.muted;renderCall();return}_callMic()};
const _callMute=A.callMute;A.callMute=()=>{if(CALL&&CALL.live){CALL.muted=!CALL.muted;CALL.live.gain.gain.value=CALL.muted?0:1;renderCall();return}_callMute()};
const _callPause=A.callPause;A.callPause=()=>{_callPause()};
const _callKb=A.callSendKb;A.callSendKb=()=>{if(CALL&&CALL.live){const k=$('#ckb');if(!k||!k.value.trim())return;const t=k.value.trim();k.value='';CALL.turns.push({w:'u',t,ts:CALL.elapsed,done:true});try{CALL.live.session.sendClientContent({turns:[{role:'user',parts:[{text:t}]}],turnComplete:true})}catch(e){}renderCall();return}_callKb()};

/* ---- inicialização ---- */
async function webBoot(){
 if(!sbReady()){$('#app').innerHTML=authView();return}
 SB=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const go=async session=>{
  if(!session){USER=null;S=null;$('#app').innerHTML=authView();return}
  if(USER&&USER.id===session.user.id)return;USER=session.user;
  CAP.sample=makeSample();CAP.dict=makeDict();CAP.tts=null;CAP.db=dbShim;CAP.uid=USER.id;
  let local=null;try{local=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  if(local&&local.owner&&local.owner!==USER.id)local=null;
  S=local?migrate(local):blank();S.owner=USER.id;aplicarVisaoHash();applyTheme();render();
  try{const d=await dbShim.collection().doc().get();if(d&&d.j){const remote=JSON.parse(d.j);if(!local||(remote.ts||0)>(local.ts||0)){S=migrate(remote);S.owner=USER.id;aplicarVisaoHash();applyTheme()}}else save()}catch(e){toast('Sem conexão com o banco. Seus dados ficam salvos neste aparelho por enquanto.')}
  render()};
 const {data}=await SB.auth.getSession();await go(data.session);
 SB.auth.onAuthStateChange((ev,session)=>{if(ev==='SIGNED_IN'||ev==='SIGNED_OUT')go(session)});
}
try{speechSynthesis.getVoices()}catch(e){}
webBoot();
