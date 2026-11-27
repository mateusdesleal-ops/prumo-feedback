const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nid=()=>Math.random().toString(36).slice(2,10);
const iso=d=>{const x=new Date(d);return new Date(x.getTime()-x.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
const hoje=()=>iso(new Date());
const addD=(n,b)=>{const d=b?new Date(b+'T12:00'):new Date();d.setDate(d.getDate()+n);return iso(d)};
const diasEntre=(a,b)=>Math.round((new Date(b+'T12:00')-new Date(a+'T12:00'))/864e5);
const fd=d=>d?new Date(d+'T12:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).replace('.',''):'';
const fdl=d=>d?new Date(d+'T12:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'}):'';
const val=id=>{const e=document.getElementById(id);return e?(e.type==='checkbox'?e.checked:e.value.trim()):''};
const ini=n=>String(n||'?').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const LOGO='<svg viewBox="0 0 544 684"><use href="#logo"/></svg>';
const IC={home:'<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',team:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c.5-4 3-6 6-6s5.5 2 6 6M15 14c3 0 5 2 6 5"/>',mentor:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',sim:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',back:'<path d="m15 5-7 7 7 7"/>',chev:'<path d="m9 5 7 7-7 7"/>',plus:'<path d="M12 5v14M5 12h14"/>',fb:'<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',pdi:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',star:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/>',goal:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',acad:'<path d="M3 7l9-4 9 4-9 4z"/><path d="M7 9v5c3 2 7 2 10 0V9"/>',lib:'<path d="M5 4h4v16H5zM10 4h4v16h-4zM15 5l4-1 2 15-4 1z"/>',book:'<path d="M6 3h11a2 2 0 0 1 2 2v16H6a2 2 0 0 1 0-4h13"/>',chart:'<path d="M4 4h16v16H4z"/><path d="M8 15v-3M12 15V9M16 15v-5"/>',card:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',spk:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12"/>',mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 4 6M21 9l-4 6"/>',pause:'<path d="M9 5v14M15 5v14"/>',play:'<path d="M7 4l13 8-13 8z"/>',end:'<path d="M3 15c5-5 13-5 18 0l-2 3-4-2v-3a10 10 0 0 0-6 0v3l-4 2z"/>',video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',cc:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 10a2 2 0 1 0 0 4M17 10a2 2 0 1 0 0 4"/>',kb:'<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',send:'<path d="m4 12 16-8-6 16-2-7z"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',check:'<path d="m5 12 5 5 9-10"/>',spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',alert:'<path d="M12 4 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',refresh:'<path d="M20 11a8 8 0 0 0-14-5l-2 2M4 13a8 8 0 0 0 14 5l2-2"/><path d="M4 4v4h4M20 20v-4h-4"/>'};
const ic=(n,s)=>`<svg class="i" viewBox="0 0 24 24"${s?` style="${s}"`:''}>${IC[n]||''}</svg>`;

/* ---------- estado ---------- */
const KEY='prumo-lider-v1';
let S=null,saveT=null,CAP={sample:null,tts:null,dict:null,db:null,uid:null};
const blank=()=>({v:1,perfil:{nome:'',cargo:'',segmento:'',exp:'',equipe:'',desafios:[],comp:[],papeis:['lider'],onb:false},plano:'Pro',uso:{mes:hoje().slice(0,7),voz:0,video:0,extraVoz:0,extraVideo:0,mentor:0},
 lid:[],ev:[],dev:[],persCustom:[],reun:[],pdi:[],metas:[],rec:[],ag:[],dia:[],sims:[],cenCustom:[],acad:{done:{},dias:[]},ferr:[],chat:[],chatRH:[],
 cfg:{tema:'sistema',hora:'08:00',sigilo:true,bio:false,iaCtx:true,notif:{'Reuniões':true,'Feedbacks':true,'Prazos':true,'Conteúdo diário':true,'Revisões semanais':true,'Simulações sugeridas':true,'Franquia e assinatura':true}}});
function seed(){
 const s=blank();s.demo=true;
 const L=(nome,cargo,depto,ing,func,comp,obs)=>({id:nid(),nome,cargo,depto,ingresso:ing,funcao:func,resp:'',obj:'',comp,obs,status:'ativo'});
 s.lid=[L('Ana Souza','Analista de atendimento','Atendimento','2023-03-01','2024-01-10',['Comunicação','Escuta'],'Prefere feedbacks em particular.'),L('Bruno Lima','Analista de dados','Operações','2022-08-15','2022-08-15',['Decisão'],''),L('Carla Mendes','Coordenadora de projetos','Projetos','2021-05-03','2024-06-01',['Delegação','Conflitos'],'Assumiu a coordenação recentemente.'),L('Diego Rocha','Assistente comercial','Comercial','2025-09-01','2025-09-01',['Motivação'],'Em período de integração.')];
 const [a,b,c,d]=s.lid.map(x=>x.id);
 s.ev=[{id:nid(),tipo:'feedback',lid:a,data:addD(-12),titulo:'Reconhecimento: atendimento ao cliente VIP',texto:'Na ligação de quarta com o cliente da conta Alfa, você ouviu toda a reclamação antes de propor a solução. O cliente elogiou o atendimento por e-mail.',status:'realizado',metodo:'SCI'},
  {id:nid(),tipo:'feedback',lid:b,data:addD(-3),titulo:'Atrasos nas reuniões de equipe',texto:'Rascunho: abordar os atrasos nas reuniões das últimas duas semanas.',status:'rascunho',metodo:'SCI'},
  {id:nid(),tipo:'ocorrencia',lid:b,data:addD(-5),titulo:'Chegou 20 minutos atrasado na reunião semanal',texto:'Terceiro atraso no mês.',status:'registrado'},
  {id:nid(),tipo:'compromisso',lid:c,data:addD(-9),prazo:addD(-2),titulo:'Enviar cronograma revisado do projeto Atlas',texto:'',status:'pendente'},
  {id:nid(),tipo:'compromisso',lid:null,data:addD(-1),prazo:addD(2),titulo:'Dar retorno à Ana sobre o curso de negociação',texto:'',status:'pendente'}];
 s.reun=[{id:nid(),lid:a,modelo:'Mensal',data:addD(-20),hora:'10:00',recorr:'Mensal',pauta:'Metas do mês\nCurso de negociação',notas:{assuntos:'Metas e desenvolvimento',percepcoes:'Sente-se pronta para atender contas maiores',dificuldades:'Sistema lento no horário de pico',positivos:'NPS acima da meta',decisoes:'Pesquisar curso de negociação'},ata:'',status:'concluida'},
  {id:nid(),lid:c,modelo:'Semanal',data:addD(-45),hora:'14:00',recorr:'Semanal',pauta:'',notas:{},ata:'',status:'concluida'},
  {id:nid(),lid:d,modelo:'Integração',data:addD(1),hora:'09:30',recorr:'',pauta:'Plano dos primeiros 30 dias\nDúvidas sobre o processo comercial',notas:{},ata:'',status:'agendada'}];
 s.pdi=[{id:nid(),lid:c,comp:'Delegação',obj:'Delegar a gestão de dois fornecedores com autonomia definida',just:'Assumiu a coordenação e concentra decisões',result:'Equipe resolve 80% das demandas de fornecedores sem escalar',indic:'% de demandas resolvidas sem escalar',inicio:addD(-30),prazo:addD(60),metodo:'70-20-10',acoes:[{id:nid(),t:'Ler capítulo sobre delegação na Academy',resp:'Carla',prazo:addD(-10),ok:true},{id:nid(),t:'Definir matriz de delegação com a equipe',resp:'Carla',prazo:addD(5),ok:false},{id:nid(),t:'Praticar conversa de delegação no Simula',resp:'Carla',prazo:addD(12),ok:false}],evid:'',obs:'',status:'em andamento'},
  {id:nid(),lid:null,comp:'Feedback',obj:'Realizar feedbacks quinzenais com todos os liderados usando SCI',just:'Autodesenvolvimento como líder',result:'Todos os liderados com feedback a cada 15 dias',indic:'Feedbacks realizados por mês',inicio:addD(-15),prazo:addD(75),metodo:'SMART',acoes:[{id:nid(),t:'Concluir trilha Feedback que transforma',resp:'Eu',prazo:addD(10),ok:false},{id:nid(),t:'Fazer 3 simulações de feedback difícil',resp:'Eu',prazo:addD(20),ok:false}],evid:'',obs:'',status:'em andamento'}];
 s.metas=[{id:nid(),titulo:'NPS da equipe de atendimento',desc:'Manter a satisfação dos clientes',escopo:'Equipe',resp:'Equipe',indic:'NPS',esperado:'75',atual:'71',prazo:addD(35),prio:'Alta',status:'em andamento'},{id:nid(),titulo:'Reuniões 1:1 em dia',desc:'Uma 1:1 por mês com cada liderado',escopo:'Pessoal',resp:'Eu',indic:'1:1s no mês',esperado:'4',atual:'1',prazo:addD(20),prio:'Média',status:'em andamento'}];
 s.rec=[{id:nid(),lid:a,cat:'Atendimento',texto:'Atendimento exemplar ao cliente da conta Alfa',msg:'Ana, obrigada pela forma como conduziu o atendimento da conta Alfa: você ouviu, entendeu e resolveu. O cliente fez questão de elogiar. É esse cuidado que diferencia nossa equipe.',data:addD(-12)}];
 s.ag=[{id:nid(),titulo:'Treinamento de liderança situacional',tipo:'Treinamento',data:addD(3),hora:'15:00',recorr:'',ok:false}];
 s.sims=[{id:nid(),cen:'atrasos',pers:'lucas',nivel:'intermediario',modo:'voz',dur:243,data:addD(-6),nota:68,crit:{clareza:11,escuta:9,assertividade:10,empatia:10,estrutura:10,solucoes:11,encerramento:7},turns:[],rel:null},{id:nid(),cen:'resist-fb',pers:'rafael',nivel:'avancado',modo:'voz',dur:312,data:addD(-2),nota:74,crit:{clareza:12,escuta:10,assertividade:11,empatia:11,estrutura:11,solucoes:12,encerramento:7},turns:[],rel:null}];
 s.dev=[{id:nid(),cand:'Paula R.',tipo:'externo',vaga:'Analista de Atendimento Pleno',etapa:'Estudo de caso',gestor:'',prazo:addD(-1),crit:[{n:'Comunicação com clientes',req:'3 · Proficiente',obs:'2 · Em desenvolvimento',inst:'Estudo de caso',ev:'No estudo de caso, propôs a solução antes de confirmar o problema do cliente e não resumiu o combinado ao final.',res:'Não atendeu'},{n:'Domínio de processos de atendimento',req:'3 · Proficiente',obs:'4 · Avançado',inst:'Prova técnica',ev:'Acertou todas as questões sobre fluxos de atendimento e SLA.',res:'Atendeu'}],fortes:'Domínio técnico dos processos de atendimento.',recs:'Praticar escuta ativa e confirmação de entendimento.',dest:['candidato'],canal:'Videochamada',tom:'Objetivo',texto:'',textoG:'',status:'pendente',data:addD(-6),realizada:'',excluirEm:addD(174)},{id:nid(),cand:'Marcos T.',tipo:'interno',vaga:'Coordenador de Operações',etapa:'Painel final',gestor:'Carla Mendes',prazo:addD(3),crit:[{n:'Gestão de pessoas',req:'3 · Proficiente',obs:'2 · Em desenvolvimento',inst:'Entrevista por competências (STAR)',ev:'Não apresentou exemplo de feedback corretivo conduzido por ele; os dois exemplos citados foram conduzidos pelo gestor.',res:'Não atendeu'}],fortes:'Resultados operacionais consistentes nos últimos 3 trimestres.',recs:'Assumir a condução de 1:1s com dois analistas por 3 meses.',dest:['candidato','gestor'],canal:'Conversa presencial',tom:'Acolhedor',texto:'',textoG:'',status:'pendente',data:addD(-2),realizada:'',excluirEm:addD(178)}];
 s.uso.voz=9;
 s.acad.done={'fund-0':addD(-4),'fb-0':addD(-2)};s.acad.dias=[addD(-2),addD(-1)];
 return s;
}
function migrate(s){const b=blank();for(const k in b)if(s[k]===undefined)s[k]=b[k];if(s.uso.mes!==hoje().slice(0,7))s.uso={mes:hoje().slice(0,7),voz:0,video:0,extraVoz:s.uso.extraVoz||0,extraVideo:s.uso.extraVideo||0,mentor:0};return s}
function save(){clearTimeout(saveT);saveT=setTimeout(async()=>{S.ts=Date.now();const j=JSON.stringify(S);try{localStorage.setItem(KEY,j)}catch(e){}if(CAP.db&&CAP.uid){try{await CAP.db.collection('data/users/'+CAP.uid).doc('app').set({j})}catch(e){}}},500)}
const planoReal=()=>PLANOS.find(p=>p.id===S.plano)||PLANOS[0];
const plano=()=>{const p=planoReal();return ACESSO_LIVRE?{...p,lid:9999,voz:9999,mentor:null}:p};
const nomePlano=()=>ACESSO_LIVRE?'Acesso de teste':S.plano;
const saldo=k=>k==='voz'?plano().voz+S.uso.extraVoz-S.uso.voz:plano().video+S.uso.extraVideo-S.uso.video;
const lidN=id=>(S.lid.find(l=>l.id===id)||{}).nome||'';
const ativos=()=>S.lid.filter(l=>l.status==='ativo');

/* ---------- interface ---------- */
let stack=[{v:'home',p:{}}],curTab='home';
const tabsAtuais=()=>{const p=S&&S.perfil&&S.perfil.papeis||['lider'];return p.length===1&&p[0]==='rh'?TABS.map(t=>t[0]==='team'?['devs','Devolutivas','user']:t[0]==='mentor'?['mentor','Mentor RH','mentor']:t):TABS};
const TABS=[['home','Início','home'],['team','Equipe','team'],['mentor','Mentor IA','mentor'],['simula','Simulador','sim'],['more','Mais','more']];
const V={},A={};
function go(v,p={}){stack.push({v,p});render();scrollTo(0,0)}
function back(){if(stack.length>1)stack.pop();render()}
function tab(v){curTab=v;stack=[{v,p:{}}];render();scrollTo(0,0)}
function toast(t){document.querySelectorAll('.toast').forEach(x=>x.remove());const e=document.createElement('div');e.className='toast';e.setAttribute('role','status');e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}
function sheet(html){closeSheet();const d=document.createElement('div');d.className='sheet';d.id='sheet';d.innerHTML=`<div role="dialog" aria-modal="true">${html}</div>`;d.addEventListener('click',e=>{if(e.target===d)closeSheet()});document.body.appendChild(d)}
function closeSheet(){const s=$('#sheet');if(s)s.remove()}
function confirmBox(txt,ok,cb){sheet(`<h3>${esc(txt)}</h3><div class="btns"><button class="btn line" data-a="closeSheet">Cancelar</button><button class="btn danger" id="cfok">${esc(ok)}</button></div>`);$('#cfok').onclick=()=>{closeSheet();cb()}}
async function copy(t){try{await navigator.clipboard.writeText(t);toast('Copiado')}catch(e){sheet(`<h3>Copiar texto</h3><p class="sm mut" style="margin:6px 0 10px">Selecione e copie manualmente:</p><textarea style="min-height:220px">${esc(t)}</textarea><div class="btns"><button class="btn full" data-a="closeSheet">Fechar</button></div>`)}}
function applyTheme(){const r=document.documentElement;if(S&&S.cfg.tema!=='sistema')r.dataset.theme=S.cfg.tema==='escuro'?'dark':'light';else delete r.dataset.theme}
function render(){
 const app=$('#app');
 if(!S){app.innerHTML='<div class="empty" style="padding-top:40vh"><span class="spin"></span></div>';return}
 if(!S.perfil.onb){app.className='';app.innerHTML=V.onb();return}
 const top=stack[stack.length-1],fn=V[top.v]||V.home,r=fn(top.p)||{};
 app.className='shell';const curV=top.v;
 app.innerHTML=`${sidebar(curV)}<header class="top">${stack.length>1?`<button class="ib" data-a="back" aria-label="Voltar">${ic('back')}</button>`:''}${stack.length>1?`<h1>${esc(r.t||'Prumo Feedback')}</h1>`:`<div class="hdtit"><span class="hdbrand" aria-label="Prumo Feedback"><span class="wm" aria-hidden="true">${LOGO}</span><span aria-hidden="true">rumo <b>Feedback</b></span></span><h1>${esc(r.t||'Início')}</h1></div>`}${AJUDA[top.v]?`<button class="ib" data-a="ajuda" data-v="${top.v}" aria-label="Como funciona esta tela">${ic('help')}</button>`:''}${r.act||''}</header><main>${r.h||''}</main><nav class="tabs" aria-label="Navegação principal">${tabsAtuais().map(t=>`<button class="${curTab===t[0]?'on':''} ${t[0]==='simula'?'sim':''}" data-a="tab" data-v="${t[0]}" aria-label="${t[1]}">${ic(t[2])}<span>${t[1]}</span></button>`).join('')}</nav>`;
 if(r.after)r.after();
 enhance(top.v);
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const f=A[t.dataset.a];if(f){e.preventDefault();f(t.dataset,t,e)}});
A.back=()=>back();A.tab=d=>tab(d.v);A.go=d=>go(d.v,{...d});A.closeSheet=()=>closeSheet();
A.chip=(d,t)=>{if(t.dataset.single){t.parentElement.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'))}t.classList.toggle('on')};
const chipsVal=id=>[...document.querySelectorAll('#'+id+' .chip.on')].map(c=>c.dataset.val);
const chips=(id,opts,sel=[],single)=>`<div class="chips" id="${id}">${opts.map(o=>`<button type="button" class="chip ${sel.includes(o)?'on':''}" data-a="chip" data-val="${esc(o)}" ${single?'data-single="1"':''}>${esc(o)}</button>`).join('')}</div>`;
const sel=(id,opts,v)=>`<select id="${id}">${opts.map(o=>{const [k,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(k)}" ${String(k)===String(v)?'selected':''}>${esc(l)}</option>`}).join('')}</select>`;
const lidSel=(id,v,extra)=>sel(id,[...(extra||[]),...ativos().map(l=>[l.id,l.nome])],v);
const empty=(icn,t,btn)=>`<div class="empty">${ic(icn)}<p>${esc(t)}</p>${btn||''}</div>`;
const avCor=n=>{let h=0;for(const c of String(n||''))h=(h*31+c.charCodeAt(0))>>>0;return 'c'+(h%6)};
const avatar=(n,sz=40)=>`<span class="av ${avCor(n)}" style="width:${sz}px;height:${sz}px;font-size:${sz*.38}px">${esc(ini(n))}</span>`;
const sw=(id,on,lab,sub)=>`<label class="row" style="cursor:pointer"><span class="grow"><b style="font-weight:600">${esc(lab)}</b>${sub?`<br><span class="xs mut">${esc(sub)}</span>`:''}</span><span class="switch"><input type="checkbox" id="${id}" ${on?'checked':''}><span></span></span></label>`;

/* ---------- IA ---------- */
const ETICA='Você é a inteligência do app Prumo Feedback, voltado a gestores brasileiros. Regras: escreva em português do Brasil; não invente fatos além dos fornecidos; trate hipóteses como hipóteses; foque em comportamentos observáveis; não diagnostique pessoas, não infira personalidade, emoções reais ou condições de saúde; não recomende demissões, promoções ou punições automáticas; não incentive assédio ou constrangimento; lembre que decisões de RH e jurídicas são humanas. Formato: texto simples, sem markdown com asteriscos ou #; use títulos curtos em linhas próprias terminados em dois-pontos e listas com "- ".';
const noAI='A IA não está disponível nesta visualização. No app publicado, abra pelo navegador Chrome ou pelo app desktop do Claude e autorize o uso.';
async function ai(prompt,opts={}){if(!CAP.sample)throw{code:'none',message:noAI};const r=await CAP.sample(prompt,{cache:false,modelTier:opts.tier||'default',onText:opts.onText,signal:opts.signal});return r.text}
async function aiJSON(prompt,tier){if(!CAP.sample)throw{code:'none',message:noAI};
 try{if(CAP.sample.json)return await CAP.sample.json(prompt,{modelTier:tier||'default'})}catch(e){if(e&&e.code==='not_granted')throw e}
 const t=(await CAP.sample(prompt+'\nResponda apenas com JSON válido, sem texto antes ou depois.',{modelTier:tier||'default',cache:false})).text;const m=t.match(/\{[\s\S]*\}/);return JSON.parse(m?m[0]:t)}
function aiErr(e){const m=e&&e.code==='rate_limited'?'Muitas solicitações seguidas. Aguarde alguns segundos e tente de novo.':e&&e.code==='not_granted'?'O uso de IA não foi autorizado nesta página.':(e&&e.message)||'Não foi possível gerar agora. Tente novamente.';return m}
async function streamInto(el,prompt,opts={}){el.innerHTML='<span class="spin"></span> <span class="mut sm">Gerando…</span>';try{const t=await ai(prompt,{...opts,onText:({text})=>{el.textContent=text}});el.textContent=t;return t}catch(e){el.innerHTML=`<span class="mut">${esc(aiErr(e))}</span>`;return null}}

/* ---------- voz ---------- */
const VOZ={busy:false};
function ptVoice(g){try{const vs=speechSynthesis.getVoices().filter(v=>/pt[-_]BR/i.test(v.lang));if(!vs.length)return null;const fem=/luciana|francisca|maria|female|feminina|vitoria|thalita|helena/i,m=vs.filter(v=>g==='f'?fem.test(v.name):!fem.test(v.name));return (m[0]||vs[0])}catch(e){return null}}
function canSpeak(){return !!(CAP.tts||('speechSynthesis' in window))}
function speakText(text,pers,onState){
 if(CAP.tts){const o={language:'pt-BR',pers,onState};if(pers){o.voice=pers.voz;o.rate=pers.rate}return CAP.tts.speak(text,o).catch(()=>{})}
 return new Promise(res=>{try{const u=new SpeechSynthesisUtterance(text);u.lang='pt-BR';const v=ptVoice(pers?pers.g:'f');if(v)u.voice=v;if(pers){u.pitch=pers.pitch;u.rate=pers.rate}u.onstart=()=>onState&&onState('speaking');u.onend=u.onerror=()=>{onState&&onState('idle');res()};speechSynthesis.speak(u)}catch(e){res()}})}
function stopSpeak(){try{CAP.tts&&CAP.tts.stop()}catch(e){}try{speechSynthesis.cancel()}catch(e){}}

/* ---------- onboarding ---------- */
let ob={step:0};
V.onb=()=>{const s=ob.step,P=S.perfil;const dots=`<div class="steps">${[0,1,2,3,4,5].map(i=>`<i class="${i<=s?'on':''}"></i>`).join('')}</div>`;
 const skip=s>0&&s<5?`<button class="btn line sm" data-a="obNext" data-skip="1">Pular</button>`:'';
 let h='';
 if(s===0)h=`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px"><span style="width:64px;height:80px;color:var(--pri)">${LOGO}</span><div class="brandrow" style="font-size:30px">Prumo <b>Feedback</b></div><p class="mut" style="font-size:18px">Prepare, pratique e conduza conversas que desenvolvem pessoas.</p><p>Prepare feedbacks e devolutivas técnicas, treine por voz com personagens realistas e organize sua rotina. Funciona no computador e no celular.</p></div>
  <div class="list"><button class="btn full" data-a="obNext">Começar</button><p class="xs mut" style="text-align:center">Leva menos de 1 minuto. Você pode mudar tudo depois em Meu perfil.</p></div>`;
 if(s===1)h=`<h2>Como podemos te chamar?</h2><p class="mut" style="margin-bottom:18px">Usamos isso para personalizar sua experiência.</p><label class="f">Seu nome<input id="o_nome" value="${esc(P.nome)}" autocomplete="given-name"></label><label class="f">Cargo${sel('o_cargo',['','Supervisor(a)','Coordenador(a)','Gerente','Diretor(a)','Empresário(a)','RH','Recrutamento e Seleção','Psicólogo(a) organizacional','Consultor(a)','Futuro(a) líder'],P.cargo)}</label><p style="font-size:14px;font-weight:500;margin:4px 0 6px">Como você vai usar o Prumo?</p>${chips('o_pap',['Sou líder de equipe','Sou de RH/Recrutamento'],(P.papeis||['lider']).map(x=>x==='rh'?'Sou de RH/Recrutamento':'Sou líder de equipe'))}<p class="xs mut" style="margin:6px 0 12px">Pode marcar os dois. O perfil RH libera o módulo de Devolutivas.</p><label class="f">Segmento${sel('o_seg',['','Indústria','Varejo','Serviços','Tecnologia','Saúde','Educação','Setor público','Agronegócio','Financeiro','Outro'],P.segmento)}</label>`;
 if(s===2)h=`<h2>Sua experiência</h2><p class="mut" style="margin-bottom:18px">${soRH()?'Usamos isso para ajustar exemplos e cenários.':'Você pode usar o app mesmo sem equipe.'}</p>${soRH()?`<label class="f">Experiência em recrutamento e seleção${sel('o_exp',['','Menos de 1 ano','1 a 3 anos','3 a 10 anos','Mais de 10 anos'],P.exp)}</label><label class="f">Processos seletivos por mês${sel('o_eq',['','Até 2','3 a 5','6 a 15','Mais de 15'],P.equipe)}</label>`:`<label class="f">Tempo como líder${sel('o_exp',['','Ainda não lidero','Menos de 1 ano','1 a 3 anos','3 a 10 anos','Mais de 10 anos'],P.exp)}</label><label class="f">Tamanho da equipe${sel('o_eq',['','Sem equipe','1 a 5','6 a 15','16 a 50','Mais de 50'],P.equipe)}</label>`}`;
 if(s===3)h=`<h2>Quais são seus maiores desafios hoje?</h2><p class="mut" style="margin-bottom:18px">Escolha quantos quiser.</p>${chips('o_des',(S.perfil.papeis||[]).includes('rh')&&!(S.perfil.papeis||[]).includes('lider')?DESAFIOS_RH:(S.perfil.papeis||[]).includes('rh')?[...DESAFIOS,...DESAFIOS_RH]:DESAFIOS,P.desafios)}`;
 if(s===4)h=`<h2>Que competências quer desenvolver?</h2><p class="mut" style="margin-bottom:18px">Vamos priorizar conteúdos e simulações para elas.</p>${chips('o_comp',(S.perfil.papeis||[]).includes('rh')&&!(S.perfil.papeis||[]).includes('lider')?COMPET_RH:(S.perfil.papeis||[]).includes('rh')?[...COMPET,...COMPET_RH]:COMPET,P.comp)}`;
 if(s===5)h=`<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px"><h2>Tudo pronto${P.nome?', '+esc(P.nome.split(' ')[0]):''}!</h2><p class="mut">Quer explorar com uma equipe de exemplo ou começar do zero?</p><div class="card"><h3>Dados de exemplo</h3><p class="sm mut" style="margin-top:4px">4 liderados fictícios com feedbacks, reuniões, PDIs e simulações para você conhecer tudo.</p></div></div><div class="list"><button class="btn gold full" data-a="obFim" data-demo="1">Explorar com exemplo</button><button class="btn line full" data-a="obFim">Começar do zero</button></div>`;
 return `<div class="ob">${dots}<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">${s>0?`<button class="ib" data-a="obBack" aria-label="Voltar">${ic('back')}</button>`:'<span></span>'}${skip}</div>${s>0&&s<5?`<div style="flex:1">${h}</div><button class="btn full" data-a="obNext" style="margin-top:18px">Continuar</button>`:h}</div>`};
A.obBack=()=>{ob.step=Math.max(0,ob.step-1);render()};
A.obNext=d=>{const P=S.perfil;if(!d.skip){if(ob.step===1){P.nome=val('o_nome');P.cargo=val('o_cargo');P.segmento=val('o_seg');const pp=chipsVal('o_pap');P.papeis=pp.length?pp.map(x=>x.startsWith('Sou de RH')?'rh':'lider'):['lider']}if(ob.step===2){P.exp=val('o_exp');P.equipe=val('o_eq')}if(ob.step===3)P.desafios=chipsVal('o_des');if(ob.step===4)P.comp=chipsVal('o_comp')}ob.step++;render()};
A.obFim=d=>{const P=S.perfil;if(d.demo){const n=seed();n.perfil={...P,onb:true};n.cfg=S.cfg;S=n}else{P.onb=true}save();tab('home')};

/* ---------- início ---------- */
function agendaItems(){
 const it=[];
 S.reun.forEach(r=>it.push({id:r.id,k:'reun',data:r.data,hora:r.hora,t:`1:1 ${r.modelo.toLowerCase()} com ${lidN(r.lid)||'liderado'}`,ok:r.status==='concluida',tipo:'Reunião'}));
 S.pdi.forEach(p=>p.acoes.forEach(a=>a.prazo&&it.push({id:p.id,k:'pdi',data:a.prazo,t:'PDI: '+a.t,ok:a.ok,tipo:'PDI'})));
 S.metas.forEach(m=>m.prazo&&it.push({id:m.id,k:'meta',data:m.prazo,t:'Prazo da meta: '+m.titulo,ok:m.status==='concluída',tipo:'Meta'}));
 S.ag.forEach(a=>it.push({id:a.id,k:'ag',data:a.data,hora:a.hora,t:a.titulo,ok:a.ok,tipo:a.tipo}));
 S.ev.filter(e=>e.tipo==='compromisso').forEach(e=>it.push({id:e.id,k:'ev',data:e.prazo||e.data,t:e.titulo+(e.lid?' · '+lidN(e.lid):''),ok:e.status==='concluido',tipo:'Compromisso'}));
 (temRH()?S.dev||[]:[]).forEach(d=>d.prazo&&it.push({id:d.id,k:'dev',data:d.prazo,t:'Devolutiva: '+d.cand+' · '+d.vaga,ok:d.status==='realizada',tipo:'Devolutiva'}));
 S.ev.filter(e=>e.tipo==='feedback'&&e.acomp).forEach(e=>it.push({id:e.id,k:'fbac',data:e.acomp,t:'Acompanhar feedback: '+(lidN(e.lid)||'anônimo'),ok:!!e.acompOk,tipo:'Feedback'}));
 const it2=soRH()?it.filter(i=>i.k==='dev'||i.k==='ag'||(i.k==='ev'&&!S.ev.find(e=>e.id===i.id&&e.lid))):it;
 return it2.sort((a,b)=>(a.data+(a.hora||'')).localeCompare(b.data+(b.hora||'')));
}
function recomendacoes(){
 const r=[],t=hoje();
 ativos().forEach(l=>{const rs=S.reun.filter(x=>x.lid===l.id&&x.status==='concluida').sort((a,b)=>b.data.localeCompare(a.data));const ag=S.reun.some(x=>x.lid===l.id&&x.status==='agendada');if(ag)return;const dd=rs[0]?diasEntre(rs[0].data,t):null;if(dd===null||dd>30)r.push({t:dd===null?`Você ainda não registrou uma 1:1 com ${l.nome}.`:`Sua última 1:1 com ${l.nome} foi há ${dd} dias.`,a:'go',v:'reunEdit',p:{lid:l.id},b:'Agendar 1:1'})});
 S.pdi.forEach(p=>p.acoes.filter(a=>!a.ok&&a.prazo&&diasEntre(t,a.prazo)>=0&&diasEntre(t,a.prazo)<=7).forEach(a=>r.push({t:`Ação de PDI vence ${diasEntre(t,a.prazo)===0?'hoje':'em '+diasEntre(t,a.prazo)+' dias'}: ${a.t}`,a:'go',v:'pdiVer',p:{id:p.id},b:'Abrir PDI'})));
 const atr=agendaItems().filter(i=>!i.ok&&i.data<t);if(atr.length)r.push({t:`Você tem ${atr.length} compromisso${atr.length>1?'s':''} atrasado${atr.length>1?'s':''}.`,a:'go',v:'agenda',p:{f:'atrasados'},b:'Ver agenda'});
 const rasc=S.ev.filter(e=>e.tipo==='feedback'&&e.status==='rascunho');if(rasc.length)r.push({t:`Há ${rasc.length} feedback${rasc.length>1?'s':''} em rascunho esperando para ser realizado.`,a:'go',v:'feedbacks',p:{},b:'Ver feedbacks'});
 const ult=S.sims.map(s=>s.data).sort().pop();if(!ult||diasEntre(ult,t)>7)r.push({t:'Faz mais de uma semana que você não pratica no Simula.',a:'tab',v:'simula',b:'Praticar agora'});
 const dva=(temRH()?S.dev||[]:[]).filter(d=>d.status!=='realizada'&&d.prazo&&d.prazo<t);if(dva.length)r.unshift({t:`${dva.length} devolutiva${dva.length>1?'s':''} de candidato${dva.length>1?'s':''} com prazo vencido.`,a:'go',v:'devs',b:'Ver devolutivas'});
 return r.slice(0,5);
}
V.home=()=>{
 const P=S.perfil,t=hoje(),hr=new Date().getHours(),sau=hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite';
 const ag=agendaItems(),atr=ag.filter(i=>!i.ok&&i.data<t).length,sims=S.sims.length,ns=S.sims.slice(-3).map(s=>s.nota).filter(Boolean),evo=ns.length?Math.round(ns.reduce((a,b)=>a+b,0)/ns.length):'–';
 const K=[[ativos().length,'Liderados ativos','team'],[S.ev.filter(e=>e.tipo==='feedback'&&e.status==='realizado').length,'Feedbacks realizados','feedbacks'],[S.reun.filter(r=>r.status==='agendada').length,'Reuniões pendentes','reunioes'],[S.pdi.filter(p=>!['concluído','cancelado'].includes(p.status)).length,'PDIs ativos','pdis'],[S.metas.filter(m=>m.status!=='concluída').length,'Metas ativas','metas'],[atr,'Atrasados','agenda'],[sims,'Simulações','simHist'],[evo,'Evolução média','simHist']];
 const QA=[...((S.perfil.papeis||[]).includes('rh')?[['user','Devolutiva','devNovo']]:[]),['fb','Feedback','fbNovo'],['sim','Simulação','simula'],['mentor','Mentor','mentor'],['mic','Registro por voz','voz'],['cal','Reunião','reunEdit'],['pdi','PDI','pdiEdit'],['star','Reconhecer','recEdit'],['plus','Novo liderado','lidEdit']];
 const prox=ag.filter(i=>!i.ok&&i.data>=t).slice(0,3),rec=recomendacoes(),ref=REFLEX[new Date().getDate()%REFLEX.length];
 return {t:'Início',act:`<button class="ib" data-a="go" data-v="notifs" aria-label="Notificações">${ic('bell')}</button>`,h:`
 ${S.demo?`<div class="note" style="margin:0 0 12px">Você está usando dados de exemplo. <button class="btn sm line" style="margin-left:6px;min-height:30px" data-a="limparDemo">Começar do zero</button></div>`:''}
 <section class="hello"><span class="lg">${LOGO}</span><p class="mut sm">${esc(fdl(t))}</p><h2 style="margin-top:4px">${sau}${P.nome?', '+esc(P.nome.split(' ')[0]):''}</h2><p class="mut sm">${esc(P.cargo||'Líder')} · Plano ${esc(nomePlano())}</p><q>${esc(ref)}</q></section>
 <div class="sec"><h3>Seus indicadores</h3></div>
 <div class="kpis">${K.map(k=>`<button class="kpi" data-a="${k[2]==='team'?'tab':'go'}" data-v="${k[2]}"><b>${esc(k[0])}</b><span>${k[1]}</span></button>`).join('')}</div>
 <div class="sec"><h3>Ações rápidas</h3></div>
 <div class="qa">${QA.map(q=>`<button data-a="${['simula','mentor'].includes(q[2])?'tab':'go'}" data-v="${q[2]}"><span class="c">${ic(q[0])}</span>${q[1]}</button>`).join('')}</div>
 <div style="margin-top:18px"><button class="simcta" data-a="tab" data-v="simula"><span style="width:52px;height:52px;border-radius:16px;background:#C4A46B;display:grid;place-items:center;color:#123D3B;flex:none">${ic('sim')}</span><span style="flex:1"><b>Prumo Simula</b><br><span class="mut sm">Pratique uma conversa difícil por voz ou vídeo antes de ela acontecer.</span></span>${ic('chev')}</button></div>
 ${(S.perfil.papeis||[]).includes('rh')?(()=>{const p=(S.dev||[]).filter(d=>d.status!=='realizada');return `<div class="sec"><h3>Recrutamento</h3></div><button class="row" data-a="go" data-v="devs"><span style="color:var(--pri)">${ic('user')}</span><span class="grow"><b style="font-weight:600">Devolutivas</b><br><span class="sm mut">${p.length} pendente${p.length===1?'':'s'}${p.filter(d=>d.prazo&&d.prazo<t).length?' · '+p.filter(d=>d.prazo&&d.prazo<t).length+' atrasada(s)':''}</span></span>${ic('chev')}</button>`})():''}
 <div class="sec"><h3>Recomendações para você</h3></div>
 ${rec.length?`<div class="card">${rec.map((r,i)=>`<div class="rec" style="${i?'margin-top:14px;padding-top:14px;border-top:1px solid var(--line)':''}"><span class="dot"></span><div class="grow" style="flex:1"><p>${esc(r.t)}</p><button class="btn sm ghost" style="margin-top:8px" data-a="${r.a}" data-v="${r.v}" ${Object.entries(r.p||{}).map(([k,v])=>`data-${k}="${esc(v)}"`).join(' ')}>${esc(r.b)}</button></div></div>`).join('')}<p class="xs mut" style="margin-top:12px">Baseadas apenas nos seus registros.</p></div>`:`<div class="card"><p class="mut">Nenhuma pendência agora. Ótimo momento para estudar na Academy.</p></div>`}
 <div class="sec"><h3>Próximos compromissos</h3><button class="btn sm ghost" data-a="go" data-v="agenda">Agenda</button></div>
 ${prox.length?`<div class="list">${prox.map(i=>`<div class="row"><span class="tag">${esc(fd(i.data))}${i.hora?' '+esc(i.hora):''}</span><span class="grow sm">${esc(i.t)}</span></div>`).join('')}</div>`:`<div class="card mut">Nada agendado. Que tal marcar uma 1:1?</div>`}
 <div class="sec"><h3>5 minutos de liderança</h3></div>
 ${(()=>{const cm=cincoMin(),c=cm[new Date().getDay()%cm.length];const feito=S.acad.dias.includes(t);return `<div class="card"><span class="tag ${feito?'o':''}">${feito?'Feito hoje':'Desafio de hoje'}</span><h3 style="margin-top:8px">${esc(c[0])}</h3><p class="mut" style="margin-top:4px">${esc(c[1])}</p>${feito?'':`<button class="btn sm" style="margin-top:12px" data-a="cincoOk">Marcar como feito</button>`}</div>`})()}
 `}};
A.cincoOk=()=>{const t=hoje();if(!S.acad.dias.includes(t))S.acad.dias.push(t);save();toast('Ótimo! Sequência atualizada.');render()};
A.limparDemo=()=>confirmBox('Apagar os dados de exemplo e começar do zero?','Apagar',()=>{const p=S.perfil,c=S.cfg;S=blank();S.perfil=p;S.cfg=c;save();tab('home')});
V.notifs=()=>{const t=hoje(),it=agendaItems().filter(i=>!i.ok&&diasEntre(t,i.data)<=2);return {t:'Notificações',h:it.length?`<div class="list">${it.map(i=>`<div class="row">${ic(i.data<t?'alert':'bell',i.data<t?'color:var(--bad)':'')}<span class="grow"><span class="sm">${esc(i.t)}</span><br><span class="xs mut">${i.data<t?'Atrasado desde ':''}${esc(fd(i.data))}</span></span></div>`).join('')}</div><p class="note">Na tela bloqueada, as notificações mostram apenas "Você tem um lembrete do Prumo", preservando o sigilo.</p>`:empty('bell','Nenhuma notificação por enquanto.')}};

/* ---------- equipe ---------- */
let teamQ='',teamF='ativo';
V.team=()=>{const lim=plano().lid;const L=S.lid.filter(l=>(teamF==='todos'||l.status===teamF)&&(!teamQ||(l.nome+' '+l.cargo+' '+l.depto).toLowerCase().includes(teamQ.toLowerCase())));
 return {t:'Minha equipe',act:`<button class="ib" data-a="go" data-v="lidEdit" aria-label="Novo liderado">${ic('plus')}</button>`,h:`
 <label class="f" style="position:relative"><span class="sr" style="position:absolute;left:-9999px">Buscar</span><input id="tq" placeholder="Buscar por nome, cargo ou área" value="${esc(teamQ)}"></label>
 <div class="seg">${[['ativo','Ativos'],['inativo','Inativos'],['todos','Todos']].map(f=>`<button class="${teamF===f[0]?'on':''}" data-a="teamF" data-f="${f[0]}">${f[1]}</button>`).join('')}</div>
 ${L.length?`<div class="list">${L.map(l=>{const ev=S.ev.filter(e=>e.lid===l.id).length+S.reun.filter(r=>r.lid===l.id).length;return `<button class="row" data-a="go" data-v="lid" data-id="${l.id}">${avatar(l.nome,44)}<span class="grow"><b style="font-weight:600">${esc(l.nome)}</b><br><span class="sm mut">${esc(l.cargo||'Sem cargo')}${l.depto?' · '+esc(l.depto):''}</span></span><span class="xs mut">${ev} registros</span>${ic('chev')}</button>`}).join('')}</div>`:empty('team',S.lid.length?'Nenhum liderado encontrado.':'Você ainda não cadastrou liderados. Tudo bem: o app funciona sem equipe.',`<button class="btn" style="margin-top:12px" data-a="go" data-v="lidEdit">Cadastrar liderado</button>`)}
 <p class="xs mut" style="margin-top:14px">${ativos().length} de ${lim>=999?'∞':lim} liderados ativos${ACESSO_LIVRE?' (acesso de teste, sem limite)':' no plano '+esc(S.plano)}. Sem rankings ou perfis psicológicos: só registros profissionais.</p>`,
 after(){const q=$('#tq');q.oninput=()=>{teamQ=q.value;const p=q.selectionStart;render();const n=$('#tq');n.focus();n.setSelectionRange(p,p)}}}};
A.teamF=d=>{teamF=d.f;render()};
V.lidEdit=p=>{const l=S.lid.find(x=>x.id===p.id)||{status:'ativo',comp:[]};return {t:p.id?'Editar liderado':'Novo liderado',h:`
 <label class="f">Nome ou identificação abreviada *<input id="l_nome" value="${esc(l.nome)}"></label>
 <label class="f">Cargo<input id="l_cargo" value="${esc(l.cargo)}"></label>
 <label class="f">Departamento<input id="l_depto" value="${esc(l.depto)}"></label>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label class="f">Ingresso<input type="date" id="l_ing" value="${esc(l.ingresso)}"></label><label class="f">Início na função<input type="date" id="l_fun" value="${esc(l.funcao)}"></label></div>
 <label class="f">Responsabilidades<textarea id="l_resp">${esc(l.resp)}</textarea></label>
 <label class="f">Objetivos<textarea id="l_obj">${esc(l.obj)}</textarea></label>
 <p style="font-size:14px;font-weight:500;margin-bottom:6px">Competências em foco</p>${chips('l_comp',COMPET,l.comp||[])}
 <label class="f" style="margin-top:12px">Observações profissionais autorizadas<textarea id="l_obs" placeholder="Apenas informações profissionais necessárias.">${esc(l.obs)}</textarea></label>
 <label class="f">Status${sel('l_st',[['ativo','Ativo'],['inativo','Inativo']],l.status)}</label>
 <p class="note">Foto opcional disponível no app nativo. Evite dados sensíveis (saúde, religião, vida pessoal), conforme a LGPD.</p>
 <div class="btns"><button class="btn full" data-a="lidSave" data-id="${p.id||''}">Salvar</button>${p.id?`<button class="btn danger full" data-a="lidDel" data-id="${p.id}">Excluir liderado e registros</button>`:''}</div>`}};
A.lidSave=d=>{const nome=val('l_nome');if(!nome)return toast('Informe o nome ou uma identificação.');const st=val('l_st');
 if(!d.id&&st==='ativo'&&ativos().length>=plano().lid)return sheet(`<h3>Limite do plano ${esc(S.plano)}</h3><p class="mut" style="margin:8px 0">Seu plano permite ${plano().lid} liderados ativos.</p><div class="btns"><button class="btn full" data-a="goPlanos">Ver planos</button></div>`);
 const o={nome,cargo:val('l_cargo'),depto:val('l_depto'),ingresso:val('l_ing'),funcao:val('l_fun'),resp:val('l_resp'),obj:val('l_obj'),comp:chipsVal('l_comp'),obs:val('l_obs'),status:st};
 if(d.id)Object.assign(S.lid.find(x=>x.id===d.id),o);else S.lid.push({id:nid(),...o});save();toast('Liderado salvo');back()};
A.lidDel=d=>confirmBox('Excluir este liderado e todos os registros ligados a ele?','Excluir',()=>{const id=d.id;S.lid=S.lid.filter(x=>x.id!==id);['ev','reun','rec'].forEach(k=>S[k]=S[k].filter(x=>x.lid!==id));S.pdi=S.pdi.filter(x=>x.lid!==id);save();stack=[{v:'team',p:{}}];render()});
function timeline(lid){const it=[];
 S.ev.filter(e=>e.lid===lid).forEach(e=>it.push({d:e.data,cat:e.tipo,t:e.titulo,s:e.texto,st:e.status,v:e.tipo==='feedback'?'fbVer':'evVer',id:e.id}));
 S.reun.filter(r=>r.lid===lid).forEach(r=>it.push({d:r.data,cat:'reuniao',t:'1:1 '+r.modelo,s:r.notas&&r.notas.decisoes?'Decisões: '+r.notas.decisoes:r.pauta,st:r.status,v:'reunVer',id:r.id}));
 S.rec.filter(r=>r.lid===lid).forEach(r=>it.push({d:r.data,cat:'reconhecimento',t:r.texto,s:r.cat,v:'recVer',id:r.id}));
 S.pdi.filter(p=>p.lid===lid).forEach(p=>it.push({d:p.inicio,cat:'pdi',t:'PDI: '+p.comp,s:p.obj,st:p.status,v:'pdiVer',id:p.id}));
 return it.sort((a,b)=>b.d.localeCompare(a.d))}
const CATN={feedback:'Feedback',reuniao:'Reunião',reconhecimento:'Reconhecimento',pdi:'PDI',ocorrencia:'Ocorrência',compromisso:'Compromisso',observacao:'Observação',plano:'Plano de ação'};
let lidTab='tl',lidCat='todas',lidPer='todos';
V.lid=p=>{const l=S.lid.find(x=>x.id===p.id);if(!l)return {t:'Liderado',h:empty('user','Liderado não encontrado.')};
 let tl=timeline(l.id);if(lidCat!=='todas')tl=tl.filter(i=>i.cat===lidCat);if(lidPer!=='todos')tl=tl.filter(i=>diasEntre(i.d,hoje())<=+lidPer);
 const prox=agendaItems().filter(i=>!i.ok&&i.t.includes(l.nome)&&i.data>=hoje()).slice(0,3);
 return {t:l.nome,act:`<button class="ib" data-a="go" data-v="lidEdit" data-id="${l.id}" aria-label="Editar">${ic('edit')}</button>`,h:`
 <div style="display:flex;gap:14px;align-items:center">${avatar(l.nome,64)}<div><h2>${esc(l.nome)}</h2><p class="mut sm">${esc(l.cargo)}${l.depto?' · '+esc(l.depto):''}</p><span class="tag ${l.status==='ativo'?'o':''}">${l.status==='ativo'?'Ativo':'Inativo'}</span></div></div>
 <div class="qa" style="margin-top:16px">${[['fb','Feedback','fbNovo'],['cal','1:1','reunEdit'],['star','Reconhecer','recEdit'],['pdi','PDI','pdiEdit']].map(q=>`<button data-a="go" data-v="${q[2]}" data-lid="${l.id}"><span class="c">${ic(q[0])}</span>${q[1]}</button>`).join('')}</div>
 ${prox.length?`<div class="sec"><h3>Próximos acompanhamentos</h3></div><div class="list">${prox.map(i=>`<div class="row"><span class="tag">${esc(fd(i.data))}</span><span class="sm grow">${esc(i.t)}</span></div>`).join('')}</div>`:''}
 <div class="seg" style="margin-top:18px">${[['tl','Linha do tempo'],['dados','Dados']].map(x=>`<button class="${lidTab===x[0]?'on':''}" data-a="lidTab" data-t="${x[0]}">${x[1]}</button>`).join('')}</div>
 ${lidTab==='tl'?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">${sel('lcat',[['todas','Todas as categorias'],...Object.entries(CATN)],lidCat)}${sel('lper',[['todos','Todo o período'],['30','30 dias'],['90','90 dias'],['365','12 meses']],lidPer)}</div>
  ${tl.length?`<div class="tl">${tl.map(i=>`<div class="it"><button class="row" data-a="go" data-v="${i.v}" data-id="${i.id}" style="align-items:flex-start"><span class="grow"><span class="tag">${esc(CATN[i.cat]||i.cat)}</span> <span class="xs mut">${esc(fd(i.d))}${i.st?' · '+esc(i.st):''}</span><br><b style="font-weight:600;font-size:15px">${esc(i.t)}</b>${i.s?`<br><span class="sm mut">${esc(String(i.s).slice(0,110))}</span>`:''}</span></button></div>`).join('')}</div>`:empty('book','Nenhum registro neste filtro.')}`:
 `<div class="card">${[['Ingresso',fd(l.ingresso)],['Início na função',fd(l.funcao)],['Responsabilidades',l.resp],['Objetivos',l.obj],['Competências',(l.comp||[]).join(', ')],['Observações',l.obs]].map(r=>`<p class="xs mut" style="margin-top:10px">${r[0]}</p><p>${esc(r[1]||'–')}</p>`).join('')}</div>`}`,
 after(){const a=$('#lcat'),b=$('#lper');if(a)a.onchange=()=>{lidCat=a.value;render()};if(b)b.onchange=()=>{lidPer=b.value;render()}}}};
A.lidTab=d=>{lidTab=d.t;render()};
V.evVer=p=>{const e=S.ev.find(x=>x.id===p.id);if(!e)return {t:'Registro',h:empty('book','Registro não encontrado.')};return {t:CATN[e.tipo]||'Registro',h:`<span class="tag">${esc(CATN[e.tipo])}</span> <span class="xs mut">${esc(fd(e.data))}</span><h2 style="margin-top:8px">${esc(e.titulo)}</h2><p class="mut sm">${esc(lidN(e.lid)||'Sem liderado')}${e.prazo?' · prazo '+esc(fd(e.prazo)):''}</p><div class="card out" style="margin-top:12px">${esc(e.texto||'Sem detalhes.')}</div>
 <div class="btns">${e.tipo==='compromisso'&&e.status!=='concluido'?`<button class="btn" data-a="evOk" data-id="${e.id}">Marcar como concluído</button>`:''}<button class="btn danger" data-a="evDel" data-id="${e.id}">Excluir</button></div>`}};
A.evOk=d=>{const e=S.ev.find(x=>x.id===d.id);e.status='concluido';save();toast('Concluído');render()};
A.evDel=d=>confirmBox('Excluir este registro?','Excluir',()=>{S.ev=S.ev.filter(x=>x.id!==d.id);save();back()});
