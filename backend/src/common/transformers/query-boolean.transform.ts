export function transformQueryBoolean({
  value,
}: {
  value: unknown;
}): boolean | undefined {
  if (value === 'true' || value === true) {
    return true;
  }

  if (value === 'false' || value === false) {
    return false;
  }

  return value as boolean | undefined;
}
