# Tunease Landing Platform — Route Directory Details

This directory encapsulates all client-side page routing, section deep links, and navigation configuration for the Tunease Landing web application.

## 🧭 Landing Routes Architecture

| Route Path | Component | Anchor Target | Highlights & Features |
| :--- | :--- | :--- | :--- |
| `/` | `HomeRoute` | `#hero` | Main landing experience featuring Hero showcase, visualizer canvas, creator economics, and customer testimonials. |
| `/experience` | `ExperienceRoute` | `#experience` | Dedicated spatial audio deep-dive with interactive 3D audio canvas. |
| `/creators` | `CreatorsRoute` | `#creators` | Spotlight on 85% creator revenue share, stem separation, and fanbase ownership tools. |
| `/features` | `FeaturesRoute` | `#features` | Core platform highlights: Hi-Res FLAC streaming, collaborative playlists, and zero-latency sync. |
| `/difference` | `DifferenceRoute` | `#difference` | Comparison table contrasting Tunease against legacy streaming platforms. |
| `/waitlist` | `HomeRoute` (Modal) | `#waitlist` | Dedicated entry route prompting the VIP early access registration dialog. |
| `*` | `Navigate` (Fallback) | — | Wildcard match redirecting to `/`. |

## 📁 File Structure

* **`routes.config.ts`**: Route metadata definitions with paths, section anchor targets, and feature descriptions.
* **`AppRoutes.tsx`**: Top-level `<Routes>` configuration with URL matching and fallback logic.
* **`HomeRoute.tsx`**: Primary landing view rendering all stacked narrative sections.
* **`ExperienceRoute.tsx`**: Standalone view for the audio engine experience.
* **`CreatorsRoute.tsx`**: Standalone view for creator & artist features.
* **`FeaturesRoute.tsx`**: Standalone view for platform capabilities and value cards.
* **`DifferenceRoute.tsx`**: Standalone view for platform competitive advantage.
* **`index.ts`**: Public barrel export for all route definitions.
