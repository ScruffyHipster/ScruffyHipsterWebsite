# Compact landing page

Dedicated route: `/compact/`. The app collection and site footer link to it; `/apps/compact/` redirects in the client. The production build prerenders the landing route and includes it in the sitemap. A separate owner-private Sites preview is published at https://compact-mirror-preview.scruffyhipster.chatgpt.site.

The design uses system typography, translucent controls, rounded surfaces, cobalt accents and eased magnification. The app icon was explicitly excluded as a visual reference. Mirrolizer inspired the interactive demonstration and scroll narrative, not the copy or assets.

## Content and availability

- `content/compact/landing.json`: page copy and demo labels.
- `content/apps/compact.json`: app collection, release status and SEO metadata.
- Current CTA is Coming soon. No price, trial or public availability is asserted. Replace it with a verified App Store CTA when launch is confirmed.
- Product claims follow Compact's current UK metadata draft and implementation. The demo is an illustration, not a recording or proof of tracking performance. It never requests camera access.
- This page does not add a legal privacy policy; its privacy text describes camera-image handling only.

## Assets

- `public/assets/compact/portrait.webp`: original generated fictional portrait, optimized to approximately 92 KB.
- `public/assets/compact/mark.svg`: simple website monogram, not a proposed replacement app icon.
- `public/assets/compact/social.svg` and `social.png`: editable source and raster social-sharing card.

The portrait was made with the built-in image-generation tool. Final prompt:

> Use case: photorealistic-natural. Asset type: portrait photograph for an interactive illustrative mirror demo on the Compact iPhone app landing page. Create a single photorealistic editorial beauty portrait, vertical 2:3 framing, very high detail. A fictional adult woman age 30 with medium warm olive skin, brown eyes, dark brown hair pulled behind her ears, subtle natural makeup and softly defined eyebrows, neutral relaxed mouth, looking straight into camera. Entire head and upper shoulders visible, face perfectly frontal, horizontally centered, both eyes level about 42 percent down the canvas, lips around 65 percent down. Dark charcoal taupe seamless background, plain black top. Soft neutral frontal studio light, natural visible skin texture, understated premium magazine photography. No hands, no phone, no mirror, no UI, no text, no logos, no split panels, no collage. This is an original fictional demo subject, not an actual app screenshot.

## Validation

`npm run check` builds the client and server, prerenders public routes, and validates types, SEO, internal links, assets, content ownership and existing tracker locale gates. Browser review includes desktop and phone layouts, feature selection, keyboard zoom, lighting, FAQ expansion and scroll-driven scene changes. Reduced-motion preferences disable transitions and smooth scrolling; physical iPhone Safari testing is separate from browser viewport checks.

## Native app demo (25 September 2026)

`src/components/CompactMirrorDemo.tsx` and its stylesheet recreate the current Compact interface, using `MirrorView`, `MirrorControls`, `MirrorFeatureChoices`, `ZoomSliderView`, `LightingControls`, `MirrorFramingPreview`, `FramingPreviewPlacement`, and `DevicePresentationAdapter` as references. The current uncommitted SwiftUI zoom styling was included in the reference; no app source was changed.

- Separate dark glass controls, five feature targets, minimum 2× on selection, and 1×/2×/3×/5× zoom presets. Unlock retains magnification.
- Hold zoom for 350 ms to reveal the curved ruler; drag left to magnify. Keyboard arrows also open and adjust it.
- Movable full-face preview snaps to corners and places the toolbar on the opposite side. In portrait Light Box mode, the preview shares the lower lighting pane with the controls, matching the app layout adapter.
- Halo/Light Box, brightness, warmth, dark settings sheets and camera-resolution choices follow the app. Resolution choices are illustrative and do not operate a camera.
- The scroll narrative uses the same demo component. Its controls are inert; the hero demo is interactive.

The portrait remains an original fictional illustration. This is a web recreation of the Premium interface, not embedded SwiftUI or live Vision tracking. Browser gestures simulate magnification, panning and feature selection on the portrait. Physical iPhone gesture behaviour and camera tracking are not established by the web demo.

## Scenario photographs (26 September 2026)

The three Out the door cards now use original generated lifestyle photos: `public/assets/compact/moment-meeting-v2.webp`, `moment-dinner.webp`, and `moment-evening-v2.webp`. Each photo sits above the retained sphere and shadow in an isolated CSS stacking context, offset so the sphere remains partly visible behind its top-right corner. The mobile cards retain the same layers above their text.

Images were made with the built-in image-generation tool, then encoded as 720 × 720 WebP assets (approximately 110 KB combined). Lazy loading and intrinsic dimensions limit loading cost and layout shift. These are illustrative app-in-use scenes, not physical device screenshots. The exact prompts and original generation paths are recorded in `docs/compact-moment-images.json`.
