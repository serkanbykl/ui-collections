# ui-collections

**Live site: [ui-collections.vercel.app](https://ui-collections.vercel.app)** · [glass](https://ui-collections.vercel.app/glass) · [tide](https://ui-collections.vercel.app/tide)

Two collections of React components you copy into your project and own. The same components, props and behaviour, in two finishes:

- **glass** — liquid glass on deep teal, frosted surfaces and calm motion, dark and light.
- **tide** — clean admin screens in fresh green on cool slate, light and dark.

Each collection has 200+ items: components, animated pieces, charts, blocks, full app screens, dashboards and a complete template (Lumen). The home page is a small sea with hamsi you can feed.

Built with Next.js, React 19, Tailwind CSS v4, Radix and Motion.

## Install a component

Every item is a [shadcn](https://ui.shadcn.com) registry entry. Open it on the site and copy its install command, for example:

```sh
npx shadcn@latest add https://ui-collections.vercel.app/r/glass/button.json
```

## Run locally

```sh
npm install
npm run dev
```

Then open [localhost:3001](http://localhost:3001) (home), [/glass](http://localhost:3001/glass) and [/tide](http://localhost:3001/tide).

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run check:themes`.

## Deploy

The site deploys to [Vercel](https://vercel.com) as is: import the repository and keep the defaults. Collections live under `/glass` and `/tide`, so no custom domain is needed.

With a domain of your own and wildcard DNS, the collections can live on subdomains instead (`glass.example.com`). Set these environment variables:

```sh
SITE_URL=https://example.com
NEXT_PUBLIC_ROUTING=subdomain
COLLECTION_ORIGIN=https://{id}.example.com
```

## Project layout

- `src/registry/kit/` — the installable source: ui, blocks, screens, dashboards, templates.
- `src/catalog/` — metadata for every item; drives the docs and the registry.
- `src/demos/` — live previews and usage examples.
- `src/themes/` — the theme contract and one stylesheet per collection.
- `src/app/main/` — the home page.

Contributor rules live in [AGENTS.md](AGENTS.md).

## Licence

[MIT](LICENSE) © Serkan Baykal. All media in `public/media` is original work, released under CC0.
