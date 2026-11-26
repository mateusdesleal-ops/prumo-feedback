/* ---------- Visões: líder, RH ou ambos ---------- */
function soRH(){const p=S&&S.perfil&&S.perfil.papeis||['lider'];return p.length===1&&p[0]==='rh'}
function visaoAtual(){const p=S&&S.perfil&&S.perfil.papeis||['lider'];return p.includes('rh')&&p.includes('lider')?'ambos':p.includes('rh')?'rh':'lider'}
function definirVisao(v){S.perfil.papeis=v==='ambos'?['lider','rh']:[v];simCat=v==='rh'?'Devolutiva':'Todos';save()}
function aplicarVisaoHash(){const h=(location.hash||'').slice(1);if(!['lider','rh','ambos'].includes(h)||!S)return;if(!S.perfil.onb){const c=S.cfg;S=seed();S.cfg=c;S.perfil.onb=true;S.perfil.cargo=h==='rh'?'Recrutamento e Seleção':'Coordenador(a)';if(h==='rh'){S.ag=[{id:nid(),titulo:'Kickoff da vaga de Analista de Dados com o gestor',tipo:'Reunião',data:addD(2),hora:'10:00',recorr:'',ok:false},{id:nid(),titulo:'Painel final: Coordenador de Operações',tipo:'Compromisso pessoal',data:addD(4),hora:'14:00',recorr:'',ok:false}];S.ev=S.ev.filter(e=>e.lid);S.ev.push({id:nid(),tipo:'compromisso',lid:null,data:addD(-1),prazo:addD(1),titulo:'Enviar matriz de competências da vaga para validação do gestor',texto:'',status:'pendente'})}}definirVisao(h)}
A.trocaVisao=d=>{definirVisao(d.x);toast(d.x==='rh'?'Visão do RH':d.x==='lider'?'Visão do líder':'Visão completa: líder e RH');tab('home')};
window.addEventListener('hashchange',()=>{if(!S)return;aplicarVisaoHash();tab('home')});

const _homeLider=V.home;
V.home=p=>soRH()?homeRH():_homeLider(p);
function homeRH(){const P=S.perfil,t=hoje(),hr=new Date().getHours(),sau=hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite';
 const D=S.dev||[],pend=D.filter(d=>d.status!=='realizada'),atr=pend.filter(d=>d.prazo&&d.prazo<t),feitas=D.filter(d=>d.status==='realizada'),simsDev=S.sims.filter(s=>{const c=cenBy(s.cen);return c&&c.cat==='Devolutiva'});
 const K=[[pend.length,'Pendentes','devs'],[atr.length,'Atrasadas','devs'],[feitas.length,'Realizadas','devs'],[simsDev.length,'Treinos de devolutiva','simHist']];
 const QA=[['user','Nova devolutiva','devNovo'],['mic','Relato por voz','devNovoRelato'],['copy','Em lote','devLote'],['sim','Treinar','simula'],['mentor','Mentor','mentor'],['plus','Criar personagem','persEdit'],['acad','Trilha RH','trilhaDev'],['cal','Agenda','agenda']];
 const prox=[...pend].sort((a,b)=>String(a.prazo).localeCompare(String(b.prazo))).slice(0,4),ref=['Devolutiva técnica é critério, nível exigido, nível observado e evidência.','Troque "não tem perfil" por qual requisito não foi atendido e como você observou isso.','A devolutiva é um direito de quem foi avaliado, independentemente do resultado.','Fale da pessoa avaliada, nunca de quem foi aprovado.','Evidência é o que a pessoa disse ou fez, em qual etapa.'][new Date().getDate()%5];
 return {t:'Início',act:`<button class="ib" data-a="go" data-v="notifs" aria-label="Notificações">${ic('bell')}</button>`,h:`
 ${S.demo?`<div class="note" style="margin:0 0 12px">Você está usando dados de exemplo. <button class="btn sm line" style="margin-left:6px;min-height:30px" data-a="limparDemo">Começar do zero</button></div>`:''}
 <section class="hello"><span class="lg">${LOGO}</span><p class="mut sm">${esc(fdl(t))}</p><h2 style="margin-top:4px">${sau}${P.nome?', '+esc(P.nome.split(' ')[0]):''}</h2><p class="mut sm">${esc(P.cargo||'Recrutamento e Seleção')} · Visão RH</p><q>${esc(ref)}</q></section>
 <div class="sec"><h3>Devolutivas</h3></div>
 <div class="kpis">${K.map(k=>`<button class="kpi" data-a="go" data-v="${k[2]}"><b>${esc(k[0])}</b><span>${k[1]}</span></button>`).join('')}</div>
 <div class="sec"><h3>Ações rápidas</h3></div>
 <div class="qa">${QA.map(q=>`<button data-a="${['simula','mentor'].includes(q[2])?'tab':q[2]==='devNovoRelato'?'devRelatoNovo':'go'}" data-v="${q[2]==='trilhaDev'?'trilha':q[2]}" ${q[2]==='trilhaDev'?'data-id="dev"':''} ${q[2]==='devNovo'?'data-reset="1"':''}><span class="c">${ic(q[0])}</span>${q[1]}</button>`).join('')}</div>
 <div style="margin-top:18px"><button class="simcta" data-a="tab" data-v="simula"><span style="width:52px;height:52px;border-radius:16px;background:#C4A46B;display:grid;place-items:center;color:#123D3B;flex:none">${ic('sim')}</span><span style="flex:1"><b>Treine a devolutiva antes</b><br><span class="mut sm">Candidato frustrado, "quem foi aprovado?", gestor que discorda ou um personagem criado por você.</span></span>${ic('chev')}</button></div>
 <div class="sec"><h3>Próximas devolutivas</h3><button class="btn sm ghost" data-a="go" data-v="devs">Ver todas</button></div>
 ${prox.length?`<div class="list">${prox.map(d=>`<button class="row" data-a="go" data-v="devVer" data-id="${d.id}">${avatar(d.cand,40)}<span class="grow"><b style="font-weight:600">${esc(d.cand)}</b> <span class="tag">${d.tipo==='interno'?'Interno':'Externo'}</span><br><span class="sm mut">${esc(d.vaga)} · ${esc(d.etapa)}</span></span><span class="tag ${d.prazo<t?'b':'w'}">${d.prazo<t?'atrasada':'até '+esc(fd(d.prazo))}</span></button>`).join('')}</div>`:`<div class="card mut">Nenhuma devolutiva pendente.</div>`}
 <div class="sec"><h3>Checklist da devolutiva técnica</h3></div>
 <div class="card"><ul style="margin:0;padding-left:18px;line-height:1.8" class="sm"><li>Critérios definidos antes do processo</li><li>Nível exigido versus nível observado</li><li>Instrumento ou etapa de cada evidência</li><li>Evidência comportamental, sem impressões pessoais</li><li>Sem dados sensíveis e sem comparar candidatos</li><li>Recomendações de desenvolvimento</li></ul></div>`}}
A.devRelatoNovo=()=>{DV=devNew();DV.step=1;RL={txt:'',res:null,resp:{},busy:false};go('devNovo');go('devRelato')};
{const orig=AJUDA.home,rh=['Início (visão RH)','Seu painel de recrutamento: devolutivas pendentes, atrasadas e realizadas, e atalhos para preparar e treinar.',['Indicadores: toque para abrir a lista de devolutivas.','Ações rápidas: nova devolutiva, relato por voz, lote, treino e criar personagem.','Próximas devolutivas: ordenadas pelo prazo.','Use "Visão do app" em Mais para alternar entre líder, RH ou ambos.'],'Comece pelas atrasadas: a devolutiva perde valor quando demora.'];Object.defineProperty(AJUDA,'home',{get(){return soRH()?rh:orig},configurable:true})}

{const orig=AJUDA.mentor,rh=['Mentor de Seleção','Um mentor com IA especializado em recrutamento e seleção, disponível a qualquer hora.',['Pergunte sobre critérios, entrevistas por competências, devolutivas, vieses ou LGPD.','As respostas trazem critérios a considerar, riscos técnicos, éticos e legais, como conduzir e um exemplo de fala.','Fale ou digite a pergunta.'],'Ele não substitui seu julgamento técnico, as normas do CFP ou a orientação jurídica.'];Object.defineProperty(AJUDA,'mentor',{get(){return soRH()?rh:orig},configurable:true})}

/* ---------- menu lateral (computador) ---------- */
function sidebar(curV){const tabs=tabsAtuais(),G=menuGroups();const isOn=v=>v===curV||(stack.length===1&&v===curTab&&curV===curTab);
 const item=(icn,lab,act,v,extra='')=>`<button class="si ${isOn(v)?'on':''}" data-a="${act}" data-v="${v}" ${extra}>${ic(icn)}<span>${esc(lab)}</span></button>`;
 return `<aside class="side" aria-label="Menu"><div class="sbrand" aria-label="Prumo Feedback"><span class="wm" aria-hidden="true">${LOGO}</span><span aria-hidden="true">rumo <b>Feedback</b></span></div>
 <nav>${tabs.filter(t=>t[0]!=='more').map(t=>item(t[2],t[1],'tab',t[0])).join('')}
 ${G.map(g=>`<p class="sgrp">${esc(g[0])}</p>${g[1].filter(x=>!tabs.some(t=>t[0]===x[2])).map(x=>item(x[0],x[1],'side',x[2])).join('')}`).join('')}</nav>
 <div class="sfoot"><div class="seg sseg">${[['lider','Líder'],['rh','RH'],['ambos','Ambos']].map(x=>`<button class="${visaoAtual()===x[0]?'on':''}" data-a="trocaVisao" data-x="${x[0]}">${x[1]}</button>`).join('')}</div>
 <button class="si" data-a="side" data-v="perfil">${avatar(S.perfil.nome||'Eu',28)}<span>${esc(S.perfil.nome||'Seu perfil')}<br><small>${esc(S.perfil.cargo||'')} · ${esc(S.plano)}</small></span></button></div></aside>`}
A.side=d=>{curTab='more';stack=[{v:d.v,p:{}}];render();scrollTo(0,0)};
