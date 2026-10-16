# Tunease Music Player — Route Directory Details

This directory manages all view routing, deep linking, parameter resolution, and navigation synchronization for the Tunease Music Player frontend.

## 🧭 Music Routes Architecture

| Route Path | Component | Tab Context | Purpose & Features |
| :--- | :--- | :--- | :--- |
| `/` or `/discover` | `DiscoverRoute` | `discover` | Home view with Hero Spotlight, trending releases grid, recommended songs, and creator showcase. |
| `/explore` | `ExploreRoute` | `explore` | Browse genres, moods, charts, and searchable track listings. |
| `/library` | `LibraryRoute` | `library` | User playlist grid, personal discography, and custom collection management. |
| `/liked` | `LikedRoute` | `liked` | Dedicated view for user favorites with batch playback and song counts. |
| `/playlist/:id` | `PlaylistRoute` | `playlist` | Dynamic playlist details by ID with song duration, cover artwork, and track list. |
| `/artist/:id` | `ArtistRoute` | `artist` | Dynamic artist profile by ID with listener count, verified badge, and discography. |
| `/dashboard` | `DashboardRoute` | `dashboard` | Creator Studio for uploading new tracks, managing S3 audio files, and streaming metrics. |
| `*` | `Navigate` (Fallback) | — | Wildcard match redirecting to `/`. |

## 📁 File Structure

* **`routes.config.js`**: Route metadata definitions including paths, aliases, tab bindings, and descriptions.
* **`AppRoutes.jsx`**: Top-level `<Routes>` configuration with dynamic parameter handling and bidirectional PlayerContext synchronization.
* **`DiscoverRoute.jsx`**: Home/Discover landing view.
* **`ExploreRoute.jsx`**: Category and genre exploration view.
* **`LibraryRoute.jsx`**: User playlists and library view.
* **`LikedRoute.jsx`**: Liked songs view.
* **`PlaylistRoute.jsx`**: Dynamic playlist viewer for `:id`.
* **`ArtistRoute.jsx`**: Dynamic artist viewer for `:id`.
* **`DashboardRoute.jsx`**: Creator studio portal.
* **`index.js`**: Central export barrel.
