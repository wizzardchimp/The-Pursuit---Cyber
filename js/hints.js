/* Pursuit hint system
   - A "?" button on every game page opens a hint sheet for the player's current stage.
   - Hints go from a gentle nudge to near-answer. Each hint revealed is COUNTED so the
     facilitator can ask "how many hints did you use?" and adjust times if they want.
   - The count is kept on the player's phone and reset when the entry passphrase is accepted.
   To change wording, edit STAGES below. Nothing else needs touching. */
(function () {
  'use strict';

  var STORE = 'pursuit-hints-v1';

  /* ── HINT TEXT (edit freely) ───────────────────────────────── */
  var STAGES = {
    login: { title: 'AutoStore login', hints: [
      "Marcus's profile is on the main screen. Re-read what he told the Inspector about his lunch.",
      "The password is three words joined by full stops.",
      "He was claiming for his Nandos, with Spicy and a tango. Try nandos.spicy.tango"
    ]},
    home: { title: 'AutoStore home', hints: [
      "Marcus keeps things in more than one place. Which tiles haven't you opened yet?",
      "Personal Drive is locked with a PIN. His notes say where the PIN was sent.",
      "myMail reveals the PIN once you've correctly sorted the genuine emails from the phishing ones.",
      "Open every note in the Notes app and tap the photos to enlarge them. The oldest note has a photo of a lock with three digits for the canvas bag."
    ]},
    mail: { title: 'myMail assessment', hints: [
      "Open Details and read the real sender address, not just the display name.",
      "Tap a link to preview where it really goes. Read the domain from right to left.",
      "Warning signs: urgency, threats, \"Dear Customer\", and requests for money, gift cards or passwords.",
      "Read attachment names to the end. \"invoice.pdf.html\" is not a PDF."
    ]},
    drivepin: { title: 'Personal Drive PIN', hints: [
      "You need a 4-digit PIN. Marcus was sent it by email.",
      "Complete the email assessment in myMail to reveal the PIN."
    ]},
    drive: { title: 'Personal Drive', hints: [
      "Look for a tile that looks like an app, and another that helps with a crossword.",
      "The Crossword Helper gives you the answers to the paper crossword, one clue at a time.",
      "CashGrab Hub is the app Marcus uses. You will need a username and a password for it."
    ]},
    crossword: { title: 'Crossword helper', hints: [
      "The helper reveals the answers to your paper crossword, one clue at a time.",
      "Completing the crossword gives you something to type into CashGrab Hub.",
      "That gives you the username. For the password, look in the coded tumbler in your evidence bag and use the UV light.",
      "The tumbler opens with the same 4-digit PIN you found in myMail."
    ]},
    cglogin: { title: 'CashGrab Hub login', hints: [
      "The username comes from the crossword.",
      "The password is hidden in your evidence bag: the coded tumbler, and the UV light.",
      "The tumbler opens with the 4-digit PIN you found in myMail.",
      "\"Forgot password\" is a dead end. Ignore it."
    ]},
    cghub: { title: 'CashGrab Hub', hints: [
      "The final-code page in the canvas bag asks three questions about this hub.",
      "You need: who has the lowest returns on crypto, how many ticket listings are still LIVE, and the last three digits of the bank account in the messages.",
      "Put the answers together with no spaces: a name, then a number, then three digits.",
      "Type the finished code into the submission portal on the main screen."
    ]},
    cgtickets: { title: 'CashGrab tickets', hints: [
      "Count only the listings that are still Listed, not the ones marked Sold.",
      "That number is one part of the final code."
    ]},
    cgcrypto: { title: 'CashGrab crypto', hints: [
      "Look at each investor's return percentage.",
      "You need the name of the investor with the LOWEST return."
    ]},
    cgmessages: { title: 'CashGrab messages', hints: [
      "Look for a message that gives out bank details: a sort code and an account number.",
      "You need only the last three digits of the account number."
    ]},
    sidearea: { title: 'AutoStore', hints: [
      "Not every section holds a puzzle. Which parts of the app haven't you opened yet?",
      "Marcus leaves his most useful clues in myMail, Notes and the Personal Drive."
    ]}
  };

  /* ── WHICH STAGE AM I ON? ─────────────────────────────────── */
  function stageKey() {
    var p = location.pathname.toLowerCase().replace(/\.html$/, '');
    if (/as_login$/.test(p)) return 'login';
    if (/as_home$/.test(p)) return 'home';
    if (/as_mail$/.test(p)) return 'mail';
    if (/as_drive$/.test(p)) {
      try { return sessionStorage.getItem('driveUnlocked') === 'true' ? 'drive' : 'drivepin'; } catch (e) { return 'drivepin'; }
    }
    if (/crossword-helper$/.test(p)) return 'crossword';
    if (/as_(stock|finance|hr)$/.test(p)) return 'sidearea';
    if (/cashgrab-login$|forgotlogin$/.test(p)) return 'cglogin';
    if (/cashgrab-tickets$/.test(p)) return 'cgtickets';
    if (/cashgrab-crypto$/.test(p)) return 'cgcrypto';
    if (/mymessage$/.test(p)) return 'cgmessages';
    if (/cashgrab/.test(p)) return 'cghub';
    return null;
  }

  /* ── STORAGE (per phone) ──────────────────────────────────── */
  function load() {
    try { var s = JSON.parse(localStorage.getItem(STORE) || '{}'); return { shown: s.shown || {} }; }
    catch (e) { return { shown: {} }; }
  }
  function save(d) { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {} }
  function total(d) { var n = 0; for (var k in d.shown) n += d.shown[k]; return n; }

  var key = stageKey();
  if (!key) return;
  var stage = STAGES[key];
  var data = load();

  /* ── UI ───────────────────────────────────────────────────── */
  var css = ''
    + '#pHintBtn{position:fixed;right:14px;bottom:84px;z-index:800;width:50px;height:50px;border-radius:50%;border:2px solid #1e8fff;background:#0c1829;color:#7fd0ff;font:700 24px/1 -apple-system,"Exo 2",sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.45);cursor:pointer;-webkit-tap-highlight-color:transparent;padding:0}'
    + '#pHintBtn:active{transform:scale(.94)}'
    + '#pHintBtn .b{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#ffb020;color:#1a1200;font:700 12px/20px -apple-system,sans-serif;padding:0 5px;text-align:center}'
    + '#pHintBg{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:5200;display:none}'
    + '#pHintBg.show{display:block}'
    + '#pHint{position:fixed;left:0;right:0;bottom:0;z-index:5201;max-width:480px;margin:0 auto;background:#0c1829;color:#e8f4ff;border:1px solid rgba(30,143,255,.35);border-bottom:none;border-radius:18px 18px 0 0;padding:16px 18px 20px;max-height:80vh;overflow:auto;transform:translateY(105%);transition:transform .22s ease;font-family:-apple-system,"Exo 2",Helvetica,Arial,sans-serif;box-shadow:0 -10px 40px rgba(0,0,0,.6)}'
    + '#pHint.show{transform:translateY(0)}'
    + '#pHint .g{width:38px;height:5px;border-radius:3px;background:rgba(255,255,255,.25);margin:0 auto 12px}'
    + '#pHint h2{font-size:18px;margin:0 0 2px;letter-spacing:.02em}'
    + '#pHint .sub{font-size:13px;color:rgba(232,244,255,.6);margin-bottom:12px}'
    + '#pHint .used{font-size:12.5px;color:#ffb020;margin-bottom:12px}'
    + '#pHint .card{background:rgba(30,143,255,.1);border-left:3px solid #1e8fff;border-radius:8px;padding:11px 13px;margin-bottom:9px;font-size:15px;line-height:1.5}'
    + '#pHint .card small{display:block;color:rgba(232,244,255,.5);font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px}'
    + '#pHint button.act{width:100%;padding:13px;border-radius:10px;border:1px solid #1e8fff;background:#1e8fff;color:#04101f;font:700 15px -apple-system,"Exo 2",sans-serif;cursor:pointer;margin-top:4px}'
    + '#pHint button.act.confirm{background:#ffb020;border-color:#ffb020}'
    + '#pHint button.act:disabled{opacity:.45;cursor:default}'
    + '#pHint button.close{width:100%;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#e8f4ff;font:600 15px -apple-system,"Exo 2",sans-serif;cursor:pointer;margin-top:8px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement('button');
  btn.id = 'pHintBtn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Need a hint?'); btn.textContent = '?';
  var badge = document.createElement('span'); badge.className = 'b'; btn.appendChild(badge);
  var bg = document.createElement('div'); bg.id = 'pHintBg';
  var sheet = document.createElement('div'); sheet.id = 'pHint'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Hints');
  document.body.appendChild(btn); document.body.appendChild(bg); document.body.appendChild(sheet);

  function updateBadge() { var n = total(data); badge.textContent = n; badge.style.display = n ? 'block' : 'none'; }

  var confirming = false, confirmTimer = null;
  function render() {
    var shown = data.shown[key] || 0, max = stage.hints.length;
    sheet.textContent = '';
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
    sheet.appendChild(el('div', 'g'));
    sheet.appendChild(el('h2', '', 'Need a hint?'));
    sheet.appendChild(el('div', 'sub', stage.title));
    sheet.appendChild(el('div', 'used', 'Hints used so far: ' + total(data) + '. Each one you reveal is counted, so tell your facilitator at the end.'));
    for (var i = 0; i < shown; i++) {
      var c = el('div', 'card'); c.appendChild(el('small', '', 'Hint ' + (i + 1) + ' of ' + max)); c.appendChild(document.createTextNode(stage.hints[i])); sheet.appendChild(c);
    }
    var act = el('button', 'act' + (confirming ? ' confirm' : ''));
    act.type = 'button';
    if (shown >= max) { act.textContent = 'No more hints for this stage'; act.disabled = true; }
    else act.textContent = confirming ? 'Tap again to confirm' : (shown === 0 ? 'Reveal a hint' : 'Reveal the next hint');
    act.addEventListener('click', function () {
      if (!confirming) { confirming = true; render(); clearTimeout(confirmTimer); confirmTimer = setTimeout(function () { confirming = false; render(); }, 3500); return; }
      confirming = false; clearTimeout(confirmTimer);
      data.shown[key] = (data.shown[key] || 0) + 1; save(data); updateBadge(); render();
    });
    sheet.appendChild(act);
    var cl = el('button', 'close', 'Close'); cl.type = 'button'; cl.addEventListener('click', close); sheet.appendChild(cl);
  }
  function open() {
    // Work out the stage again now: the Personal Drive unlocks without reloading the page
    key = stageKey() || key; stage = STAGES[key];
    data = load(); confirming = false; render(); bg.classList.add('show'); void sheet.offsetWidth; sheet.classList.add('show');
  }
  function close() { confirming = false; clearTimeout(confirmTimer); sheet.classList.remove('show'); bg.classList.remove('show'); }
  btn.addEventListener('click', open);
  bg.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  updateBadge();
})();
