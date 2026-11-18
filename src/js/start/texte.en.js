/* All English texts of the home page, in American spelling and sentence case.
   Same keys as texte.de.js (German is the source language); `node tools/texte-pruefen.mjs` checks that.
   {name}, {n}, {mode}, {mail} are placeholders. The page sets capitals itself; write normal case here. */
export default {
  nav: { home: 'Back to top', chapters: 'Chapters', code: 'Code', photo: 'Photography', contact: 'Contact' },
  plain: { title: 'Code and photography' },
  count: {
    apps: { one: '{n} app', other: '{n} apps' },
    images: { one: '{n} image', other: '{n} images' },
    series: { one: 'Photo series · {n} image', other: 'Photo series · {n} images' }
  },
  scene: {
    route: { stops: ['Day 1 · Departure', 'Day 2 · City', 'Day 4 · Coast', 'Day 6 · Home'] },
    balance: { note: 'Sample figures' },
    orbit: { day: 'Day {n}' }
  },
  detail: { open: 'View {name}', back: 'Back' },
  status: { beta: 'Beta', live: 'Available' },
  store: { beta: 'Beta on Google Play', live: 'Get it on Google Play' },
  contact: { title: 'Say hello.' },
  form: {
    name: 'Name',
    email: 'Email',
    emailError: 'Please enter a valid email address.',
    message: 'Message',
    error: 'Please write briefly what it is about.',
    send: 'Send message',
    note: 'I use your details only to answer you.',
    done: 'Thanks, your message has arrived.',
    doneHint: 'I will get back to you by email.',
    failed: 'Sending did not work. Try again or write to {mail}.'
  },
  quick: { github: 'GitHub', instagram: 'Instagram', coffee: 'Buy me a coffee' },
  theme: {
    button: 'Color: {mode}',
    label: 'Color scheme, active: {mode}. Tap to switch.',
    system: 'System', light: 'Light', dark: 'Dark'
  },
  legal: {
    imprint: { label: 'Legal notice', path: '/legal-notice' },
    site: { label: 'Privacy', path: '/privacy' },
    privacy: { label: 'Privacy', slug: 'privacy' },
    terms: { label: 'Terms', slug: 'terms' }
  },
  apps: {
    travelflow: { kind: 'App · Travel', desc: 'Your guide to planning and making trips.',
      facts: ['Itinerary as a timeline', 'Place search and flights built in', 'Built for the phone'] },
    saldo: { kind: 'App · Finance', desc: 'Your own finances, on your own server.',
      facts: ['Runs on your own server', 'Read-only bank sync', 'Sign-in with a passkey'] },
    '1000days': { kind: 'App · Habits', desc: 'Habits turn into your own universe.',
      facts: ['Every habit helps build your own universe'] }
  },
  serien: {
    meer: { name: 'Sea', shots: { surf: 'Surf', cliff: 'Cliffs', jelly: 'Jellyfish', palm: 'Evening light' } },
    wueste: { name: 'Desert', shots: { desert: 'Red rock', road: 'Empty road', ram: 'Bighorn sheep', cactus: 'Cacti' } },
    unterwegs: { name: 'On the road', shots: { lantern: 'Lanterns', shrine: 'Shrine', neon: 'Neon', window: 'Window seat' } }
  }
};
