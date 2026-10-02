# How to apply the canonical global shell

This package is a self-contained export of the canonical `SiteNav` Type 2
shell element. It is intended for a fresh coding agent that must make the same
shell behave in a Replit sandbox and in a Cloudflare-rendered/runtime
deployment. The component is a global navigation shell, not a page component:
mount one instance around the page router/layout so it is not duplicated by
individual pages.

## Source of truth

Use the files in this package as the export for slot
`sitenav_20260812_1800`:

- `component.tsx` is the executable, named `SiteNav` export. It has brand
  constants inlined and has no workspace alias imports.
- `declarations.json` is the visual/typography/colour/layout declaration,
  including the exact Google Fonts URL.
- `host-contract.json` is the integration contract: props, callbacks,
  self-managed inputs, mockup-only inputs, and host ownership notes.
- `GLOBAL_NAV_CAPSULE.md` is normative for theme and ambient-audio behaviour.
  Its requirements override implementation convenience.
- `probe-report.json` is the export's recorded Type 2 probe report. After
  copying the package, run the current probe against the local
  `component.tsx` and local `host-contract.json`; do not rewrite the canonical
  source or JSON files to make a probe result look different.

The component and all four JSON/contract files are export artifacts. Do not
reformat, regenerate, “improve”, or substitute them. Add application-specific
routing and page behaviour in the host/page layer, not in this package.

## Ownership and exact integration sequence

The host owns the global state and page ownership; `SiteNav` owns only its
visual shell state and local menu/dropdown interactions.

1. Load the font URL from `declarations.json` in the host document `<head>`
   before the shell mounts. Keep `display=block`; the component's
   `useLoadBrandFonts()` is intentionally a no-op compatibility shim.
2. Initialize shared theme state to `true` (dark).
3. Initialize shared audio intent to **on**, while accepting that browser
   policy can keep playback blocked.
4. Mount exactly one `SiteNav` in the global layout. Pass the host theme and
   audio state, and route both shell controls to host callbacks.
5. Derive `isMobile` from the viewport (the contract suggests `< 768px`);
   derive `scrollState` and `hidden` from the host scroll handler. Do not
   make pages mount their own nav.
6. Give each audio-capable detail page ownership of its audio engine. Before
   playback is permitted, register the page's toggle function with the host
   and listen for the first eligible user interaction to unlock audio.
7. On that first interaction, if the page has an ambient track, start it at
   silence and fade to the canonical level. Keep `audioPlaying` synchronized
   with actual playback, including failure, pause, and end transitions.
8. A page with no ambient track (including the homepage) must keep the global
   audio control in the layout and provide a defined inactive/unavailable
   response; it must not hide the control or change the nav geometry.
9. Verify the Cloudflare build and browser result using the checklist below.

A typical host wiring is:

```tsx
const audioToggleRef = useRef<(() => void) | null>(null);
const [audioPlaying, setAudioPlaying] = useState(false);
const [isDark, setIsDark] = useState(true);

<SiteNav
  isDark={isDark}
  onIsDarkChange={setIsDark}
  audioPlaying={audioPlaying}
  onAudioToggle={() => audioToggleRef.current?.()}
  scrollState={scrollState}
  isMobile={isMobile}
  hidden={navHidden}
/>
```

The host's callback registration/unregistration and first-interaction
unlocker are page/runtime concerns. Do not put an audio engine, autoplay
workaround, or page-specific media path into `component.tsx`.

## Props and ownership

All props are optional in TypeScript, but production ownership is strict:

| Prop | Owner and meaning |
| --- | --- |
| `isDark` | Host-controlled theme value. If supplied, it overrides the shell's internal dark state. |
| `onIsDarkChange` | Host theme setter; receives the next boolean when the canonical toggle is used. |
| `audioPlaying` | Host/page-reported actual playback state; drives speaker waves when supplied. |
| `onAudioToggle` | Host callback to the page's registered audio toggle function. |
| `hidden` | Host scroll-direction signal; slides the bar upward when true. |
| `scrollState` | Host/canvas bar appearance: `ghost`, `veil`, `soft`, or `glass`; default `soft`. |
| `isMobile` | Host breakpoint flag; suggested breakpoint is `< 768px`; default `false`. |
| `isTablet` | Reserved flag accepted by the contract; currently unused by layout logic. |
| `defaultMenuOpen` | Initial menu state for canvas/testing; production must keep it `false`. |
| `overlayItemStyle` | Mockup/canvas-only mobile overlay item override. |
| `overlayGlass` | Mockup/canvas-only mobile overlay background/blur override. |
| `wordmarkFont` | Canvas A/B option (`ss4` or `raleway`); production is locked to `raleway`. |
| `wordmarkTracking` | Canvas comparison override; production uses the canonical `0.30em`. |

The shell's internal dark state defaults to dark only when `isDark` is omitted.
For a production global theme, always pass the shared `isDark` value and
`onIsDarkChange={setIsDark}`. The toggle remains visible and canonical; do not
remove, relocate, reinterpret, or conditionally redesign it.

## Controls and responsive navigation

The canonical nav contains NORWAY, EXPLORE, THE CABIN, and ACTIVITIES. On
desktop/tablet it renders the wordmark, centre nav, audio control, theme
control, and language selector. The language list is EN, NO, DE, FR, and NL;
only EN is interactive at launch and the other codes remain rendered but
non-interactive. Implement additional locale routing only when explicitly
launched.

On mobile, the hamburger opens the full-screen overlay, where the navigation,
inline EXPLORE clusters, languages, wordmark, audio control, and theme control
are presented. EXPLORE is an inline expandable section on mobile. On
desktop/tablet it is a hover/click dropdown with a transparent fixed
click-dismiss backdrop at z-index 998; the bar is z-index 1000 and its panel
is z-index 999. The shell uses the four scroll appearances and can hide on
scroll direction. Preserve these responsive and z-index relationships.

## Audio contract in detail

The speaker icon is a visual/control bridge, not an audio player. It emits
`onAudioToggle` and reflects `audioPlaying` supplied by the host; the page
owns the `HTMLMediaElement`/Web Audio engine, unlock handling, fade, volume,
and lifecycle. Intent starts ON globally even if autoplay is initially
blocked. The first eligible user interaction is the unlock boundary:
start an available waterfall ambient track from silence and fade it smoothly
to the canonical level. Never start abruptly merely because a component
mounted. Keep the reported state tied to real playback rather than to a
button click alone. When no track exists, leave the control present and
return the host's defined inactive/unavailable result.

## Fonts, tokens, and global CSS assumptions

The host must preload/load these families before mount, using the exact URL in
`declarations.json` and `display=block`: Source Serif 4, Source Sans 3, IBM
Plex Mono, and Raleway. The component uses explicit fallbacks:
`'Source Serif 4', Georgia, serif`; `'Source Sans 3', system-ui, sans-serif`;
`'IBM Plex Mono', monospace`; and `'Raleway', system-ui, sans-serif`.
Source Serif 4 optical sizing is expressed through
`fontVariationSettings`, not `font-optical-sizing`. The root applies
antialiased WebKit and grayscale macOS font smoothing.

The canonical dark tokens are `#1A1714` background, `#222120` surface,
`#2C2A28` rule, `#6E6A65` muted, `#C4BEB4` body, `#EDE9E2` heading,
`#7A8B74` blockquote, and `#D43535` accent. Glass is
`rgba(19, 20, 22, 0.48)` and the overlay is
`rgba(19, 20, 22, 0.93)`. These are inlined by design; do not replace them
with CSS-variable colours or `currentColor`/`inherit` shortcuts.

The component supplies its own inline layout and fixed positioning. The host
must provide a normal browser document, avoid a parent transform that changes
fixed-position containing-block behaviour, and account for the 56px desktop
or 68px mobile bar where page content needs an offset. Cloudflare must serve
the font request and application CSS without rewriting the component's
inline styles. No page-specific local image, audio, or video asset path
belongs in this Type 2 shell.

## Cloudflare verification checklist

- Confirm the package is copied as one self-contained unit and only the named
  `SiteNav` export is imported; no `@/...` alias or Replit-only runtime import
  remains.
- Confirm fonts load from the exact `declarations.json` URL in the deployed
  `<head>`, with `display=block`, before first shell paint.
- Confirm the Cloudflare build can type-check and render the component, and
  that browser-only work occurs after mount (the component's resize listener
  is in `useEffect`).
- Confirm exactly one shell mounts for every route and that page hosts own
  theme/audio state rather than duplicating controls.
- Confirm dark is the first rendered theme, the toggle is always available,
  and theme changes round-trip through `onIsDarkChange`.
- Confirm an eligible first interaction unlocks audio, waterfall audio fades
  from silence, `audioPlaying` tracks real playback, and no-audio pages keep a
  defined visible control response.
- Confirm desktop/tablet dropdown dismissal uses the supplied backdrop rather
  than a document-level interaction listener; preserve z-index 998/999/1000.
- Run `protocol/probe_type2_shell_element_20260620.py` against this package's
  `component.tsx` with `--contract` pointing to this package's
  `host-contract.json`; the result must have zero RED flags and zero
  WARNINGS.
- Check the production browser at narrow and wide widths, scroll transitions,
  mobile overlay, language menu, theme toggle, and audio unlock/fade path.

## Strict non-inference rules

Do not infer a route, locale, audio asset, autoplay permission, page type,
theme exception, breakpoint change, font substitution, token change, hidden
prop, or alternate ownership model from a missing value or a convenient
implementation. Do not hide or disable global controls because a page lacks
media, because Cloudflare is server-rendering, or because a browser blocks
autoplay. Do not add document-level user-interaction listeners, duplicate the
shell, wire page navigation inside this component, or convert mockup-only
props into production behaviour. If a requirement conflicts with the host
application, stop and obtain explicit human approval; never silently invent
an exception.