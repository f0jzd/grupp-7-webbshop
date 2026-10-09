# Webshop

An online storefront featuring full UX, responsive styling, a 10/10 AIM score, etc/todo<!--todo: other good shit-->

Developed as part of Lexicons frontend program by a 3-man taem over the course of 3 weeks. 

<!-- todo: Screenshot or GIF of the catalog goes here -->

## Key features

- **Paginated product catalog** driven entirely by URL, thus bookmarkable queries.
- **Powerful search** across a wide range of metadata
- **Two level category navigation** with an elegant mobile view.
- **Full UX chain** from the initial visit all the way to checkout through product and cart pages.
- **Clientside cart functionality** built with cookies, as such persisting across sessions.
- **Admin interface** for manually editing source data
- **Loading and error states**, and a layout that works from phone to desktop
- **Accessibility-minded UI**, evaluated by [WAVE](todo)
<!--todo: brag about more shit-->

## Tech stack

<!--todo: outdated, talks about json server, probably missing stuff-->
| Technology | What it does | Why we chose it |
| --- | --- | --- |
| [Next.js](https://nextjs.org) (App Router) | User interface and server-rendered pages | Fast page loads, and URL-based navigation makes catalog views shareable |
| TypeScript | Type safety | Catches mistakes early, which matters when four people share a codebase |
| Tailwind CSS | Styling | Quick, consistent styling without a pile of custom CSS |
| [shadcn/ui](https://ui.shadcn.com) | UI components (buttons, pagination, sheets, accordions) | Accessible building blocks; the project brief asked for default shadcn styling |
| [json-server](https://github.com/typicode/json-server/tree/v0.17.4) 0.17.4 | Mock REST API | Lets the frontend be built against a realistic backend without writing one |
| GitHub Projects | Sprint board | Planning and tracking work in an Agile workflow |
| Supabase | something | something |

Product data comes from [dummyjson.com](https://dummyjson.com/docs/products), modified to fit this project. Most endpoints mirror the ones in its documentation.

## Demo / screenshots

<!--todo-->
| Catalog | Mobile | Product page | Admin |
| --- | --- | --- | --- |
| _screenshot_ | _screenshot_ | _screenshot_ | _screenshot_ |

## Requirements

<!--todo: doublecheck install instructions, like adding the bit about environment vars for supabase-->
- [Node.js](https://nodejs.org) `<recommended version>` and npm
- Git
- Ports **3000** (the site) and **4000** (the mock API) free on your machine <!--todo: outdated, we dont need the mock server at 4k-->

## Installation

```bash
git clone https://github.com/f0jzd/grupp-7-webbshop.git
cd grupp-7-webbshop
npm install
cp .env.example .env.local   # see Configuration
npm run dev:full
```

`dev:full` starts the Next.js dev server and the mock API together.

## Quick start

1. Open <http://localhost:3000> to see the shop.
2. Browse the catalog, or try a search, e.g. `/?q=mascara`.
3. Open <http://localhost:4000/products> to see the raw API the shop is reading from.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev:full` | Runs the Next.js dev server and the mock API together |
| `npm run dev` | Runs only the Next.js dev server |
| `npm run mock-server` | Runs only the mock API on port 4000 |

## Configuration

Copy `.env.example` to `.env.local` and adjust as needed.

| Variable | Purpose | Default |
| --- | --- | --- |
| `<VARIABLE_NAME>` | `<what it does, e.g. base URL of the API>` | `<http://localhost:4000>` |

The mock API's data and behaviour live in `server/`:

- `server/products.json`: the product and category "database"
- `server/middleware.js`: custom API behaviour (see below)

## Project structure

```
app/            Pages, components and shared types (Next.js App Router)
  lib/          Shared helpers (URL building, pagination, debounce, ...)
docs/           Additional project documentation
fonts/          Local font files
public/         Static assets
scripts/        Helper scripts
server/         Mock API (products.json + middleware.js)
proxy.ts        Next.js request proxy
components.json shadcn/ui configuration
```

## Documentation

- [`docs/`](./docs): additional project documentation
- [`guidlines.md`](./guidlines.md): team guidelines
- [Next.js docs](https://nextjs.org/docs) and [shadcn/ui docs](https://ui.shadcn.com/docs) for the underlying tools

### API reference

The mock API runs on port 4000.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/products` | List products (paginated, see below) |
| GET | `/products/:id` | Get one product |
| GET | `/products/stats` | Totals for in stock, low stock and out of stock |
| POST | `/products` | Create a product |
| DELETE | `/products/:id` | Remove a product |
| GET | `/categories` | List categories |
| GET | `/categories/:id` | Get one category |

**Creating a product** requires `title`, `price`, `description`, `thumbnail`, `categoryId` and `brand`. The server generates `id`, `sku` and timestamps.

**Pagination, sorting and filtering** use json-server's query parameters. List responses are wrapped by our middleware as `{ products, total, limit, page, pages }`.

```
GET /products?_page=2&_limit=18
GET /products?_sort=price&_order=desc
GET /products?price_gte=10&price_lte=50
GET /products?q=mascara
```

See the [json-server 0.17.4 docs](https://github.com/typicode/json-server/tree/v0.17.4) for everything else.

## Examples

- **Browse a category:** `/?category=<id>`
- **Search within results:** `/?q=<term>`
- **Jump to a page:** `/?page=3`
- **Combine them:** `/?category=<id>&q=<term>&page=2`

<!-- Verify these against the actual param names in the app -->

## Status / roadmap

The project is feature-complete for its original scope:

- [x] Product list with pagination
- [x] Search, category navigation, sorting and filtering
- [x] Product detail pages
- [x] Add and edit product functionality
- [x] Error handling and loading states
- [x] Responsive layout

Possible future work: `<ideas, e.g. replacing the mock API with a real backend, cart persistence>`

## Contact / support

Found a bug or have a question? Please [open an issue](https://github.com/f0jzd/grupp-7-webbshop/issues).

## Acknowledgements

**Team (Group 7)**


**Built with:** [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [json-server](https://github.com/typicode/json-server). Product data adapted from [DummyJSON](https://dummyjson.com).

Created as part of the frontend program at Lexicon.