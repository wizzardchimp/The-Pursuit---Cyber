/* Floating "back" banner for CashGrab pages (always visible at the bottom, like a phone app's nav bar).
   Hub -> Home, other CashGrab pages -> CashGrab Hub. Replaces the old inline back buttons. */
(function () {
  'use strict';
  var p = location.pathname.toLowerCase().replace(/\.html$/, '');
  var label, href;
  if (/\/cashgrab$/.test(p)) { label = 'Back to Home'; href = 'cashgrab-login.html'; }
  else if (/\/(cashgrab-tickets|cashgrab-crypto|cashgrab-database|cashgrab-qr|mymessage)$/.test(p)) { label = 'Back to CashGrab Hub'; href = 'cashgrab.html'; }
  else if (/\/forgotlogin$/.test(p)) { label = 'Back to Login'; href = 'cashgrab-login.html'; }
  else return;

  var css = ''
    + '#pBack{position:fixed;left:0;right:0;bottom:0;z-index:700;display:flex;justify-content:center;padding:14px 16px max(16px,env(safe-area-inset-bottom));pointer-events:none;}'
    + '#pBack a{pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:440px;padding:15px 20px;border-radius:16px;background:#0f1a14;color:#fff;text-decoration:none;font:700 16px/1 "Inter",-apple-system,"Segoe UI",sans-serif;box-shadow:0 10px 28px rgba(10,40,26,.32),0 0 0 1px rgba(255,255,255,.06) inset;-webkit-tap-highlight-color:transparent;transition:transform .12s ease;}'
    + '#pBack a:active{transform:scale(.97);}'
    + '#pBack svg{width:18px;height:18px;stroke:#46f0a0;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;}'
    + 'body{padding-bottom:110px !important;}'
    /* hide the old inline back buttons at the foot of each page (the floating banner replaces them) */
    + '.footer-btn,.foot .back,.footer .back-btn,.footer-actions{display:none !important;}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var bar = document.createElement('div'); bar.id = 'pBack';
  var a = document.createElement('a'); a.href = href;
  a.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';
  a.appendChild(document.createTextNode(label));
  bar.appendChild(a); document.body.appendChild(bar);
})();
