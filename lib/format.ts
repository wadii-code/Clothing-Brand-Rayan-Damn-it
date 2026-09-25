// Not Intl: server and browser ICU output can differ and cause hydration mismatches.
export function formatPrice(value: number): string {
  const rounded = Math.round(value);
  const grouped = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} DH`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Africa/Casablanca",
});

export function formatOrderDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function orderRef(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
