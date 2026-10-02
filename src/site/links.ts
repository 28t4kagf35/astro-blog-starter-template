// Where a named link goes. Page copy names its links in words ("Observe",
// "Hiking", "The cabin"); this table turns the words into addresses.
// A word with no entry stays plain text, because there is no page for it yet.
const TARGETS: Record<string, string> = {
  "master guide": "/explore/waterfalls",
  "waterfalls master guide": "/explore/waterfalls",
  "all waterfalls": "/explore/waterfalls",
  "the waterfalls": "/explore/waterfalls",
  "waterfalls": "/explore/waterfalls",
  "waterfalls on the route": "/explore/waterfalls",
  "observe": "/explore/nature/observe",
  "hiking": "/activities/kiellandbu", // Activities launches with Kiellandbu only
  "activities": "/activities/kiellandbu",
  "the cabin": "/cabin",
  "cabin": "/cabin",
  "see the cabin": "/cabin",
  "culture & history": "/explore/culture-history",
};

export const hrefFor = (label?: string | null): string | undefined =>
  label ? TARGETS[label.trim().toLowerCase()] : undefined;
