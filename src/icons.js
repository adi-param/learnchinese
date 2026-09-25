// Interface artwork as inline SVG, so the chrome looks the same on every device (emoji are kept for word pictures).
const paths={
 words:'<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5h-5A1.5 1.5 0 0 1 3 16z"/><path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5h5a1.5 1.5 0 0 0 1.5-1.5z"/>',
 cards:'<rect x="3.5" y="6.5" width="12" height="15" rx="2.5"/><path d="M8.5 3.5h9a3 3 0 0 1 3 3v11"/>',
 match:'<rect x="2.5" y="6.5" width="8" height="11" rx="2.5"/><rect x="13.5" y="6.5" width="8" height="11" rx="2.5"/><path d="M10.5 12h3"/>',
 build:'<rect x="4" y="3.5" width="16" height="13" rx="4"/><path d="M4 10.5h16"/><path d="M8 16.5 6 20.5M16 16.5l2 4"/><circle cx="8.5" cy="13.5" r=".6" fill="currentColor"/><circle cx="15.5" cy="13.5" r=".6" fill="currentColor"/>',
 speaker:'<path d="M11 5 6.5 9H3.5v6h3L11 19z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
 star:'<path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3 1.1-6.4-4.6-4.5 6.4-.9z" fill="currentColor" stroke-linejoin="round"/>',
 left:'<path d="m14.5 18-6-6 6-6"/>',
 right:'<path d="m9.5 18 6-6-6-6"/>',
 check:'<path d="M20 6.5 9.5 17 4 11.5"/>',
 again:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
 shuffle:'<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/>',
 flag:'<path d="M5 21V4"/><path d="M5 4h12l-2.5 4 2.5 4H5" fill="currentColor"/>',
 grownups:'<circle cx="9" cy="7.5" r="3.5"/><path d="M2.5 20.5v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1"/><path d="M16 4.2a3.5 3.5 0 0 1 0 6.6"/><path d="M21.5 20.5v-1a5 5 0 0 0-3.5-4.8"/>',
 chevron:'<path d="m6 9 6 6 6-6"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'
};
export const icon=(name,cls='icon')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

// The panda guide. Moods change only the eyes and mouth, so it always reads as the same friend.
export function mascot(mood='happy',cls='mascot'){
 const eyes=mood==='sleep'
  ?'<path d="M37 55q5 4 10 0M73 55q5 4 10 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>'
  :'<circle cx="43" cy="54" r="5.5" fill="#fff"/><circle cx="77" cy="54" r="5.5" fill="#fff"/><circle cx="44.5" cy="52.5" r="2" fill="#1f1b3a"/><circle cx="78.5" cy="52.5" r="2" fill="#1f1b3a"/>';
 const mouth=mood==='cheer'
  ?'<path d="M50 74q10 12 20 0z" fill="#1f1b3a"/><path d="M55 79q5 3 10 0" fill="#ff8a8a"/>'
  :mood==='sleep'?'<path d="M55 76q5 3 10 0" stroke="#1f1b3a" stroke-width="3" fill="none" stroke-linecap="round"/>'
  :'<path d="M52 74q8 8 16 0" stroke="#1f1b3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>';
 const extra=mood==='sleep'?'<text x="96" y="30" font-size="16" font-weight="700" fill="#7c5cff" font-family="Fredoka,sans-serif">z</text><text x="106" y="18" font-size="11" font-weight="700" fill="#7c5cff" font-family="Fredoka,sans-serif">z</text>':'';
 return `<svg class="${cls}" viewBox="0 0 120 110" aria-hidden="true"><circle cx="26" cy="26" r="17" fill="#1f1b3a"/><circle cx="94" cy="26" r="17" fill="#1f1b3a"/><circle cx="26" cy="26" r="8" fill="#3a3460"/><circle cx="94" cy="26" r="8" fill="#3a3460"/><ellipse cx="60" cy="60" rx="46" ry="42" fill="#fff" stroke="#1f1b3a" stroke-width="3"/><ellipse cx="42" cy="55" rx="12" ry="14" fill="#1f1b3a" transform="rotate(-20 42 55)"/><ellipse cx="78" cy="55" rx="12" ry="14" fill="#1f1b3a" transform="rotate(20 78 55)"/>${eyes}<ellipse cx="60" cy="67" rx="6" ry="4.5" fill="#1f1b3a"/>${mouth}<circle cx="30" cy="72" r="6" fill="#ffb3c1" opacity=".8"/><circle cx="90" cy="72" r="6" fill="#ffb3c1" opacity=".8"/>${extra}</svg>`;
}
