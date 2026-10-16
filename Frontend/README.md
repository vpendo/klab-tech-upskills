# PendoHub — Fashion Store Frontend

PendoHub is a fashion e-commerce website built with React, TypeScript, and Tailwind CSS. It allows users to browse shoes and clothes, view product details, manage a shopping cart, and save favorite products to a wishlist.

The project currently uses local product data and browser storage, so it can run without a backend API.

## Features

- **Home:** Explore featured products and categories.
- **Shop:** Browse products and filter by category, gender, or search term.
- **Product Details:** View product images, descriptions, prices, and stock information.
- **Shopping Cart:** Add products, update quantities, remove items, and view the subtotal.
- **Wishlist:** Save favorite products and manage saved items.
- **Search:** Find products using the search feature.
- **Checkout:** Review cart items and price details.
- **Responsive Design:** Browse the website on desktop and mobile screens.
- **Local Storage:** Preserve cart and wishlist data after refreshing the browser.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Browser Local Storage

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm before running the project.

### 1. Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal. It is commonly `http://localhost:5173`.

### 3. Build the project

To create a production build, run:

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
├── Components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProductCart.tsx
├── Context/
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── Pages/
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductDetails.tsx
│   ├── Cart.tsx
│   ├── Wishlist.tsx
│   ├── Checkout.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── Types/
│   └── product.ts
├── data/
│   └── product.ts
├── App.tsx
├── main.tsx
└── index.css
```

*Note: The structure above is illustrative. Your actual file names and folders may differ.*

## How to Use PendoHub

1. Open the Home page.
2. Navigate to Shop to browse available products.
3. Search for products or filter by category and gender.
4. Select a product to see its details.
5. Add products to your cart or wishlist.
6. Open the cart to change quantities or remove products.
7. Visit the wishlist to manage saved products.
8. Open Checkout to review the order summary.

## Product Data

Product information is stored in `src/data/product.ts`. You can add or update products by editing the local product array.

Product information includes fields such as:

- Product ID
- Name and description
- Category and gender
- Price in Rwandan francs (RWF)
- Available quantity
- Product image URL

Ensure each product matches the TypeScript `Product` type defined in your project.

## Cart and Wishlist

React Context shares cart and wishlist data across the application.

Browser `localStorage` is used to persist this data:

- Cart: `pendohub-cart`
- Wishlist: `pendohub-wishlist`

The saved data belongs to the current browser and is not automatically synchronized across devices.

## Current Limitations

This is a frontend-focused project that uses local product data.

- No backend API or database connection is required for the current product browsing features.
- Real user authentication is not implemented unless connected to an authentication service.
- Checkout does not create real orders.
- Online payments and delivery fee calculations are not implemented.
- Contact and newsletter forms require additional integration if they need to send or store submissions.

Do not enter real payment details into this demo.

## Future Improvements

- Connect a backend API and database.
- Implement secure user authentication.
- Add order creation and order history.
- Integrate a payment provider.
- Calculate delivery fees.
- Connect contact and newsletter forms.
- Add automated tests and deployment configuration.

## License

Add a license if you intend to distribute or publish this project for reuse.
