export const parseId = (id: string | number | undefined | null): number | null => {
  if (id === undefined || id === null) return null;
  const parsed = Number(id);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return null;
};
