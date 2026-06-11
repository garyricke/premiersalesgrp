/* ------------------------------------------------------------------ *
 * Central site configuration for Premier Sales Group.
 * Single source of truth for copy, contact details, lines, and FAQs.
 * ------------------------------------------------------------------ */

export const SITE = {
  name: 'Premier Sales Group',
  legalName: 'Premier Sales Group',
  shortName: 'Premier Sales',
  url: 'https://premiersalesgrp.com',
  domain: 'premiersalesgrp.com',
  tagline: 'The link between American wire manufacturers and the buyers who need them.',
  description:
    "Premier Sales Group is the independent manufacturers' representative firm led by Jason Foley, representing Unified Wire & Cable. Specialists in electrical wire & cable sourcing, competitive quoting, and account relationships.",
  founded: '2026',
  locale: 'en_US',
} as const;

export const PERSON = {
  name: 'Jason Foley',
  firstName: 'Jason',
  role: 'President',
  title: 'President, Premier Sales Group',
  email: 'jason.foley@premiersalesgrp.com',
  phone: '+1-847-826-6062',
  phoneDisplay: '(847) 826-6062',
  linkedin: 'https://www.linkedin.com/', // TODO: replace with Jason's LinkedIn URL
} as const;

/* ----- Cloudinary delivery ---------------------------------------- */
const CLOUD_NAME = 'dsbllwpbh';
const CLD_FOLDER = 'premiersalesgroup';
const CLD_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Build an optimized Cloudinary delivery URL.
 * Always applies f_auto (AVIF/WebP) and q_auto unless overridden.
 */
export function cld(
  id: string,
  transforms: string = '',
  ext: 'jpg' | 'png' = 'jpg'
): string {
  const base = 'f_auto,q_auto';
  const t = transforms ? `${base},${transforms}` : base;
  return `${CLD_BASE}/${t}/${CLD_FOLDER}/${id}.${ext}`;
}

export const MEDIA = {
  headshot: 'jason-foley-headshot',
  heroCable: 'hero-copper-cable',
  logoMonogram: 'logo-concept-monogram',
  logoPeak: 'logo-concept-peak',
  logoLink: 'logo-concept-link',
  logoBadge: 'logo-badge',
} as const;

/** Rasterized PNG of the peak badge (for email signatures — email can't render SVG). */
export function badgePng(size = 240): string {
  return `${CLD_BASE}/f_png,w_${size},h_${size},c_fit/${CLD_FOLDER}/${MEDIA.logoBadge}.png`;
}

/* Social / Open Graph share image: hero crop + branded overlay via Cloudinary. */
export const OG_IMAGE = `${CLD_BASE}/f_auto,q_auto,w_1200,h_630,c_fill,g_east/l_text:Arial_64_bold:Premier%20Sales%20Group,co_rgb:F4F1EC,g_west,x_80,y_-30/l_text:Arial_30:Wire%20%26%20Cable%20Representation,co_rgb:C8772E,g_west,x_82,y_40/${CLD_FOLDER}/${MEDIA.heroCable}.jpg`;

/* ----- Navigation -------------------------------------------------- */
export const NAV = [
  { label: 'About', href: '/#about' },
  { label: 'Lines', href: '/#lines' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Contact', href: '/#contact' },
] as const;

export const FOOTER_NAV = [
  { label: 'Brand Guide', href: '/brand' },
  { label: 'Logo Concepts', href: '/logo-concepts' },
  { label: 'Print & Outreach', href: '/print-assets' },
  { label: 'Status Log', href: '/status' },
] as const;

/* ----- Represented lines ------------------------------------------ */
export const LINES = [
  {
    name: 'Unified Wire & Cable',
    site: 'https://unifiedwire.com',
    siteLabel: 'unifiedwire.com',
    summary:
      'A U.S. manufacturer of electrical wire and cable, built on three generations of family ownership. Premier Sales Group represents Unified across its account base.',
    products: [
      'THHN / THWN-2 building wire',
      'Machine tool & appliance wire',
      'Stranded & solid bare copper',
      'Hook-up & lead wire',
      'Custom & specialty constructions',
      'Cut, striped & spooled to spec',
    ],
  },
] as const;

/* ----- Value props / approach ------------------------------------- */
export const APPROACH = [
  {
    title: 'Relationships first',
    body: 'Buying wire is a trust business. I show up, learn your build, and stay in your corner — not just when there is a PO on the table.',
  },
  {
    title: 'Sharp, fast quoting',
    body: 'Send me what you are buying today and I will come back with a clean, competitive quote — the kind that makes switching suppliers an easy yes.',
  },
  {
    title: 'A factory that listens',
    body: 'Representing a focused, family-run manufacturer means custom constructions and real answers — without the runaround of a national distributor.',
  },
  {
    title: 'The new generation',
    body: 'Premier Sales Group is built for how buyers actually work now: responsive, direct, and easy to do business with.',
  },
] as const;

/* ----- FAQ (drives AEO + FAQPage schema) -------------------------- */
export const FAQS = [
  {
    q: 'What is Premier Sales Group?',
    a: "Premier Sales Group is an independent manufacturers' representative firm led by Jason Foley. It represents wire and cable manufacturers — currently Unified Wire & Cable — connecting them with buyers and managing those account relationships.",
  },
  {
    q: 'What does a manufacturers’ representative do?',
    a: "A manufacturers' representative is an independent sales partner who sells a manufacturer's products to buyers within a territory or set of accounts. The rep is paid on commission, carries no inventory, and acts as the manufacturer's local relationship, quoting, and service contact.",
  },
  {
    q: 'What lines does Jason Foley represent?',
    a: 'Premier Sales Group currently represents Unified Wire & Cable, a U.S. manufacturer of electrical wire and cable. The firm is selectively growing its line card with complementary, non-competing manufacturers.',
  },
  {
    q: 'What products can I source through Premier Sales Group?',
    a: 'Through Unified Wire & Cable, Premier Sales Group can quote THHN/THWN-2 building wire, machine tool and appliance wire, bare copper, hook-up and lead wire, and custom constructions cut and spooled to specification.',
  },
  {
    q: 'How do I request a quote?',
    a: 'Send Jason the part numbers, specs, or a sample of what you are currently buying through the contact form on this site, or call (847) 826-6062. You will get a clean, competitive quote back quickly.',
  },
  {
    q: 'Where is Premier Sales Group located?',
    a: 'Premier Sales Group is based in the greater Chicago area and serves accounts across the United States.',
  },
] as const;
