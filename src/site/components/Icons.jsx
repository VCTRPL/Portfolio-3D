const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }

export const MailIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></svg>
)
export const GithubIcon = (p) => (
  <svg {...base} {...p}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
)
export const LinkedinIcon = (p) => (
  <svg {...base} {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
)
export const WhatsappIcon = (p) => (
  <svg {...base} {...p}><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3L3 21Z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .6a4 4 0 0 1-1.9-1.9l.6-1-1-2L9 9.5Z" /></svg>
)
export const DownloadIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 20h16" /></svg>
)
export const ArrowIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14m0 0-6-6m6 6-6 6" /></svg>
)
export const ExternalIcon = (p) => (
  <svg {...base} width={16} height={16} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
)
export const MenuIcon = ({ open, ...p }) => (
  <svg {...base} {...p}>{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
)

export const ICONS = { email: MailIcon, github: GithubIcon, linkedin: LinkedinIcon, whatsapp: WhatsappIcon }
