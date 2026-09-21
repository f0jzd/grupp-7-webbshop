<img
  src="./app/icon.png"
  alt="Screenshot av applikationen"
  width="60"
/>

# Webshop

This is a group project for the frontend education with Lexicon. The main thrust of this project is to practice developing a product using an Agile development process.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [json-server](https://github.com/typicode/json-server/tree/v0.17.4) to mock a backend API.

Data in the json for the server is from [dummyjson.com](https://dummyjson.com/docs/products) but modified to fit the needs of this project. Most of the endpoints mirrors those in that documentation.

## Technologies

| Technology     | Used for                           |
| -------------- | ---------------------------------- |
| Next.js        | User interface & Server Components |
| TypeScript     | Type safety                        |
| Tailwind       | Styling                            |
| Mock-API       | Product Library                    |
| Github Project | Sprint dashboard                   |

## Getting Started

First, install the dependencies:

## Installation

To view the webshop page, clone the repo, install dependencies and run a local development server.

```bash
git clone git@github.com:Martin-Joensson/projekt-agila-metoder-webshop.git
cd projekt-agila-metoder-webshop
npm install
npm run dev:full
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The JSON server is running on [http://localhost:4000](http://localhost:4000). Here you can see the API endpoints and test them.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Status

### Completed

- [x] Visual interface for product list view
- [x] Functional pagination for product lists
- [x] API calls to mock server (`json-server`)
- [x] Add product functionality
- [x] Edit product functionality
- [x] Error handling / loading states
- [x] Responsive UI

### Planned

- All planned features are completed

## Project Structure

- `app/`
  - `page.tsx` - main Next.js page entry point
  - `components/` components for different pages and routes
  - `types/` typescript type files with shared interfaces and types.
- `public/` - static assets
- `server/`
  - `products.json` - mock database for json-server
  - `middleware.js` - custom middleware for API responses
- `actions.ts` - API related actions
- `package.json` - scripts and dependencies
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js config
- `README.md` - project documentation

## JSON Server Setup

This project uses [json-server](https://github.com/typicode/json-server/tree/v0.17.4) to mock a backend API.

### Configuration

The server configuration files are located in the `server/` directory:

- `server/products.json`: The database file containing the product data.
- `server/middleware.js`: Custom middleware for the server.

### Scripts

The following scripts are available in `package.json`:

- `npm run mock-server`: Starts the json-server on port 4000.
- `npm run dev:full`: Runs both the Next.js development server and the json-server concurrently.

## API Endpoints

The mock server (running on port 4000) provides the following endpoints:

### Resources

- `GET/ /products`: Get all products
- `GET /products/:id`: Get a single product by ID
- `GET /categories`: Get all categories
- `GET /categories/:id`: Get a category by ID
- `GET /categories?slug=:slug`: Get a category by slug

### Create Product

- `POST /products`: Create a new product

### Delete Product

- `DELETE /products/:id`: Removes a product from the json file.

**Required Fields:**

- `title`: String
- `price`: Number
- `description`: String
- `thumbnail`: URL String
- `categoryId`: Number (ID of an existing category)
- `brand`: String

**Auto-generated Fields:**

- `id`: Sequential ID
- `sku`: Generated SKU (format: CAT-BRA-TIT-ID)
- `meta`: Creation and update timestamps

### Pagination & Sorting (json-server 0.17.4)

See [json-server documentation](https://github.com/typicode/json-server/tree/v0.17.4) for more information.

#### Pagination

Use `_page` and `_limit` to paginate data:

- `GET /products?_page=1&_limit=10` (First page, 10 items)
- `GET /products?_page=2&_limit=10` (Second page, 10 items)

The response will include the `Link` header with `first`, `prev`, `next`, and `last` links.
Our custom middleware also adds `X-Total-Count` header and wraps the response to include pagination metadata (total, limit, page, pages).

#### Sorting

Use `_sort` and `_order` to sort data:

- `GET /products?_sort=price&_order=asc` (Sort by price, ascending)
- `GET /products?_sort=price&_order=desc` (Sort by price, descending)
- `GET /products?_sort=price,title&_order=desc,asc` (Sort by multiple fields)

#### Filtering

- `GET /products?price_gte=10&price_lte=50` (Price between 10 and 50)
- `GET /products?q=mascara` (Full-text search)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Authors

- Gabriel Gaglianone ([@Amuga](https://github.com/Amuga))
- Martin Jönsson ([@Martin-Joensson](https://github.com/Martin-Joensson))
- Tomas Savela ([@f0jzd](https://github.com/f0jzd))
- Josefin Wall ([@josiefinis](https://github.com/josiefinis))
