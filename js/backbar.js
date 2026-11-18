/* CashGrab pages: floating home button at the bottom + a coloured icon badge in each hustle's title.
   - Hustle pages  -> "CashGrab Home" (back to the hub)
   - Hub           -> "Back to Home"
   - Login         -> "Back to Personal Drive" */
(function () {
  'use strict';
  var p = location.pathname.toLowerCase().replace(/\.html$/, '');
  var label, href, home = false;
  if (/\/cashgrab$/.test(p)) { label = 'Back to Home'; href = 'cashgrab-login.html'; }
  else if (/\/(cashgrab-tickets|cashgrab-crypto|cashgrab-database|cashgrab-qr|mymessage)$/.test(p)) { label = 'CashGrab Home'; href = 'cashgrab.html'; home = true; }
  else if (/\/forgotlogin$/.test(p)) { label = 'Back to Login'; href = 'cashgrab-login.html'; }
  else if (/\/cashgrab-login$/.test(p)) { label = 'Back to Personal Drive'; href = '../autostore/as_drive.html'; }
  else return;

  var css = ''
    + '#pBack{position:fixed;left:0;right:0;bottom:0;z-index:700;display:flex;justify-content:center;padding:14px 16px max(16px,env(safe-area-inset-bottom));pointer-events:none;}'
    + '#pBack a{pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:440px;padding:15px 20px;border-radius:16px;background:#0f1a14;color:#fff;text-decoration:none;font-weight:700;font-size:16px;line-height:1;box-shadow:0 10px 28px rgba(10,40,26,.32),0 0 0 1px rgba(255,255,255,.06) inset;-webkit-tap-highlight-color:transparent;transition:transform .12s ease;}'
    + '#pBack a:active{transform:scale(.97);}'
    + '#pBack svg{width:19px;height:19px;stroke:#46f0a0;fill:none;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round;}'
    + 'body{padding-bottom:110px !important;}'
    + '.footer-btn,.foot .back,.footer .back-btn,.footer-actions{display:none !important;}'
    /* hustle icon badge */
    + '.hbadge{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:11px;color:#fff;font-size:17px;margin-right:10px;vertical-align:middle;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 4px 10px rgba(0,0,0,.18);flex-shrink:0;}'
    + '.hbadge.green{background:linear-gradient(145deg,#34d399,#0f9d6b);}.hbadge.gold{background:linear-gradient(145deg,#ffc94d,#f08a00);}.hbadge.blue{background:linear-gradient(145deg,#5aa2ff,#2160e0);}.hbadge.purple{background:linear-gradient(145deg,#a58bff,#6a47ea);}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // make sure the icon font is loaded (the Tickets and Crypto pages had no icons before)
  if (!document.querySelector('link[href*="all.min.css"]')) {
    var fa = document.createElement('link'); fa.rel = 'stylesheet'; fa.href = '/CashHub/css/all.min.css?v=20261118c'; document.head.appendChild(fa);
  }

  var arrow = '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';
  var house = '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>';
  var bar = document.createElement('div'); bar.id = 'pBack';
  var a = document.createElement('a'); a.href = href;
  a.innerHTML = home ? house : arrow;
  a.appendChild(document.createTextNode(label));
  bar.appendChild(a); document.body.appendChild(bar);

  // icon badge in the hustle's page title
  var ICONS = {
    'cashgrab-tickets':  ['green',  'fa-ticket-alt'],
    'cashgrab-crypto':   ['gold',   'fa-chart-line'],
    'mymessage':         ['blue',   'fa-comments'],
    'cashgrab-database': ['purple', 'fa-database'],
    'cashgrab-qr':       ['green',  'fa-qrcode']
  };
  var key = p.split('/').pop(), ic = ICONS[key];
  if (ic) {
    var t = document.querySelector('.header h1, .header-title');
    if (t && !t.querySelector('.hbadge')) {
      var old = t.querySelector('i.fas'); if (old) old.remove();
      var b = document.createElement('span'); b.className = 'hbadge ' + ic[0];
      b.innerHTML = '<i class="fas ' + ic[1] + '"></i>';
      t.insertBefore(b, t.firstChild);
    }
  }
})();
