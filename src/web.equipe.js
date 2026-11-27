/* ================= Equipes no Prumo (só no site) =================
   - Líderes: o gestor acima na cadeia vê, comenta e edita o Prumo de quem está abaixo dele.
   - RH: as devolutivas de todos ficam visíveis para a equipe, com comentários (casos da equipe).
   - Entrada por link de convite. As regras de acesso estão no banco (RLS). */
const EQ={ok:false,carregando:null,orgs:[],membros:[]};let ALVO=null,MEU=null,BASE_TS=0,PEND_CODE=null,CASOS=[],CASOS_OK=false;
const meuNome=()=>(MEU||S||{}).perfil?.nome||(USER&&USER.email?USER.email.split('@')[0]:'Eu');
const TIPO_ORG={lider:'Liderança',rh:'RH',misto:'Liderança e RH'};
async function eqCarregar(forcar){if(EQ.carregando&&!forcar)return EQ.carregando;
 EQ.carregando=(async()=>{try{const {data:me}=await SB.from('org_members').select('org_id').eq('user_id',USER.id);const ids=(me||[]).map(x=>x.org_id);
  if(!ids.length){EQ.orgs=[];EQ.membros=[];EQ.ok=true;return}
  const [{data:os},{data:ms}]=await Promise.all([SB.from('orgs').select('*').in('id',ids),SB.from('org_members').select('*').in('org_id',ids)]);
  EQ.orgs=os||[];EQ.membros=ms||[];EQ.ok=true;
  const nm=meuNome();for(const m of EQ.membros.filter(x=>x.user_id===USER.id&&x.nome!==nm&&nm))SB.rpc('definir_membro',{p_org:m.org_id,p_user:USER.id,p_papel:m.papel,p_gestor:m.gestor_id,p_nome:nm,p_cargo:(MEU||S).perfil.cargo||''}).then(()=>{m.nome=nm})}
 catch(e){EQ.ok=true}})();return EQ.carregando}
const membrosDe=o=>EQ.membros.filter(m=>m.org_id===o);
const euEm=o=>EQ.membros.find(m=>m.org_id===o&&m.user_id===USER.id);
const nomeMembro=(uid)=>{const m=EQ.membros.find(x=>x.user_id===uid);return m?(m.nome||m.email||'Colega'):'Colega'};
function abaixoDeMim(){const out=[],vis=new Set([USER.id]);let fila=[USER.id],nivel=0;
 while(fila.length&&nivel<8){const prox=[];for(const g of fila)for(const m of EQ.membros.filter(x=>x.gestor_id===g&&!vis.has(x.user_id))){vis.add(m.user_id);out.push({...m,direto:nivel===0,via:g});prox.push(m.user_id)}fila=prox;nivel++}return out}
const orgsRH=()=>EQ.orgs.filter(o=>o.tipo!=='lider'||membrosDe(o.id).some(m=>m.papel==='rh'&&m.user_id===USER.id));
const orgEmComum=uid=>{const mine=new Set(EQ.membros.filter(m=>m.user_id===USER.id).map(m=>m.org_id));const m=EQ.membros.find(x=>x.user_id===uid&&mine.has(x.org_id));return m?m.org_id:(EQ.orgs[0]||{}).id};
const carregando=t=>`<div class="card" style="text-align:center;margin-top:12px"><span class="spin"></span><p class="mut sm" style="margin-top:8px">${esc(t||'Carregando…')}</p></div>`;
const precisa=f=>{if(!EQ.ok){eqCarregar().then(()=>render());return true}return false};

/* ---------- tela: equipes e convites ---------- */
V.equipes=p=>{if(precisa())return {t:'Equipes no Prumo',h:carregando()};
 const criar=`<div class="card" style="margin-top:12px"><h3>Criar uma equipe</h3><p class="sm mut" style="margin-top:4px">Você vira o dono e convida as pessoas por link.</p><label class="f" style="margin-top:10px">Nome da equipe<input id="eq_nome" placeholder="Ex.: Operações Sul, Time de R&S"></label><p class="sm" style="font-weight:500;margin-bottom:6px">Tipo</p>${chips('eq_tipo',['Liderança','RH','Liderança e RH'],[soRH()?'RH':temRH()?'Liderança e RH':'Liderança'],1)}<button class="btn full" style="margin-top:12px" data-a="eqCriar">Criar equipe</button></div>`;
 const entrar=`<div class="card" style="margin-top:12px"><h3>Entrar com um código</h3><p class="sm mut" style="margin-top:4px">Recebeu um link ou código de convite? Cole aqui.</p><div style="display:flex;gap:8px;margin-top:10px"><input id="eq_code" placeholder="Código do convite" value="${esc(PEND_CODE||'')}" style="flex:1"><button class="btn" data-a="eqEntrarCode">Entrar</button></div></div>`;
 const cards=EQ.orgs.map(o=>{const eu=euEm(o.id),dono=eu&&eu.role==='dono',ms=membrosDe(o.id).sort((a,b)=>(a.role==='dono'?-1:0)-(b.role==='dono'?-1:0)||a.nome.localeCompare(b.nome));
  return `<div class="card" style="margin-top:12px"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div><h3>${esc(o.nome)}</h3><p class="sm mut">${TIPO_ORG[o.tipo]} · ${ms.length} ${ms.length===1?'pessoa':'pessoas'}${dono?' · você é o dono':''}</p></div>${dono?`<button class="btn sm" data-a="eqConvite" data-o="${o.id}">${ic('plus')} Convidar</button>`:''}</div>
  <div class="list" style="margin-top:10px">${ms.map(m=>{const g=m.gestor_id?nomeMembro(m.gestor_id):'';return `<div class="row" style="cursor:default">${avatar(m.nome||m.email||'?',36)}<span class="grow"><b style="font-weight:600">${esc(m.nome||m.email||'Sem nome')}${m.user_id===USER.id?' (você)':''}</b><br><span class="xs mut">${m.papel==='rh'?'RH':'Líder'}${g?' · gestor(a): '+esc(g):''}${m.role==='dono'?' · dono':''}</span></span>${dono||m.user_id===USER.id?`<button class="ib" data-a="eqMembro" data-o="${o.id}" data-u="${m.user_id}" aria-label="Ajustar">${ic('edit')}</button>`:''}</div>`}).join('')}</div>
  <p class="xs mut" style="margin-top:8px">${o.tipo==='rh'?'Todas as devolutivas da equipe ficam visíveis para todos, com comentários.':'Quem está acima na cadeia de gestores pode ver, comentar e editar o Prumo de quem está abaixo.'}</p>
  <div class="btns">${dono?'':`<button class="btn sm line" data-a="eqSair" data-o="${o.id}">Sair da equipe</button>`}</div></div>`}).join('');
 return {t:'Equipes no Prumo',h:`${EQ.orgs.length?'':`<div class="card mp"><b>Trabalhe junto com a sua equipe</b><p class="sm mut" style="margin-top:4px">Líderes: o seu gestor acompanha, comenta e ajusta o que você faz com a equipe. RH: todos veem as devolutivas e aprendem com os casos dos colegas.</p></div>`}${cards}${entrar}${criar}`}};
A.eqCriar=async()=>{const nome=val('eq_nome'),t=chipsVal('eq_tipo')[0]||'Liderança',tipo=t==='RH'?'rh':t==='Liderança'?'lider':'misto';if(nome.length<2)return toast('Dê um nome para a equipe.');
 const {data:o,error}=await SB.from('orgs').insert({nome,tipo,created_by:USER.id}).select().single();if(error)return toast('Não consegui criar a equipe.');
 const {error:e2}=await SB.from('org_members').insert({org_id:o.id,user_id:USER.id,nome:meuNome(),email:USER.email,cargo:(MEU||S).perfil.cargo||'',papel:tipo==='rh'||soRH()?'rh':'lider',role:'dono'});if(e2)return toast('Equipe criada, mas não consegui incluir você. Tente de novo.');
 await eqCarregar(true);casosSync();toast('Equipe criada. Agora convide as pessoas.');render();A.eqConvite({o:o.id})};
A.eqConvite=async d=>{const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),b=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b%32]).join('');
 const {error}=await SB.from('org_invites').insert({code,org_id:d.o,created_by:USER.id});if(error)return toast('Não consegui gerar o convite.');
 const link=location.origin+location.pathname+'#entrar='+code,o=EQ.orgs.find(x=>x.id===d.o)||{};
 sheet(`<h3>Convite para ${esc(o.nome||'a equipe')}</h3><p class="sm mut" style="margin:6px 0 10px">Envie o link para quem vai entrar. Cada pessoa cria a própria conta e entra na equipe. Vale por 30 dias.</p><div class="card" style="word-break:break-all"><b>${esc(code)}</b><p class="xs mut" style="margin-top:4px">${esc(link)}</p></div><div class="btns"><button class="btn line" data-a="eqCopiar" data-t="${esc(link)}">${ic('copy')} Copiar link</button><button class="btn" style="flex:1" data-a="eqCompartilhar" data-t="${esc(link)}" data-n="${esc(o.nome||'')}">Enviar convite</button></div><p class="xs mut" style="margin-top:8px">Depois que a pessoa entrar, ajuste quem é o gestor dela tocando no lápis ao lado do nome.</p>`)};
A.eqCopiar=d=>copy(d.t);
A.eqCompartilhar=async d=>{const txt=`Entre na equipe ${d.n} no Prumo Feedback: ${d.t}`;if(navigator.share){try{await navigator.share({title:'Convite Prumo Feedback',text:txt});return}catch(e){if(e&&e.name==='AbortError')return}}copy(txt)};
A.eqMembro=d=>{const m=EQ.membros.find(x=>x.org_id===d.o&&x.user_id===d.u);if(!m)return;const outros=membrosDe(d.o).filter(x=>x.user_id!==d.u);
 sheet(`<h3>${esc(m.nome||m.email)}</h3><label class="f" style="margin-top:10px">Papel<select id="em_papel"><option value="lider" ${m.papel==='lider'?'selected':''}>Líder</option><option value="rh" ${m.papel==='rh'?'selected':''}>RH</option></select></label>
 <label class="f">Gestor(a) direto(a) no Prumo<select id="em_gest"><option value="">Ninguém (topo da equipe)</option>${outros.map(x=>`<option value="${x.user_id}" ${m.gestor_id===x.user_id?'selected':''}>${esc(x.nome||x.email)}</option>`).join('')}</select></label>
 <p class="xs mut">O gestor e quem estiver acima dele podem ver, comentar e editar o Prumo desta pessoa.</p>
 <div class="btns"><button class="btn" style="flex:1" data-a="eqMembroOk" data-o="${d.o}" data-u="${d.u}">Salvar</button>${euEm(d.o)?.role==='dono'&&d.u!==USER.id?`<button class="btn danger" data-a="eqRemover" data-o="${d.o}" data-u="${d.u}">Remover</button>`:''}</div>`)};
A.eqMembroOk=async d=>{const g=val('em_gest')||null;if(g){/* evita ciclo: o novo gestor não pode estar abaixo da pessoa */let x=g,n=0;while(x&&n<10){if(x===d.u)return toast('Isso criaria um ciclo na hierarquia.');x=(EQ.membros.find(m=>m.org_id===d.o&&m.user_id===x)||{}).gestor_id;n++}}
 const m=EQ.membros.find(x=>x.org_id===d.o&&x.user_id===d.u);const {error}=await SB.rpc('definir_membro',{p_org:d.o,p_user:d.u,p_papel:val('em_papel'),p_gestor:g,p_nome:m.nome,p_cargo:m.cargo});
 if(error)return toast('Não consegui salvar.');closeSheet();await eqCarregar(true);render();toast('Atualizado')};
A.eqRemover=d=>confirmBox('Remover esta pessoa da equipe?','Remover',async()=>{await SB.from('org_members').delete().eq('org_id',d.o).eq('user_id',d.u);closeSheet();await eqCarregar(true);render()});
A.eqSair=d=>confirmBox('Sair desta equipe? Seu gestor deixa de acompanhar o seu Prumo por ela.','Sair',async()=>{await SB.from('org_members').delete().eq('org_id',d.o).eq('user_id',USER.id);await eqCarregar(true);render()});
async function eqEntrar(code){code=String(code||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(!code)return toast('Digite o código.');
 const {data:info}=await SB.rpc('info_convite',{p_code:code});const o=info&&info[0];if(!o){PEND_CODE=null;return toast('Convite inválido ou vencido.')}
 sheet(`<h3>Entrar em ${esc(o.nome)}</h3><p class="sm mut" style="margin:6px 0 10px">${TIPO_ORG[o.tipo]}. ${o.tipo==='rh'?'Você verá as devolutivas da equipe e a equipe verá as suas.':'Quem estiver acima de você na equipe poderá ver, comentar e editar o seu Prumo.'}</p><label class="f">Seu papel nesta equipe<select id="ej_papel"><option value="lider" ${o.tipo!=='rh'&&!soRH()?'selected':''}>Líder</option><option value="rh" ${o.tipo==='rh'||soRH()?'selected':''}>RH</option></select></label><div class="btns"><button class="btn line" data-a="closeSheet">Agora não</button><button class="btn" style="flex:1" data-a="eqEntrarOk" data-c="${code}">Entrar na equipe</button></div>`)}
A.eqEntrarCode=()=>eqEntrar(val('eq_code'));
A.eqEntrarOk=async d=>{const {error}=await SB.rpc('entrar_equipe',{p_code:d.c,p_nome:meuNome(),p_email:USER.email,p_papel:val('ej_papel')});if(error)return toast('Não consegui entrar: convite inválido ou vencido.');
 PEND_CODE=null;closeSheet();await eqCarregar(true);if(location.hash.startsWith('#entrar='))history.replaceState(null,'',location.pathname);toast('Você entrou na equipe. O dono vai indicar quem é o seu gestor.');casosSync();go('equipes')};

/* ---------- tela: acompanhar quem está abaixo de mim ---------- */
V.acompanhar=()=>{if(precisa())return {t:'Acompanhar equipe',h:carregando()};const L=abaixoDeMim();
 return {t:'Acompanhar equipe',h:L.length?`<p class="sm mut" style="margin-bottom:10px">Você pode ver, comentar e editar o Prumo de quem está abaixo de você.</p><div class="list">${L.map(m=>`<button class="row" data-a="abrirAlvo" data-u="${m.user_id}">${avatar(m.nome||'?',40)}<span class="grow"><b style="font-weight:600">${esc(m.nome||m.email)}</b><br><span class="xs mut">${m.papel==='rh'?'RH':'Líder'} · ${m.direto?'responde a você':'via '+esc(nomeMembro(m.via))}</span></span>${ic('chev')}</button>`).join('')}</div>`
  :empty('team','Ninguém está abaixo de você ainda.',`<button class="btn" style="margin-top:12px" data-a="go" data-v="equipes">Ver equipes</button>`)}};
A.abrirAlvo=async d=>{const {data,error}=await SB.from('app_state').select('data').eq('user_id',d.u).maybeSingle();
 if(error||!data||!data.data||!Object.keys(data.data).length)return toast(`${nomeMembro(d.u)} ainda não começou a usar o Prumo.`);
 if(!ALVO)MEU=S;ALVO={uid:d.u,nome:nomeMembro(d.u),base:data.data.ts||0};S=migrate(data.data);document.body.classList.add('modo-alvo');barraAlvo();stack.length=0;tab('home')};
function barraAlvo(){document.getElementById('alvoBar')?.remove();if(!ALVO)return;const b=document.createElement('div');b.id='alvoBar';b.innerHTML=`<span>${ic('team')} Prumo de <b>${esc(ALVO.nome)}</b><small> · ver, comentar e editar</small></span><button data-a="sairAlvo">Voltar ao meu</button>`;document.body.appendChild(b);document.body.style.setProperty('--ab',b.offsetHeight+'px')}
A.sairAlvo=()=>{if(!ALVO)return;clearTimeout(saveT);S=MEU;MEU=null;ALVO=null;document.body.classList.remove('modo-alvo');barraAlvo();stack.length=0;tab('home')};

/* salvar: no modo acompanhamento grava no Prumo da outra pessoa, sem sobrescrever o que ela acabou de mudar */
{const _save=save;save=function(){if(!ALVO)return _save();clearTimeout(saveT);const alvo=ALVO;saveT=setTimeout(async()=>{
 const {data:r}=await SB.from('app_state').select('ts:data->ts').eq('user_id',alvo.uid).maybeSingle();
 if(r&&+r.ts>alvo.base){const {data:full}=await SB.from('app_state').select('data').eq('user_id',alvo.uid).maybeSingle();if(full&&ALVO===alvo){S=migrate(full.data);alvo.base=full.data.ts||0;render()}return toast(`${alvo.nome} alterou o Prumo agora há pouco. Recarreguei para não apagar nada: refaça a sua última alteração.`)}
 S.ts=Date.now();S.editadoPor={uid:USER.id,nome:meuNome(),ts:S.ts};const {error}=await SB.from('app_state').update({data:S,updated_at:new Date().toISOString()}).eq('user_id',alvo.uid);
 if(error)toast('Não consegui salvar no Prumo de '+alvo.nome);else alvo.base=S.ts},600)}}
/* salvar o meu: se o gestor editou enquanto isso, recarrega antes de gravar */
{const _set=dbShim.collection().doc().set;const doc=dbShim.collection().doc();
 dbShim.collection=()=>({doc:()=>({get:doc.get,async set(o){const {data:r}=await SB.from('app_state').select('ts:data->ts,ed:data->editadoPor').eq('user_id',USER.id).maybeSingle();
  if(r&&+r.ts>BASE_TS&&r.ed&&r.ed.uid!==USER.id&&BASE_TS){await recarregarMeu(true);return}
  await _set(o);try{BASE_TS=JSON.parse(o.j).ts||Date.now()}catch(e){}casosSync()}})})}
async function recarregarMeu(conflito){if(ALVO)return;const {data}=await SB.from('app_state').select('data').eq('user_id',USER.id).maybeSingle();if(!data||!data.data)return;
 S=migrate(data.data);S.owner=USER.id;BASE_TS=S.ts||0;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
 const ed=S.editadoPor;if(ed&&ed.uid!==USER.id&&ed.ts>(S.vistoEdicao||0)){S.vistoEdicao=ed.ts;toast(`${ed.nome} fez ajustes no seu Prumo.${conflito?' Sua última alteração não foi salva: refaça, por favor.':''}`)}render()}
/* atualiza o meu Prumo quando o gestor muda algo (aba visível, sem campo em edição) */
setInterval(async()=>{if(!USER||ALVO||document.hidden||!S)return;const a=document.activeElement;if(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName))return;
 const {data:r}=await SB.from('app_state').select('ts:data->ts,ed:data->editadoPor').eq('user_id',USER.id).maybeSingle();if(r&&+r.ts>(S.ts||0)&&r.ed&&r.ed.uid!==USER.id)recarregarMeu()},40000);

/* ---------- comentários ---------- */
const cmBox=(tipo,id)=>EQ.orgs.length?`<div class="sec"><h3>Comentários da equipe</h3></div><div class="cmbox card" data-t="${tipo}" data-i="${esc(id)}" data-o="${ALVO?ALVO.uid:USER.id}"><p class="sm mut">Carregando…</p></div>`:'';
async function cmCarregar(){for(const el of document.querySelectorAll('.cmbox:not([data-ok])')){el.dataset.ok='1';const {t,i,o}=el.dataset;
 const {data}=await SB.from('comments').select('*').eq('owner_id',o).eq('item_tipo',t).eq('item_id',i).order('created_at');
 el.innerHTML=`${(data||[]).map(c=>`<div style="display:flex;gap:10px;margin-bottom:10px">${avatar(c.autor_nome||'?',30)}<div class="grow"><p class="sm"><b>${esc(c.autor_nome||'Colega')}</b> <span class="xs mut">${esc(new Date(c.created_at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))}</span>${c.autor_id===USER.id?` <button class="btn sm ghost" style="padding:0 6px;min-height:0" data-a="cmDel" data-id="${c.id}">excluir</button>`:''}</p><p class="sm" style="margin-top:2px;white-space:pre-wrap">${esc(c.texto)}</p></div></div>`).join('')||'<p class="sm mut" style="margin-bottom:10px">Nenhum comentário ainda.</p>'}
 <textarea id="cm_${t}_${i}" placeholder="Escreva uma orientação ou pergunta para a equipe" style="min-height:70px"></textarea><button class="btn sm" style="margin-top:8px" data-a="cmEnviar" data-t="${t}" data-i="${esc(i)}" data-o="${o}">Comentar</button>`}}
A.cmEnviar=async d=>{const ta=document.getElementById(`cm_${d.t}_${d.i}`),txt=ta?ta.value.trim():'';if(!txt)return;const org=orgEmComum(d.o);if(!org)return toast('Entre em uma equipe para comentar.');
 const {error}=await SB.from('comments').insert({org_id:org,owner_id:d.o,item_tipo:d.t,item_id:d.i,autor_id:USER.id,autor_nome:meuNome(),texto:txt.slice(0,2000)});if(error)return toast('Não consegui publicar o comentário.');
 document.querySelectorAll(`.cmbox[data-t="${d.t}"][data-i="${d.i}"]`).forEach(e=>e.removeAttribute('data-ok'));cmCarregar()};
A.cmDel=async d=>{await SB.from('comments').delete().eq('id',d.id);document.querySelectorAll('.cmbox').forEach(e=>e.removeAttribute('data-ok'));cmCarregar()};
[['fbVer','fb'],['reunVer','reun'],['pdiVer','pdi'],['lid','lid'],['devVer','dev']].forEach(([v,t])=>{const o=V[v];if(!o)return;V[v]=p=>{const r=o(p);if(p&&p.id)r.h+=cmBox(t,p.id);return r}});
{const _r=render;render=function(){_r();if(USER&&EQ.orgs.length)setTimeout(cmCarregar,0);if(ALVO&&!document.getElementById('alvoBar'))barraAlvo()}}
/* novos comentários no meu Prumo */
let CM_NOVOS=[];async function cmNovos(){if(!USER||ALVO||!EQ.orgs.length)return;const desde=new Date((MEU||S).cmVisto||0).toISOString();
 const {data}=await SB.from('comments').select('*').eq('owner_id',USER.id).neq('autor_id',USER.id).gt('created_at',desde).order('created_at',{ascending:false}).limit(30);CM_NOVOS=data||[];if(stack.length===1&&curTab==='home')render()}
const ITEM_V={fb:'fbVer',reun:'reunVer',pdi:'pdiVer',lid:'lid',dev:'devVer'},ITEM_N={fb:'Feedback',reun:'Reunião 1:1',pdi:'PDI',lid:'Liderado',dev:'Devolutiva'};
V.comentarios=()=>{const L=CM_NOVOS;setTimeout(()=>{if(S&&!ALVO){S.cmVisto=Date.now();save();CM_NOVOS=[]}},300);
 return {t:'Comentários',h:L.length?`<div class="list">${L.map(c=>`<button class="row" data-a="go" data-v="${ITEM_V[c.item_tipo]||'home'}" data-id="${esc(c.item_id)}">${avatar(c.autor_nome||'?',36)}<span class="grow"><b style="font-weight:600">${esc(c.autor_nome||'Colega')}</b> <span class="xs mut">em ${ITEM_N[c.item_tipo]||'item'}</span><br><span class="sm">${esc(c.texto.slice(0,140))}</span></span>${ic('chev')}</button>`).join('')}</div>`:empty('fb','Nenhum comentário novo.','')}};
{const _h=V.home;V.home=p=>{const r=_h(p);if(!ALVO&&CM_NOVOS.length)r.h=`<button class="row" style="margin-bottom:12px;border-color:color-mix(in srgb,var(--coral) 45%,var(--line))" data-a="go" data-v="comentarios"><span class="mpl" style="width:36px;height:36px;font-size:15px;background:var(--coral)">${CM_NOVOS.length}</span><span class="grow"><b style="font-weight:600">${CM_NOVOS.length===1?'Novo comentário':'Novos comentários'} da equipe</b><br><span class="sm mut">${esc(CM_NOVOS[0].autor_nome||'Colega')}: ${esc(CM_NOVOS[0].texto.slice(0,60))}</span></span>${ic('chev')}</button>`+r.h;return r}}

/* ---------- RH: casos da equipe ---------- */
let CASOS_HASH={};let casosT=null;
function casosSync(){clearTimeout(casosT);casosT=setTimeout(async()=>{if(ALVO||!USER)return;await eqCarregar();const orgs=orgsRH();if(!orgs.length)return;const devs=(S.dev||[]).filter(d=>d&&d.id);
 for(const o of orgs){const rows=[];for(const d of devs){const h=JSON.stringify(d).length+':'+(d.texto||'').length+':'+(d.status||'');const k=o.id+'|'+d.id;if(CASOS_HASH[k]!==h){CASOS_HASH[k]=h;rows.push({org_id:o.id,id:d.id,owner_id:USER.id,owner_nome:meuNome(),data:d,updated_at:new Date().toISOString()})}}
  if(rows.length)await SB.from('team_cases').upsert(rows);
  const {data:ex}=await SB.from('team_cases').select('id').eq('org_id',o.id).eq('owner_id',USER.id);const vivos=new Set(devs.map(d=>d.id));const fora=(ex||[]).map(x=>x.id).filter(id=>!vivos.has(id));if(fora.length)await SB.from('team_cases').delete().eq('org_id',o.id).eq('owner_id',USER.id).in('id',fora)}},1500)}
async function casosCarregar(){await eqCarregar();const ids=orgsRH().map(o=>o.id);if(!ids.length){CASOS=[];CASOS_OK=true;return}const {data}=await SB.from('team_cases').select('*').in('org_id',ids).order('updated_at',{ascending:false});
 const vis=new Set();CASOS=(data||[]).filter(c=>{const k=c.owner_id+'|'+c.id;if(vis.has(k))return false;vis.add(k);return true});CASOS_OK=true}
let casosF='todos',casosQ='';
V.casosEquipe=()=>{if(precisa())return {t:'Casos da equipe',h:carregando()};if(!orgsRH().length)return {t:'Casos da equipe',h:empty('lib','Você ainda não está em uma equipe de RH.',`<button class="btn" style="margin-top:12px" data-a="go" data-v="equipes">Criar ou entrar em uma equipe</button>`)};
 if(!CASOS_OK){casosCarregar().then(()=>render());return {t:'Casos da equipe',h:carregando('Buscando os casos da equipe…')}}
 const donos=[...new Set(CASOS.map(c=>c.owner_id))],L=CASOS.filter(c=>(casosF==='todos'||(casosF==='meus'?c.owner_id===USER.id:c.owner_id===casosF))&&(!casosQ||JSON.stringify([c.data.vaga,c.data.etapa,c.data.cand,c.owner_nome]).toLowerCase().includes(casosQ.toLowerCase())));
 return {t:'Casos da equipe',act:`<button class="ib" data-a="casosRecarregar" aria-label="Atualizar">${ic('refresh')}</button>`,h:`<p class="sm mut" style="margin-bottom:10px">As devolutivas de toda a equipe, para aprender com os casos de cada um. Abra, comente e treine com eles.</p>
 <input id="cs_q" placeholder="Buscar por vaga, etapa ou colega" value="${esc(casosQ)}" style="margin-bottom:8px">
 <div class="chips" style="margin-bottom:10px"><button class="chip ${casosF==='todos'?'on':''}" data-a="casosFiltro" data-f="todos">Todos</button><button class="chip ${casosF==='meus'?'on':''}" data-a="casosFiltro" data-f="meus">Meus</button>${donos.filter(u=>u!==USER.id).map(u=>`<button class="chip ${casosF===u?'on':''}" data-a="casosFiltro" data-f="${u}">${esc((CASOS.find(c=>c.owner_id===u).owner_nome||'Colega').split(' ')[0])}</button>`).join('')}</div>
 ${L.length?`<div class="list">${L.map(c=>{const d=c.data,lac=(d.crit||[]).filter(x=>x.n&&x.res!=='Atendeu').length;return `<button class="row" data-a="go" data-v="casoVer" data-o="${c.org_id}" data-u="${c.owner_id}" data-id="${esc(c.id)}">${avatar(c.owner_nome||'?',36)}<span class="grow"><b style="font-weight:600">${esc(d.vaga||'Vaga')}</b> <span class="tag">${d.tipo==='interno'?'Interno':'Externo'}</span><br><span class="xs mut">${esc(c.owner_id===USER.id?'Você':c.owner_nome||'Colega')} · ${esc(d.decisao==='integrada'?'Decisão integrada':d.etapa||'')} · ${lac} critério${lac===1?'':'s'} não atendido${lac===1?'':'s'} · ${esc(d.status||'em preparo')}</span></span>${ic('chev')}</button>`}).join('')}</div>`:empty('lib','Nenhum caso encontrado.','')}`}};
A.casosFiltro=d=>{casosF=d.f;render()};A.casosRecarregar=async()=>{CASOS_OK=false;render()};
document.addEventListener('input',e=>{if(e.target&&e.target.id==='cs_q'){casosQ=e.target.value;clearTimeout(window._csT);window._csT=setTimeout(()=>{const pos=e.target.selectionStart;render();const n=document.getElementById('cs_q');if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}},350)}});
const casoBy=p=>CASOS.find(c=>c.org_id===p.o&&c.owner_id===p.u&&c.id===p.id);
V.casoVer=p=>{const c=casoBy(p);if(!c){if(!CASOS_OK){casosCarregar().then(()=>render());return {t:'Caso',h:carregando()}}return {t:'Caso',h:empty('lib','Caso não encontrado.','')}}
 const d=c.data;return {t:'Caso da equipe',h:`<span class="tag">${d.tipo==='interno'?'Interno':'Externo'}</span> <span class="xs mut">por ${esc(c.owner_id===USER.id?'você':c.owner_nome||'colega')}</span>
 <h2 style="margin-top:8px">${esc(d.vaga||'Vaga')}</h2><p class="mut sm">${esc(String(d.cand||'').split(' ')[0])} · ${esc(d.decisao==='integrada'?'Decisão integrada: '+(d.etapas||[]).join(', '):d.etapa||'')} · ${esc(d.canal||'')}</p>
 ${d.sint?`<div class="sec"><h3>Síntese integrada</h3></div><div class="card out">${esc(d.sint)}</div>`:''}
 <div class="sec"><h3>Critérios</h3></div><div class="list">${(d.crit||[]).filter(x=>x.n).map(x=>`<div class="card"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(x.n)}</b><span class="tag ${x.res==='Atendeu'?'o':x.res==='Não atendeu'?'b':'w'}">${esc(x.res||'')}</span></div><p class="xs mut" style="margin-top:4px">Exigido ${esc(x.req||'')} · Observado ${esc(x.obs||'')} · ${esc(x.inst||'')}</p><p class="sm" style="margin-top:6px">${esc(x.ev||'')}</p></div>`).join('')}</div>
 ${d.texto?`<div class="sec"><h3>Texto da devolutiva</h3></div><div class="card out ai">${esc(d.texto)}</div>`:''}
 ${treinoCard('treinoDev',`data-caso="${esc(c.org_id+'|'+c.owner_id+'|'+c.id)}"`,true)}
 <div class="btns" style="margin-top:12px"><button class="btn line" style="flex:1" data-a="casoBase" data-o="${c.org_id}" data-u="${c.owner_id}" data-id="${esc(c.id)}">Usar como base para uma nova devolutiva</button></div>
 <div class="sec"><h3>Comentários da equipe</h3></div><div class="cmbox card" data-t="dev" data-i="${esc(c.id)}" data-o="${c.owner_id}"><p class="sm mut">Carregando…</p></div>`}};
{const _t=A.treinoDev;A.treinoDev=d=>{if(!d.caso)return _t(d);const [o,u,id]=d.caso.split('|'),c=casoBy({o,u,id});if(!c)return;
 const f=JSON.parse(JSON.stringify(c.data));f.id=null;if(d.papel==='receber'&&!(f.crit||[]).some(x=>x.n))return toast('Este caso não tem critérios preenchidos.');const pc=devPraticaCen(f);pc.origem=null;save();go('simConfig',{cen:pc.id});if(d.papel==='receber')trocarPapel('receber')}}
A.casoBase=d=>{const c=casoBy({o:d.o,u:d.u,id:d.id});if(!c)return;const x=c.data;DV=devNew();Object.assign(DV,{vaga:x.vaga||'',etapa:x.etapa||DV.etapa,decisao:x.decisao||'etapa',etapas:[...(x.etapas||[])],tipo:x.tipo||DV.tipo,crit:(x.crit||[]).filter(k=>k.n).map(k=>({...k,obs:'',res:'',ev:''}))});if(!DV.crit.length)DV.crit=devNew().crit;go('devNovo');toast('Critérios copiados. Preencha o que foi observado neste candidato.')};

/* ---------- menu e entrada por link ---------- */
{const _mg=menuGroups;menuGroups=()=>{const G=_mg(),it=[['team','Equipes e convites','equipes']];if(EQ.ok&&abaixoDeMim().length)it.push(['team','Acompanhar minha equipe','acompanhar']);if(EQ.ok&&orgsRH().length)it.push(['lib','Casos da equipe','casosEquipe']);if(EQ.ok&&EQ.orgs.length)it.push(['bell','Comentários','comentarios']);
 const i=G.findIndex(g=>g[0]==='Conta');G.splice(i<0?G.length:i,0,['Equipe',it]);return G}}
async function eqAoEntrar(){BASE_TS=(S&&S.ts)||0;await eqCarregar(true);render();cmNovos();casosSync();
 const m=/^#entrar=([A-Za-z0-9]+)/.exec(location.hash||'');if(m){PEND_CODE=m[1].toUpperCase();go('equipes');eqEntrar(PEND_CODE)}}
setInterval(()=>{if(USER&&!document.hidden)cmNovos()},120000);
