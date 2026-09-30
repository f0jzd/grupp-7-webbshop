// adapted from (2024) https://jsdev.space/snippets/debounce-ts/
export function debounce<T extends unknown[], U>(
  callback: (...args: T) => U,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

export function isValidRegExp(pattern: string): boolean {
  try {
    RegExp(pattern);
  } catch {
    return false;
  }
  return true;
}

export function createUrlSearchParams(searchParams: {
  [key: string]: string | undefined;
}): URLSearchParams {
  const urlParams = new URLSearchParams();
  Object.entries(searchParams).map((entry) => {
    const [key, value] = entry;
    if (value) {
      urlParams.set(key, value);
    }
  });
  return urlParams;
}


// a searchparam handler for the catalog page:
// args are current state of searchparams and desired overrides
// returns a merged state, i.e. retains non-overridden values
// also drops page=1 which is default elsewhere
export function buildHref(
  originalState: Record<string, string | undefined>,
  newState: Record<string, string | number | undefined>
): string {
  const params = new URLSearchParams();
  const merged = { ...originalState, ...newState };

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && Number(value) === 1) continue; // keep page=1 out of the URL
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "?"; // i hate manual string building
}