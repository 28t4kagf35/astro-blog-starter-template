// A link that covers its whole card. The card must be position: relative.
// Renders nothing when the card has no target yet.
export function Stretch({ href, label }: { href?: string; label: string }) {
  if (!href) return null;
  return <a href={href} aria-label={label} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 4 }} />;
}
