export function recordToSelectData(
  record: Record<number, string>,
): { value: string; label: string }[] {
  return Object.entries(record).map(([id, name]) => ({
    value: id,
    label: name,
  }));
}

export function findRecordIdByName(
  record: Record<number, string>,
  name: string,
): number | undefined {
  const entry = Object.entries(record).find(([, label]) => label === name);

  return entry ? Number(entry[0]) : undefined;
}
