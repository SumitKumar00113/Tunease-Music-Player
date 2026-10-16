# Tunease Auth Frontend — Route Directory Details

This directory encapsulates all client-side routing logic, page route definitions, and navigation configuration for the Tunease Auth frontend service.

## 🧭 Routes Architecture

| Path | Component | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/` | `AppRoutes` (Root) | No | Default gateway. Redirects authenticated users to `/profile`, unauthenticated to `/login`. |
| `/login` | `LoginRoute` | No | Login form supporting email/phone credentials and Google OAuth. |
| `/register` | `RegisterRoute` | No | Account onboarding for listeners and creators with form validation. |
| `/profile` | `ProfileRoute` | **Yes** | User profile inspection, role badge, profile photo, and credential edits. |
| `/me` | `ProfileRoute` (Alias) | **Yes** | Alias redirect to `/profile`. |
| `*` | `Navigate` (Fallback) | No | Wildcard match redirecting to `/`. |

## 📁 File Structure

* **`routes.config.js`**: Central metadata definitions (paths, titles, descriptions, and authentication requirements).
* **`AppRoutes.jsx`**: Top-level `<Routes>` configuration with session resolution and redirection logic.
* **`LoginRoute.jsx`**: Page component for user sign-in with tab switcher.
* **`RegisterRoute.jsx`**: Page component for user registration with tab switcher.
* **`ProfileRoute.jsx`**: Protected page component for authenticated user settings and session teardown.
* **`index.js`**: Public barrel export for all routing entities.
