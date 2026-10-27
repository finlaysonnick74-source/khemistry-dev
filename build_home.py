# Home page structure (exec'd by build.py, shares its helpers). Copy lives in content.py HOME / FORMULA / RIGHTS.
import json
H=HOME
_ld={"@context":"https://schema.org","@type":"EmploymentAgency","name":"Khemistry","url":"https://khemistry.co","telephone":TEL,"email":EM,
 "description":H["desc"],"slogan":S["tagline"].rstrip("."),"legalName":"Khemistry Pty Ltd",
 "founder":{"@type":"Person","name":"Maidlin Mistry","jobTitle":"Founder"},
 "address":{"@type":"PostalAddress","addressLocality":"Melbourne","addressRegion":"VIC","addressCountry":"AU"},
 "areaServed":[{"@type":"Country","name":"Australia"},{"@type":"Place","name":"South East Asia"}]}
_extra=f'''<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{json.dumps(_ld,ensure_ascii=False)}</script>
<script>(function(){{var d=document.documentElement,rm=matchMedia("(prefers-reduced-motion: reduce)").matches,gl=false;try{{gl=!!document.createElement("canvas").getContext("webgl2")}}catch(e){{}}if(location.search.indexOf("no3d")>=0)gl=false;d.classList.add(rm||!gl?"still3d":"live3d")}})()</script>
'''
HEADX={"index.html":(_extra,"home")}
_P=[("people",)+TILES["people"],("place",)+TILES["place"],("purpose",)+TILES["purpose"]]
_hits="".join(f'<button class="ppp-hit" type="button" data-k="{k}" data-num="{n}" data-sym="{s}" data-name="{nm}" aria-controls="tile-panel" aria-label="{nm}: what it means"></button>' for k,n,s,nm in _P)
_tabs="".join(f'<button role="tab" id="tab-{k}" aria-controls="panel-{k}" aria-selected="{"true" if i==0 else "false"}" tabindex="{0 if i==0 else -1}"><span class="el t-{"peach" if i!=1 else "glass"} sm" aria-hidden="true"><i>{n}</i><b>{s}</b></span><em>{nm}</em></button>' for i,(k,n,s,nm) in enumerate(_P))
_F=FORMULA
pages["index.html"]=(H["title"],H["desc"],f'''
<section class="h3d" id="hero" data-tone="cream" aria-label="Khemistry">
  <div class="h3d-still" aria-hidden="true"></div>
  <canvas class="h3d-canvas" aria-hidden="true"></canvas>
  <p class="sr-only">Khemistry</p>
  <p class="credit"><span class="cr-name">{H["credit_name"]}</span><span class="cr-sep" aria-hidden="true"></span><span class="cr-role">{H["credit_role"]}</span></p>
  <div class="ppp" role="group" aria-label="{_F["tiles_label"]}: {TILES["people"][2]}, {TILES["place"][2]}, {TILES["purpose"][2]}">{_hits}</div>
  <div class="titlecard">
    <h1 class="headline">{S["align"]}</h1>
    <div class="ctas"><a class="btn btn-primary" href="tel:{TEL}"><span>{H["cta_call"]}</span></a><a class="btn btn-ghost" href="mailto:{EM}"><span>{H["cta_email"]}</span></a></div>
  </div>
  <aside class="tile-panel" id="tile-panel" aria-live="polite" hidden>
    <button class="tp-close" type="button">{H["panel_close"]} ✕</button>
    <div class="tp-body"></div>
    <a class="tp-more" href="#formula">{H["panel_more"]}</a>
  </aside>
  <div class="h3d-ui"><button class="ctl skip" type="button">{H["skip_intro"]}</button><button class="ctl replay" type="button" aria-label="Replay the opening">↻ {H["replay"]}</button></div>
</section>
<section class="sec formula" id="formula" data-tone="tint" aria-labelledby="formula-h"><div class="wrap">
  <p class="eyebrow rv">{H["formula_eyebrow"]}</p>
  <h2 id="formula-h" class="rv rv-d1">{H["formula_h"]}</h2>
  <div class="f-tabs rv rv-d2" role="tablist" aria-label="{H["formula_eyebrow"]}">{_tabs}</div>
  <div class="f-panels rv rv-d3">
    <div role="tabpanel" id="panel-people" aria-labelledby="tab-people" tabindex="0"><h3>{_F["people_h"]}</h3><ul class="rights">{RIGHTS_UL}</ul><p class="more"><a href="people.html">{_F["people_more"]}</a></p></div>
    <div role="tabpanel" id="panel-place" aria-labelledby="tab-place" tabindex="0" hidden><h3>{_F["place_h"]}</h3><p class="lede">{_F["place_lede"]}</p><p class="pull">{_F["place_pull"]}</p><p class="more"><a href="place.html">{_F["place_more"]}</a></p></div>
    <div role="tabpanel" id="panel-purpose" aria-labelledby="tab-purpose" tabindex="0" hidden><h3>{_F["purpose_h"]}</h3><p class="lede">{_F["purpose_lede"]}</p><p class="muted">{_F["purpose_body"]}</p><p class="more"><a href="purpose.html">{_F["purpose_more"]}</a></p></div>
  </div>
  <p class="pull rv" style="margin-top:44px">{S["tagline"]}</p>
</div></section>
<section class="sec" data-tone="cream"><div class="wrap narrow">
  <div class="sec-head rv">{tile(*ABOUT["tile"],"glass",None,"sm")}<p class="eyebrow">{H["about_eyebrow"]}</p></div>
  <h2 class="rv rv-d1">{H["about_h"]}</h2>
  <p class="rv rv-d2">{H["about_p"]}</p>
  <p class="rv rv-d3" style="margin-top:18px"><a href="about.html">{H["about_more"]}</a></p>
</div></section>
'''+human("glass")+FOOT('''<script src="js/home.js?v=5" defer></script>
<script type="importmap">{"imports":{"three":"./vendor/three/three.module.js","three/addons/":"./vendor/three/addons/"}}</script>
<script type="module" src="js/hero3d.js?v=5"></script>
'''))
