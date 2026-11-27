import re,os
import os
HERE=os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
OUT=os.path.join(HERE,'..','web')
os.makedirs(OUT,exist_ok=True)
src={f:open(f).read() for f in ['app.data.js','app.core.js','app.feat.js','app.sim.js','app.help.js','app.dev.js','app.pers.js','app.views.js','app.ctx.js','app.metodo.js','app.inverso.js','app.pdf.js','app.look.js','app.more.js']}
core=src['app.core.js']
core,n=re.subn(r"const ETICA='[^']*';","const ETICA='';",core);assert n==1
core,n=re.subn(r"const noAI='[^']*';","const noAI='A IA não respondeu. Verifique sua conexão e tente de novo.';",core);assert n==1
old="""<div class="list"><button class="btn full" data-a="obNext">Continuar com e-mail</button><button class="btn line full" data-a="obNext">Continuar com Apple</button><button class="btn line full" data-a="obNext">Continuar com Google</button><p class="xs mut" style="text-align:center">Protótipo: o login real (e-mail, Apple, Google, recuperação de acesso e biometria) será ativado na versão das lojas.</p></div>"""
if old in core: core=core.replace(old,'<div class="list"><button class="btn full" data-a="obNext">Começar</button><p class="xs mut" style="text-align:center">Versão de testes. Use apenas casos fictícios, sem dados reais da sua equipe.</p></div>')
src['app.core.js']=core
more=src['app.more.js']
assert more.rstrip().endswith('init();')
src['app.more.js']=more.rstrip()[:-len('init();')]
js='\n'.join(src[f] for f in ['app.data.js','app.core.js','app.feat.js','app.sim.js','app.help.js','app.dev.js','app.pers.js','app.views.js','app.ctx.js','app.metodo.js','app.inverso.js','app.pdf.js','app.look.js','app.more.js'])+'\n'+open('web.js').read()
sh=open('app.shell.html').read()
sh=sh.replace('<title>Prumo Feedback · App</title>','<title>Prumo Feedback · Testes</title>\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="Prumo Feedback">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<meta name="theme-color" content="#4A2D5E">\n<link rel="icon" href="icon-192.png">')
sh=sh.replace('<script>\n{','<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2"></script>\n<script src="config.js"></script>\n<script>\n{')
out=sh.replace('%%CSS%%',open('app.css').read()+'\nbody{padding-top:env(safe-area-inset-top)}').replace('%%LOGO%%',open('logo_path.txt').read().strip()).replace('%%JS%%',js)
open(OUT+'/index.html','w').write(out)
open(os.path.join(HERE,'web_check.js'),'w').write('{'+js+'}')
if not os.path.exists(OUT+'/config.js'):
    open(OUT+'/config.js','w').write("// Preencha com os dados do seu projeto Supabase (Configurações > API).\n// A chave pública (publishable/anon) pode ficar aqui: a segurança vem das regras do banco.\nwindow.PRUMO_CONFIG = {\n  SUPABASE_URL: 'COLE_AQUI_A_URL',\n  SUPABASE_KEY: 'COLE_AQUI_A_CHAVE_PUBLICA'\n};\n")
open(OUT+'/manifest.webmanifest','w').write('{"name":"Prumo Feedback","short_name":"Prumo","description":"Feedbacks, 1:1, PDI e devolutivas técnicas com IA","start_url":"./","scope":"./","display":"standalone","background_color":"#F4F5F8","theme_color":"#4A2D5E","lang":"pt-BR","icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}')
import shutil
for n in ['icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png']: shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)),'icons',n),os.path.join(OUT,n))
print('ok',len(out))
