/**
 * Site-wide password gate for the private preview.
 *
 * Runs server-side on Netlify's edge for every request, so page source is not
 * viewable until authenticated (a true gate, not a JS overlay).
 *
 * Password resolves from the SITE_PASSWORD environment variable, falling back
 * to a default for convenience. To keep the real password out of the public
 * repo, set SITE_PASSWORD in Netlify → Site settings → Environment variables.
 *
 * To remove the gate at launch: delete this file (and the netlify/ dir).
 *
 * Login: any username, password below.
 */
export default async (request, context) => {
  const PASSWORD = Netlify.env.get('SITE_PASSWORD') || 'imwired';

  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try {
      decoded = atob(encoded);
    } catch {
      decoded = '';
    }
    const sep = decoded.indexOf(':');
    const pass = sep === -1 ? '' : decoded.slice(sep + 1);
    if (pass === PASSWORD) {
      return context.next();
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate':
        'Basic realm="Premier Sales Group — Private Preview", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};

export const config = { path: '/*' };
