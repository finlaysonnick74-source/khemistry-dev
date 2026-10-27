# Generates the inner pages from shared nav/footer. Re-run: python3 build.py
# Page STRUCTURE lives here. All visible COPY lives in content.py. Colours live in css/site.css :root.
from content import *
S=SITE; TEL=S["phone_tel"]; PH=S["phone_display"]; EM=S["email"]
def head(file,title,desc,extra="",cls=""):
    cls=f' class="{cls}"' if cls else ""
    return f'''<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://khemistry.co/{file}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Khemistry"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:locale" content="en_AU">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,50;1,9..144,300..600,50&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="icon" href="favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="stylesheet" href="css/site.css?v=6">
{extra}<script>document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')</script>
</head>
<body{cls}>
<a class="skiplink" href="#main">{S["skip"]}</a>
<div class="bg" aria-hidden="true"><div class="bg-track"></div></div><div class="bg-drift" aria-hidden="true"></div>
<header class="nav">
  <a class="brand" href="index.html" aria-label="Khemistry home: replay the opening"><span class="brand-k">K</span>hemistry</a>
  <nav aria-label="Primary"><ul id="navlist">
''' + "".join(f'    <li><a href="{h}"{" aria-current=\"page\"" if h==file else ""}>{t}</a></li>\n' for h,t in NAV) + f'''    <li><a class="nav-cta" href="contact.html"{" aria-current=\"page\"" if file=="contact.html" else ""}>{S["nav_contact"]}</a></li>
  </ul></nav>
  <button class="menu" type="button" aria-expanded="false" aria-controls="navlist">{S["menu"]}</button>
</header>
<main id="main">
'''
FOOT_T=f'''</main>
<footer class="foot" data-tone="glass">
  <div class="wrap">
    <div class="foot-top">
      <div>
        <p class="foot-tag">{S["tagline"]}</p>
        <p class="human" style="margin-top:14px"><span>{S["contact_label"]}</span> <a href="tel:{TEL}">{PH}</a> <a href="mailto:{EM}">{EM}</a> <span>{S["location"]}</span></p>
      </div>
      <nav aria-label="Footer"><ul>
        <li><a href="index.html">Home</a></li>{"".join(f'<li><a href="{h}">{t}</a></li>' for h,t in NAV)}<li><a href="contact.html">{S["nav_contact"]}</a></li>
      </ul></nav>
    </div>
    <!-- ABN shown on the current khemistry.co site. TBC: confirm which legal entity holds this ABN before launch. Licence number deliberately omitted until verified. -->
    <p class="foot-legal">{S["legal"]} <span class="draft-tag">{S["legal_tag"]}</span> · {S["location"]}</p>
  </div>
</footer>
<script src="js/site.js?v=6" defer></script>
<!--SCRIPTS--></body>
</html>
'''
def FOOT(scripts=''):
    return FOOT_T.replace('<!--SCRIPTS-->',scripts)
def CTAS(cls):
    c=f' {cls}' if cls else ''
    return f'<div class="ctas{c}"><a class="btn btn-primary" href="tel:{TEL}"><span>{S["call_prefix"]} {PH}</span></a><a class="btn btn-ghost" href="mailto:{EM}"><span>{EM}</span></a></div>'
def human(tone="cream"):
    return f'''<section class="sec" data-tone="{tone}"><div class="wrap rv">
  <p class="eyebrow">{S["human_eyebrow"]}</p>
  <h2>{S["human_h"]}</h2>
  {CTAS("")}
</div></section>
'''
def tile(n,s,name,tint,href=None,cls=""):
    tag='a' if href else 'span'; h=f' href="{href}"' if href else ' aria-hidden="true"'
    lab=f' aria-label="{name}"' if href else ''
    return f'<{tag} class="el t-{tint} {cls}"{h}{lab}><i>{n}</i><b>{s}</b><em>{name}</em></{tag}>'
PP=lambda c="",l=True: tile(*TILES["people"],"peach","people.html" if l else None,c)
PL=lambda c="",l=True: tile(*TILES["place"],"glass","place.html" if l else None,c)
PU=lambda c="",l=True: tile(*TILES["purpose"],"peach","purpose.html" if l else None,c)
KH=lambda c="": tile(*TILES["khemistry"],"glass",None,c)
ALIGN=S["align"]
RIGHTS_UL="".join(f"<li>{r}</li>" for r in RIGHTS)
F=FORMULA; PE=PEOPLE; PA=PLACE; PO=PURPOSE; A=ABOUT; CO=CONTACT; I=INSIGHTS

pages={}
pages["formula.html"]=(F["title"],F["desc"],f"""
<section class="sec hero" data-tone="tint"><div class="wrap">
  <p class="eyebrow rv">{F["eyebrow"]}</p>
  <h1 class="rv rv-d1">{F["h1"]}</h1>
  <div class="tiles rv rv-d2" role="group" aria-label="{F["tiles_label"]}">{PP()}<span class="op" aria-hidden="true">+</span>{PL()}<span class="op" aria-hidden="true">+</span>{PU()}<span class="op" aria-hidden="true">=</span>{KH()}</div>
  <p class="lede rv rv-d3" style="margin-top:34px">{ALIGN}</p>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap">
  <div class="sec-head rv">{PP("sm",False)}<h2>{F["people_h"]}</h2></div>
  <ul class="rights rv rv-d1">{RIGHTS_UL}</ul>
  <p class="rv" style="margin-top:22px"><a href="people.html">{F["people_more"]}</a></p>
</div></section>
<section class="sec" data-tone="tint"><div class="wrap">
  <div class="sec-head rv">{PL("sm",False)}<h2>{F["place_h"]}</h2></div>
  <p class="lede rv rv-d1">{F["place_lede"]}</p>
  <p class="pull rv rv-d2" style="margin-top:16px">{F["place_pull"]}</p>
  <p class="rv" style="margin-top:22px"><a href="place.html">{F["place_more"]}</a></p>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap">
  <div class="sec-head rv">{PU("sm",False)}<h2>{F["purpose_h"]}</h2></div>
  <p class="lede rv rv-d1">{F["purpose_lede"]}</p>
  <p class="muted rv rv-d2" style="margin-top:16px">{F["purpose_body"]}</p>
  <p class="rv" style="margin-top:22px"><a href="purpose.html">{F["purpose_more"]}</a></p>
</div></section>
<section class="sec" data-tone="glass"><div class="wrap narrow">
  <div class="sec-head rv">{KH("sm")}<h2>{F["kh_h"]}</h2></div>
  <p class="lede rv rv-d1">{ALIGN}</p>
  <p class="pull rv rv-d2" style="margin-top:16px">{S["tagline"]}</p>
</div></section>
"""+human()+FOOT())

def element_page(file,title,desc,t,name,body,prev,nxt,tone2):
    pages[file]=(title,desc,f"""
<section class="sec hero" data-tone="tint"><div class="wrap grid2">
  <div><p class="eyebrow rv">{S["formula_crumb"]} · {name}</p>
  <h1 class="rv rv-d1">{name}</h1>{body[0]}</div>
  <div class="rv rv-d2" style="display:flex;justify-content:center">{t}</div>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap">{body[1]}</div></section>
<section class="sec" data-tone="{tone2}"><div class="wrap narrow">
  <div class="sec-head rv">{KH("sm")}<h2 data-draft="whole-h">{S["whole_h"]}</h2></div>
  <p class="lede rv rv-d1">{ALIGN}</p>
  <div class="tiles rv rv-d2" style="margin-top:28px">{PP()}{PL()}{PU()}</div>
  <p class="rv" style="margin-top:28px"><a href="{prev[0]}">← {prev[1]}</a> &nbsp;·&nbsp; <a href="{nxt[0]}">{nxt[1]} →</a></p>
</div></section>
"""+human()+FOOT())

element_page("people.html",PE["title"],PE["desc"],PP("lg",False),PE["h1"],
 (f'<p class="lede rv rv-d2" data-draft="people-hero">{PE["hero"]}</p>',
  f"""<p class="eyebrow rv" data-draft="people-eyebrow">{PE["eyebrow"]}</p>
  <ul class="rights rv rv-d1" style="margin-top:20px">{RIGHTS_UL}</ul>
  <p class="muted rv" style="margin-top:34px">{PE["body1"]}</p>
  <p class="muted rv">{PE["body2"]}</p>"""),
 ("formula.html",S["formula_crumb"]),("place.html",PA["h1"]),"glass")

_cards="\n".join(f'   <div class="card rv{" rv-d"+str(i) if i else ""}">{tile(n,sym,"",tint,None,"sm")}<h3>{h}</h3></div>' for i,(n,sym,h,tint) in enumerate(PA["cards"]))
element_page("place.html",PA["title"],PA["desc"],PL("lg",False),PA["h1"],
 (f'<p class="lede rv rv-d2">{PA["hero"]}</p>',
  f"""<div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
{_cards}
  </div>
  <p class="pull rv" style="margin-top:40px">{PA["pull"]}</p>"""),
 ("people.html",PE["h1"]),("purpose.html",PO["h1"]),"glass")

element_page("purpose.html",PO["title"],PO["desc"],PU("lg",False),PO["h1"],
 (f'<p class="lede rv rv-d2">{PO["hero"]}</p>',
  f"""<p class="eyebrow rv">{PO["eyebrow"]}</p>
  <p class="lede rv rv-d1" style="margin-top:14px">{PO["body"]}</p>"""),
 ("place.html",PA["h1"]),("formula.html",S["formula_crumb"]),"glass")

_paras="\n".join(f'  <p class="rv">{p}</p>' for p in A["paras"])
pages["about.html"]=(A["title"],A["desc"],f"""
<section class="sec hero" data-tone="tint"><div class="wrap grid2">
  <div><p class="eyebrow rv">{A["eyebrow"]}</p>
  <h1 class="rv rv-d1">{A["h1"]}</h1>
  <p class="lede rv rv-d2">{A["lede"]}</p>
  <p class="rv rv-d3" style="margin-top:22px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;font-size:13px">{A["name"]} <span class="founder-role">{A["role"]}</span></p></div>
  <div class="rv rv-d2" style="display:flex;justify-content:center"><img class="portrait" src="assets/maidlin.webp" width="640" height="960" alt="{A["portrait_alt"]}"></div>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap narrow stack">
  <div class="sec-head rv">{tile(*A["tile"],"glass",None,"sm")}<h2>{A["h2"]}</h2></div>
{_paras}
  <!-- LinkedIn URL not yet supplied: add "Connect with Maidlin on LinkedIn" link once confirmed. -->
</div></section>
"""+human("tint")+FOOT())

pages["contact.html"]=(CO["title"],CO["desc"],f"""
<section class="sec hero" data-tone="tint"><div class="wrap">
  <p class="eyebrow rv">{CO["eyebrow"]}</p>
  <h1 class="rv rv-d1">{CO["h1"]}</h1>
  <p class="lede rv rv-d2">{CO["lede"]}</p>
  {CTAS("rv rv-d3")}
  <p class="rv rv-d3" style="margin-top:18px">{S["location"]}</p>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap grid2" style="align-items:start">
  <div class="rv"><p class="eyebrow">{CO["msg_eyebrow"]} <span class="draft-tag">{CO["msg_tag"]}</span></p>
  <h2 data-draft="contact-h">{CO["msg_h"]}</h2>
  <!-- PLACEHOLDER: no form backend yet. The form posts nowhere; site.js opens the visitor's email app with the message pre-filled. Wire to a form service before launch. -->
  <form class="form" id="contact-form" novalidate>
    <label>{CO["f_name"]}<input name="name" autocomplete="name" required></label>
    <label>{CO["f_email"]}<input name="email" type="email" autocomplete="email" required></label>
    <label>{CO["f_message"]}<textarea name="message" required></textarea></label>
    <button class="btn btn-primary" type="submit"><span>{CO["f_send"]}</span></button>
    <p class="form-note" data-draft="form-note">{CO["form_note"]}</p>
  </form></div>
  <div class="rv rv-d1"><p class="eyebrow">{CO["nl_eyebrow"]} <span class="draft-tag">{CO["nl_tag"]}</span></p>
  <h2 data-draft="nl-h">{CO["nl_h"]}</h2>
  <!-- PLACEHOLDER: newsletter provider not chosen. Nothing is collected. -->
  <form class="form" id="newsletter-form" action="#" novalidate>
    <label for="nl-email">{CO["nl_label"]}</label>
    <div class="inline"><input id="nl-email" name="email" type="email" autocomplete="email"><button class="btn btn-ghost" type="submit"><span>{CO["nl_btn"]}</span></button></div>
    <p class="form-note" id="nl-status" role="status" data-draft="nl-note">{CO["nl_note"]}</p>
  </form></div>
</div></section>
"""+FOOT())

pages["insights.html"]=(I["title"],I["desc"],f"""
<section class="sec hero" data-tone="tint"><div class="wrap">
  <p class="eyebrow rv">{I["eyebrow"]} <span class="draft-tag">{I["tag"]}</span></p>
  <h1 class="rv rv-d1">{I["h1"]}</h1>
  <p class="lede rv rv-d2" data-draft="insights-hero">{I["hero"]}</p>
  <div class="tiles rv rv-d3" style="margin-top:30px">{PP()}{PL()}{PU()}</div>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap narrow">
  <!-- PLACEHOLDER: no posts yet. Do not add sample posts. -->
  <h2 class="rv" data-draft="insights-h">{I["h2"]}</h2>
  <p class="muted rv" data-draft="insights-body">{I["body"]}</p>
</div></section>
"""+human("tint")+FOOT())



exec(open("build_home.py").read())
for f,(t,d,b) in pages.items():
    open(f,"w").write(head(f,t,d,*HEADX.get(f,("","")))+b)
print("built",len(pages))
