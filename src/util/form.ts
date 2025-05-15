export function getChangedFields<T>(original: T, updated: T) {
  const changed: Partial<typeof updated> = {};

  for (const key in updated) {
    if (updated[key] != original[key]) {
      changed[key] = updated[key];
    }
  }

  const isChanged = Object.values(changed).length > 0;

  return { isChanged, changed };
}
