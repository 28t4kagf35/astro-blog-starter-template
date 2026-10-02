# Global navigation must-have behaviour

Status: normative

This capsule governs every production assembly of the canonical `SiteNav`.
These behaviours are requirements, not implementation choices.

## Theme

- Dark mode is the default on every page.
- The Dark/Light toggle is always visible and uses the canonical SiteNav control.
- SiteNav emits theme changes through `onIsDarkChange`; the host owns and applies
  the shared page theme state.
- Do not remove, relocate, reinterpret, or conditionally redesign the toggle.

## Ambient audio

- Audio begins in the intended **ON** state on every page.
- Browser autoplay restrictions do not change that intent. Before playback is
  permitted, the host waits for the first eligible user interaction.
- On that interaction, an audio-capable waterfall-detail page starts its ambient
  track and fades smoothly from silence to its canonical level. It must not
  begin abruptly.
- The page owns its audio engine and fade implementation. It registers its
  toggle function with the host and reports playback state. SiteNav emits
  `onAudioToggle` and reflects the host-provided `audioPlaying` state.
- The audio toggle is always visible. A page without ambient audio, including
  Homepage, must not hide it or alter the global navigation layout.
- When no ambient track exists, the host keeps the control visible and gives it
  a defined inactive or unavailable response.

## Required host sequence

1. Initialize shared theme state to dark.
2. Initialize shared audio intent to on, while playback remains browser-blocked.
3. On the first eligible user interaction, unlock audio.
4. If the page provides ambient audio, start it at silence and fade to the
   canonical level.
5. Keep `audioPlaying` synchronized with the actual playback state.
6. Route both SiteNav controls through the shared host state on every page.

Any exception requires explicit human approval. Agents must not infer an
exception from missing media, page type, browser restrictions, or implementation
convenience.