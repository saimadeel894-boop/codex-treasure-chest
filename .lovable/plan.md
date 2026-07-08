## Scope (Phase 1)

A production-quality slice of the marketplace: users can browse, search, and filter properties, view rich detail pages, sign up / sign in, and save favourites. Selling, listing management, agent/agency profiles, and messaging come in later phases.

Out of scope this phase: creating/editing listings, agent dashboards, in-app messaging, payments.

## Brand & design system

- Name: **Domicile** (unique, no trademark conflict with existing AU portals).
- Primary: warm orange `#F26B1D` with a deeper `#D95208` for hover; neutrals on off-white `#FAFAF7`; ink `#101828`; muted `#667085`; success `#0E9F6E`.
- Type: **Fraunces** (display, for hero + property price) paired with **Inter** (UI). Loaded via `@fontsource` packages, wired through `src/styles.css` `@theme` tokens.
- Cards: 16px radius, hairline border `#E7E5E0`, soft shadow only on hover.
- Imagery: full-bleed hero, generous whitespace, ample 4:3 property photography.
- Fully responsive; mobile-first search bar collapses to a single field with a "Filters" sheet.

## Pages & routes

```text
/                     Home: hero, Buy/Rent/Sold tabs on search, featured strip, city tiles
/buy                  Search results (For Sale)
/rent                 Search results (For Rent)
/sold                 Search results (Sold)
/property/$id         Property detail
/favourites           Signed-in only: saved properties
/auth                 Sign in / Sign up (email + password, Google OAuth)
```

Route protection: `/favourites` under `_authenticated/`. Auth CTAs on property detail (Save, Contact) trigger sign-in modal or redirect for anon users.

## Search & filters

Single search bar with:
- Listing type tabs (Buy / Rent / Sold)
- Location (suburb / city / state / postcode — free-text against seeded suburbs)
- Price range, bedrooms (min), bathrooms (min), parking (min), property type (House, Apartment, Townhouse, Land, Rural)
- Sort: newest, price asc, price desc

Filters live in URL search params (TanStack Router `validateSearch` + zod `fallback`) so results are shareable. Results grid with card view; empty state and "no matches, adjust filters" messaging.

## Data model (Lovable Cloud / Postgres)

- `profiles` — id (auth.users FK), full_name, avatar_url, phone
- `properties` — id, title, description, listing_type ('sale'|'rent'|'sold'), property_type, price_cents, rent_period ('week'|'month' nullable), address_line, suburb, state, postcode, latitude, longitude, bedrooms, bathrooms, parking, land_size_sqm, building_size_sqm, features (text[]), status, created_at, published_at, agent_id (nullable for phase 1)
- `property_images` — id, property_id, url, sort_order, alt
- `favourites` — user_id, property_id, created_at (composite PK)

RLS:
- `properties`, `property_images`: public SELECT of published rows; writes locked (no listing creation in phase 1).
- `favourites`: user can select/insert/delete only their own rows.
- `profiles`: user can select all, update own; auto-created via trigger on signup.

All tables get explicit GRANTs to `anon`/`authenticated`/`service_role` per public-schema policy.

## Seed data

24 realistic AU listings across Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart:
- ~14 for sale, 8 for rent, 2 sold
- Mix of houses, apartments, townhouses
- 3 AI-generated hero images per listing (exterior, interior, kitchen/living), stored as static assets under `src/assets/seed/` and referenced by URL in `property_images`

Prices, suburbs, and specs realistic for each market.

## Auth

- Email + password (default) and Google OAuth via Lovable's managed broker.
- On signup: DB trigger creates a `profiles` row.
- Header shows Sign in when signed out; avatar dropdown (Favourites, Sign out) when signed in.
- `/auth` handles both modes with a toggle; forgot-password → `/reset-password`.

## Favourites

- Heart icon on every property card + detail page.
- Signed-out click: opens sign-in modal, remembers intent, saves on return.
- `/favourites` page: grid of saved properties, empty state with CTA to browse.

## Technical notes

- Data reads use TanStack Query + server functions:
  - Public reads (`/buy`, `/rent`, `/sold`, `/property/$id`, home featured) use a server publishable client (anon key) inside `createServerFn` handlers with narrow `TO anon` SELECT policies.
  - Favourites reads/writes use `requireSupabaseAuth` server functions.
- SEO: unique `head()` on every route; `og:image` on property detail derived from the first listing image; JSON-LD `RealEstateListing` on detail pages.
- Perf: image URLs are local static assets, lazy-loaded below the fold.
- Accessibility: semantic headings, labelled inputs, focus rings on primary orange, alt text on all imagery.

## Deliverables

- Design tokens + fonts wired in `src/styles.css` and `src/routes/__root.tsx`.
- Migration creating all four tables with policies, grants, trigger, and seeded data (properties + images inserted via the insert tool after schema migration).
- Route files: `index`, `buy`, `rent`, `sold`, `property.$id`, `auth`, `reset-password`, `_authenticated/route`, `_authenticated/favourites`.
- Shared components: `SiteHeader`, `SiteFooter`, `SearchBar`, `FiltersSheet`, `PropertyCard`, `PropertyGallery`, `FavouriteButton`, `AuthDialog`.
- Server functions: `listProperties`, `getProperty`, `listFeatured`, `listFavourites`, `toggleFavourite`.
- Google OAuth enabled via `configure_social_auth`.

## Phase 2+ (not in this build)

- Create/edit/delete listings, seller dashboard, image upload.
- Agent + agency profiles and directory.
- Contact-agent flow (form → email + in-app inbox).
- Map view, saved searches, inspection scheduling.
