export function getProductIdsFromProductLines(
  lines: ({ productId: number } & Record<string, any>)[],
) {
  return [...new Set(lines.map((line) => line.productId))];
}

export function getProductIdsFromOrderProductLines(
  lines: ({ productManId: number; productBuyId: number } & Record<
    string,
    any
  >)[],
) {
  const productManIds = lines.map((line) => line.productManId);
  const productBuyIds = lines.map((line) => line.productBuyId);
  return [...new Set([...productManIds, ...productBuyIds])];
}

export function getServiceIdsFromServiceLines(
  lines: ({ serviceId: number } & Record<string, any>)[],
) {
  return [...new Set(lines.map((line) => line.serviceId))];
}
