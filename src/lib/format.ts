export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function lecturePath(slug: string) {
  return `/lectures/${slug}/`;
}

export const EXAM_PATH = "/exam/";
export const DIFFICULT_PATH = "/difficult/";
export const EXPECTED_PATH = "/expected/";
