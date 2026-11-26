/* ---------- tema claro: novos blocos da tela inicial ---------- */
const ok_=`<i aria-hidden="true">✓</i>`;
function periodo(a,b,meio){const y=d=>d?d.slice(0,4):'';return `<div class="period"><span><b>${esc(fd(a))}</b><small>${y(a)}</small></span><i><span>${esc(meio)}</span></i><span><b>${esc(fd(b))}</b><small>${y(b)}</small></span></div>`}
function pessoa(n,papel,okk){return `<div>${avatar(n,52)}<span><b>${esc(n)}</b><small>${okk?ok_:''}${esc(papel)}</small></span></div>`}
function quando(d){return d<0?`venceu há ${-d} dia${d===-1?'':'s'}`:d===0?'é hoje':d===1?'é amanhã':`é em ${d} dias`}
function rosca(itens,centro,rot){const tot=itens.reduce((a,b)=>a+b[1],0);let acc=0;
 const g=tot?itens.filter(i=>i[1]).map(i=>{const s=acc/tot*360;acc+=i[1];return `${i[2]} ${s}deg ${acc/tot*360}deg`}).join(','):'var(--sf2) 0 360deg';
 return `<div class="donut"><div class="d" style="background:conic-gradient(${g})" role="img" aria-label="${esc(rot)}"><b>${esc(centro)}<small>${esc(rot)}</small></b></div><ul>${itens.map(i=>`<li><i style="background:${i[2]}"></i>${esc(i[0])}<em>${tot?Math.round(i[1]/tot*100):0}%</em></li>`).join('')}</ul></div>`}
function barra(t,pct,{late,lbl,dir,a,v,id}={}){return `<${a?'button':'div'} class="pbar" ${a?`data-a="${a}" data-v="${v}" data-id="${id}" style="display:block;width:100%;background:none;border:0;padding:0;text-align:left;font:inherit;color:inherit;cursor:pointer"`:''}><div class="t"><span>${esc(t)}</span><em>${pct}%</em></div><div class="prog"><i style="width:${pct}%"></i></div><div class="m">${late?`<span class="late">• ${esc(late)}</span>`:''}${lbl?`<span class="lbl">${esc(lbl)}</span>`:''}</div></${a?'button':'div'}>`}
const CORES=['#22A894','#E8604C','#3B82C4','#C92A62','#E0A030'];

function heroLider(){const P=S.perfil,t=hoje(),hr=new Date().getHours(),sau=hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite',nm=P.nome?', '+esc(P.nome.split(' ')[0]):'';
 const r=S.reun.filter(x=>x.status==='agendada'&&x.data>=t).sort((a,b)=>a.data.localeCompare(b.data))[0];
 if(!r){const p=S.pdi.filter(x=>!['concluído','cancelado'].includes(x.status)&&x.prazo).sort((a,b)=>a.prazo.localeCompare(b.prazo))[0];
  return `<section class="hello hero"><span class="lg">${LOGO}</span><p class="mut sm">${esc(fdl(t))}</p><h2 style="margin-top:6px">${sau}${nm}. ${p?`O PDI de ${esc(lidN(p.lid)||'sua equipe')} <em>${quando(diasEntre(t,p.prazo))}</em>`:'Nenhuma 1:1 agendada. <em>Que tal marcar uma?</em>'}</h2>
  <div class="btns"><button class="btn sm" data-a="go" data-v="reunEdit">Agendar 1:1</button>${p?`<button class="btn sm line" data-a="go" data-v="pdiVer" data-id="${p.id}">Ver PDI</button>`:''}</div></section>`}
 const ln=lidN(r.lid)||'Equipe',ant=S.reun.filter(x=>x.lid===r.lid&&x.data<t).sort((a,b)=>b.data.localeCompare(a.data))[0];
 return `<section class="hello hero"><span class="lg">${LOGO}</span><p class="mut sm">${esc(fdl(t))}</p><h2 style="margin-top:6px">${sau}${nm}, sua 1:1 com ${esc(ln)} <em>${quando(diasEntre(t,r.data))}</em></h2>
 ${periodo(ant?ant.data:t,r.data,ant?'Desde a última 1:1':'Até a 1:1')}
 <div class="pair">${pessoa(P.nome||'Você','Líder',1)}${pessoa(ln,r.pauta?'Pauta pronta':'Sem pauta ainda',!!r.pauta)}</div>
 <div class="stepper"><button class="on" data-a="go" data-v="reunVer" data-id="${r.id}">${ic('pdi')}Preparar</button><button data-a="tab" data-v="simula">${ic('sim')}Treinar</button><button data-a="go" data-v="reunVer" data-id="${r.id}">${ic('check')}Registrar</button></div></section>`}

function blocosLider(){const t=hoje(),lim=addD(-90);
 const P=S.pdi.filter(x=>!['concluído','cancelado'].includes(x.status)),med=P.length?Math.round(P.reduce((a,p)=>a+pdiProg(p),0)/P.length):0;
 const fb=S.ev.filter(e=>e.tipo==='feedback'&&e.data>=lim).length,re=S.reun.filter(r=>r.status==='concluida'&&r.data>=lim).length,rc=S.rec.filter(r=>r.data>=lim).length,sm=S.sims.filter(s=>(s.data||'')>=lim).length;
 const IT=[['Feedbacks',fb,CORES[0]],['Reuniões 1:1',re,CORES[2]],['Reconhecimentos',rc,CORES[1]],['Treinos no Simula',sm,CORES[3]]],tot=fb+re+rc+sm;
 const top=[...IT].sort((a,b)=>b[1]-a[1])[0],estilo={Feedbacks:'orientador',['Reuniões 1:1']:'presente',Reconhecimentos:'reconhecedor',['Treinos no Simula']:'em treino'}[top[0]];
 const recs=[...S.rec].sort((a,b)=>b.data.localeCompare(a.data)),vistos=new Set(),av=[];recs.forEach(r=>{if(r.lid&&!vistos.has(r.lid)){vistos.add(r.lid);av.push(r.lid)}});
 const semRec=ativos().filter(l=>!vistos.has(l.id));
 return `<div class="home2">
 <div class="card"><h3>${ic('pdi','width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--plum)')}PDIs da equipe</h3><p class="sub">Conclusão média dos planos ativos</p>
  <div class="big" style="margin-top:12px"><div class="prog g"><i style="width:${med}%"></i></div><b>${med}%</b></div>
  ${P.length?P.slice(0,4).map(p=>barra(p.comp,pdiProg(p),{late:p.prazo&&p.prazo<t?'prazo vencido':(p.acoes.some(a=>!a.ok&&a.prazo&&a.prazo<t)?'ação atrasada':''),lbl:lidN(p.lid),a:'go',v:'pdiVer',id:p.id})).join(''):`<p class="sm mut" style="margin-top:12px">Nenhum PDI ativo. <button class="btn sm ghost" data-a="go" data-v="pdiEdit">Criar PDI</button></p>`}
 </div>
 <div class="card"><h3>${ic('fb','width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--plum)')}Equilíbrio da sua rotina</h3>
  <p class="sub">Com <b>${tot}</b> registros nos últimos 90 dias, seu estilo está mais <span class="hl">${tot?estilo:'a definir'}</span>.</p>
  <div style="margin-top:14px">${rosca(IT,tot,'registros')}</div>
  <p class="xs mut" style="margin-top:12px">Um bom equilíbrio mistura feedbacks, 1:1s regulares e reconhecimento.</p></div>
 <div class="card wide"><h3>${ic('star','width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--plum)')}Reconhecimentos recentes</h3>
  <p class="sub">Com <b>${S.rec.length}</b> reconhecimentos dados${semRec.length?`, <span class="hl">${semRec.length} ${semRec.length===1?'pessoa ainda não recebeu':'pessoas ainda não receberam'}</span>`:''}.</p>
  <div class="avrow" style="margin-top:12px">${av.map(id=>`<button data-a="go" data-v="lid" data-id="${id}">${avatar(lidN(id),48)}<span class="n">${esc(lidN(id).split(' ')[0])}</span></button>`).join('')}${semRec.slice(0,6).map(l=>`<button data-a="go" data-v="recEdit" data-lid="${l.id}" style="opacity:.75">${avatar(l.nome,48)}<span class="n">+ ${esc(l.nome.split(' ')[0])}</span></button>`).join('')}</div></div>
 </div>`}

function heroRH(){const P=S.perfil,t=hoje(),hr=new Date().getHours(),sau=hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite',nm=P.nome?', '+esc(P.nome.split(' ')[0]):'';
 const d=(S.dev||[]).filter(x=>x.status!=='realizada'&&x.prazo).sort((a,b)=>a.prazo.localeCompare(b.prazo))[0];
 if(!d)return `<section class="hello hero"><span class="lg">${LOGO}</span><p class="mut sm">${esc(fdl(t))}</p><h2 style="margin-top:6px">${sau}${nm}. Nenhuma devolutiva pendente. <em>Tudo em dia.</em></h2><div class="btns"><button class="btn sm" data-a="go" data-v="devNovo" data-reset="1">Nova devolutiva</button></div></section>`;
 return `<section class="hello hero"><span class="lg">${LOGO}</span><p class="mut sm">${esc(fdl(t))}</p><h2 style="margin-top:6px">${sau}${nm}, a devolutiva de ${esc(d.cand)} <em>${quando(diasEntre(t,d.prazo))}</em></h2>
 <p class="sub" style="margin-top:4px">${esc(d.vaga||'')}${d.decisao==='integrada'?' · Decisão integrada':d.etapa?' · '+esc(d.etapa):''}</p>
 ${d.prazo<t?periodo(d.prazo,t,'Atrasada'):periodo(t,d.prazo,'Prazo')}
 <div class="pair">${pessoa(P.nome||'Você','Recrutador(a)',1)}${pessoa(d.cand,d.tipo==='interno'?'Candidato interno':'Candidato externo',d.status==='preparada')}</div>
 <div class="stepper"><button class="${d.status!=='preparada'?'on':''}" data-a="go" data-v="devVer" data-id="${d.id}">${ic('pdi')}Preparar</button><button data-a="tab" data-v="simula">${ic('sim')}Treinar</button><button class="${d.status==='preparada'?'on':''}" data-a="go" data-v="devVer" data-id="${d.id}">${ic('check')}Registrar</button></div></section>`}

function blocosRH(){const t=hoje(),D=S.dev||[],pr=x=>x.status==='realizada'?100:x.status==='preparada'?66:(x.crit||[]).some(c=>c.ev)?33:10;
 const atr=D.filter(x=>x.status!=='realizada'&&x.prazo&&x.prazo<t).length,prep=D.filter(x=>x.status==='preparada'&&!(x.prazo<t)).length,real=D.filter(x=>x.status==='realizada').length,ras=D.length-atr-prep-real;
 const pend=D.filter(x=>x.status!=='realizada').sort((a,b)=>String(a.prazo).localeCompare(String(b.prazo)));
 const crit={};D.forEach(x=>(x.crit||[]).forEach(c=>{if(c.n&&c.res&&c.res!=='Atendeu')crit[c.n]=(crit[c.n]||0)+1}));const CR=Object.entries(crit).sort((a,b)=>b[1]-a[1]).slice(0,4);
 return `<div class="home2">
 <div class="card"><h3>${ic('user','width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--plum)')}Devolutivas em andamento</h3><p class="sub">Do rascunho ao registro com o candidato</p>
  ${pend.length?pend.slice(0,4).map(x=>barra(x.cand+(x.vaga?' · '+x.vaga:''),pr(x),{late:x.prazo&&x.prazo<t?'prazo vencido':'',lbl:x.tipo==='interno'?'Interno':'Externo',a:'go',v:'devVer',id:x.id})).join(''):`<p class="sm mut" style="margin-top:12px">Nenhuma pendente.</p>`}</div>
 <div class="card"><h3>${ic('fb','width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--plum)')}Situação das devolutivas</h3><p class="sub">Com <b>${D.length}</b> devolutivas registradas${atr?`, <span class="hl" style="color:var(--coral)">${atr} atrasada${atr>1?'s':''}</span>`:''}.</p>
  <div style="margin-top:14px">${rosca([['Realizadas',real,CORES[0]],['Preparadas',prep,CORES[2]],['Em rascunho',ras,CORES[4]],['Atrasadas',atr,CORES[1]]],D.length,'devolutivas')}</div></div>
 ${CR.length?`<div class="card wide"><h3>${ic('alert','width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--plum)')}Critérios mais frequentes nas reprovações</h3><p class="sub">Ajuda a revisar a descrição das vagas e a triagem</p>${CR.map(([n,c])=>barra(n,Math.round(c/D.length*100),{lbl:c+' caso'+(c>1?'s':'')})).join('')}</div>`:''}
 </div>`}

{const _hl=_homeLider;
 const troca=(h,hero,bl,ancora)=>{h=h.replace(/<section class="hello">[\s\S]*?<\/section>/,hero);const i=h.indexOf(ancora);return i>=0?h.slice(0,i)+bl+h.slice(i):h+bl};
 V.home=p=>{if(soRH()){const r=homeRH();r.h=troca(r.h,heroRH(),blocosRH(),'<div class="sec"><h3>Checklist');return r}
  const r=_hl(p);r.h=troca(r.h,heroLider(),blocosLider(),'<div class="sec"><h3>Recomendações');return r}}
