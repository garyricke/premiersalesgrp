/**
 * Site-wide password gate for the private preview.
 *
 * Serves a simple, branded single-password page. On success it sets a cookie
 * and lets the visitor through. Runs server-side on Netlify's edge, so page
 * source is not exposed until unlocked.
 *
 * Password resolves from the SITE_PASSWORD environment variable, falling back
 * to a default. To keep the real password out of the public repo, set
 * SITE_PASSWORD in Netlify -> Site settings -> Environment variables.
 *
 * To remove the gate at launch: delete this file (and the netlify/ dir).
 *
 * NOTE: HTTP header values must be ASCII/Latin-1 only.
 */
const FALLBACK_PASSWORD = 'imwired';
const COOKIE = 'psg_preview';
const LOGIN_PATH = '/__preview-login';
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function getPassword() {
  try {
    if (
      typeof Netlify !== 'undefined' &&
      Netlify.env &&
      typeof Netlify.env.get === 'function'
    ) {
      const v = Netlify.env.get('SITE_PASSWORD');
      if (v) return v;
    }
  } catch (_) {
    /* fall through to default */
  }
  return FALLBACK_PASSWORD;
}

/** Stable, non-reversible cookie token so the raw password isn't stored. */
async function tokenFor(password) {
  const data = new TextEncoder().encode('psg::' + password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hasValidCookie(request, token) {
  const cookie = request.headers.get('cookie') || '';
  return cookie
    .split(';')
    .some((c) => c.trim() === `${COOKIE}=${token}`);
}

function loginPage(error) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Premier Sales Group - Private Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Spline+Sans+Mono:wght@400&display=swap" rel="stylesheet" />
<style>
  :root{--charcoal:#161618;--ink:#0b0f14;--card:#1d1d20;--line:#34343a;--copper:#c8772e;--copperb:#e0903f;--bone:#f4f1ec;--mute:#9b958b}
  *{box-sizing:border-box;margin:0}
  body{min-height:100vh;display:grid;place-items:center;padding:1.5rem;
    font-family:'Spline Sans Mono',ui-monospace,monospace;color:var(--bone);
    background:var(--charcoal);
    background-image:radial-gradient(900px 600px at 80% -10%,rgba(200,119,46,.14),transparent 60%),radial-gradient(700px 500px at -10% 110%,rgba(200,119,46,.07),transparent 55%);}
  .card{width:100%;max-width:420px;background:linear-gradient(180deg,rgba(244,241,236,.04),rgba(244,241,236,.01));
    border:1px solid var(--line);border-radius:14px;padding:2.5rem 2rem;text-align:center;
    box-shadow:0 40px 80px -40px rgba(0,0,0,.7)}
  svg{margin-bottom:1.25rem}
  .name{font-family:'Archivo',system-ui,sans-serif;font-weight:700;font-size:1.05rem;letter-spacing:.02em}
  .sub{font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--copperb);margin-top:.4rem}
  h1{font-family:'Fraunces',serif;font-weight:400;font-size:1.7rem;line-height:1.1;margin:1.6rem 0 .5rem}
  p.lead{color:var(--mute);font-size:.82rem;line-height:1.5;margin-bottom:1.6rem}
  form{display:flex;flex-direction:column;gap:.75rem}
  input{width:100%;font:inherit;font-size:1rem;color:var(--bone);background:var(--ink);
    border:1px solid var(--line);border-radius:6px;padding:.85rem .95rem;text-align:center;letter-spacing:.1em}
  input::placeholder{color:var(--mute);letter-spacing:.02em}
  input:focus{outline:none;border-color:var(--copper);box-shadow:0 0 0 3px rgba(200,119,46,.18)}
  button{font-family:'Archivo',system-ui,sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.1em;
    text-transform:uppercase;color:var(--ink);background:var(--copper);border:0;border-radius:6px;
    padding:.95rem;cursor:pointer;transition:background .2s}
  button:hover{background:var(--copperb)}
  .err{color:#e8897c;font-size:.78rem;min-height:1.1rem;margin-top:.1rem}
  .foot{margin-top:1.6rem;font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}
</style>
</head>
<body>
  <main class="card">
    <svg viewBox="0 0 48 48" width="52" height="52" aria-hidden="true">
      <path d="M5 35 L24 11 L43 35" fill="none" stroke="#c8772e" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13 37 L24 23 L35 37" fill="none" stroke="#e0903f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      <circle cx="24" cy="40.5" r="2.4" fill="#e0903f"/>
    </svg>
    <div class="name">Premier Sales Group</div>
    <div class="sub">Wire &amp; Cable Representation</div>
    <h1>Private preview</h1>
    <p class="lead">This site is not public yet. Enter the password to take a look.</p>
    <form method="POST" action="${LOGIN_PATH}">
      <input type="password" name="password" placeholder="Password" autocomplete="current-password" autofocus required aria-label="Password" />
      <div class="err">${error ? 'Incorrect password. Try again.' : ''}</div>
      <button type="submit">Enter</button>
    </form>
    <div class="foot">I'm wired for this.</div>
  </main>
</body>
</html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export default async (request, context) => {
  const url = new URL(request.url);
  const password = getPassword();
  const token = await tokenFor(password);

  // Already unlocked.
  if (hasValidCookie(request, token)) {
    return context.next();
  }

  // Handle the login submission.
  if (request.method === 'POST' && url.pathname === LOGIN_PATH) {
    let tried = '';
    try {
      const form = await request.formData();
      tried = (form.get('password') || '').toString();
    } catch (_) {
      tried = '';
    }
    if (tried === password) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
          'Cache-Control': 'no-store',
        },
      });
    }
    return loginPage(true);
  }

  // Everything else: show the gate.
  return loginPage(false);
};

export const config = { path: '/*' };
