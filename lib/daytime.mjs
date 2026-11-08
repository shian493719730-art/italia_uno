// Time of day for the café: drives the header clock icon and scene lighting.
export const PHASES = ['dawn', 'day', 'dusk', 'night'];
export function phaseFor(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
}
// The page sets <html data-daytime="…">; drawings read it each frame.
export function currentPhase() {
  const set = typeof document !== 'undefined' && document.documentElement.dataset.daytime;
  return PHASES.includes(set) ? set : phaseFor();
}
