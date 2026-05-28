// Tiny formatting helpers shared by components.

export function formatPrice(rub: number | null | undefined): string {
  if (typeof rub !== "number" || !Number.isFinite(rub)) return "по запросу";
  return rub.toLocaleString("ru-RU") + " ₽";
}
