# PendoHub — Fashion Store

PendoHub is a full-stack fashion e-commerce application built with React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB. It allows customers to browse shoes and clothes, manage their shopping cart and wishlist, place orders, and track order status. Administrators can manage products and orders through a dedicated dashboard.

## Features

- **Home:** Explore featured products and fashion categories.
- **Shop:** Browse products and filter by category, gender, or search term.
- **Product Details:** View product images, descriptions, prices, and stock availability.
- **Authentication:** Register and log in using the backend authentication system.
- **Role-Based Access:** Separate customer and administrator functionality.
- **Shopping Cart:** Add products, update quantities, remove items, and view the subtotal.
- **Wishlist:** Save favorite products and manage saved items.
- **Checkout:** Review cart items and submit an order.
- **Order Management:** Customers can view their orders and track their status.
- **Admin Dashboard:** Manage products, monitor inventory, and update order statuses.
- **Product Images:** Store and manage product images using Cloudinary.
- **API Documentation:** Explore and test backend endpoints using Swagger UI.
- **Responsive Design:** Browse the application on desktop and mobile devices.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Axios
- React Context API

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- Zod validation
- Swagger UI
- Cloudinary for product images

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm. You also need access to a MongoDB database and the required environment variables for the backend.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd PendoHub
```

Replace `<your-repository-url>` with your repository URL.

### 2. Install frontend dependencies

Open a terminal in the frontend project directory and run:

```bash
npm install
```

### 3. Configure the frontend

Create a `.env` file in the frontend root directory and configure the backend API URL:

```env
VITE_API_URL=http://localhost:5000
```

Use the URL format expected by your API service. If your service expects the `/api` prefix in the base URL, configure it accordingly.

### 4. Start the frontend

```bash
npm run dev
```

Open the local URL displayed in the terminal, commonly `http://localhost:5173`.

### 5. Install backend dependencies

Open a separate terminal in the backend project directory and run:

```bash
npm install
```

### 6. Configure the backend

Create a backend `.env` file containing the environment variables required by your application. Typical variables include:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

Configure Cloudinary credentials and any other variables required by your backend. Use your actual variable names from the backend configuration, and do not commit secrets to Git.

### 7. Start the backend

Use the development script defined in the backend's `package.json`. For example, if the project has a `dev` script:

```bash
npm run dev
```

The backend should start on `http://localhost:5000` if configured to use that port.

### 8. Open Swagger documentation

Visit:

`http://localhost:5000/api-docs`

Use Swagger UI to inspect and test the documented API endpoints. Protected endpoints require the appropriate authentication token and role.

### 9. Build the frontend

From the frontend directory, run:

```bash
npm run build
```

### 10. Preview the production build

```bash
npm run preview
```

## Project Structure

The following is an illustrative structure. Your actual files may differ.

### Frontend

```text
src/
├── Components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── Dash/
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
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard/
├── Services/
│   ├── api.ts
│   └── productService.ts
├── Types/
│   └── product.ts
├── App.tsx
├── main.tsx
└── index.css
```

### Backend

```text
src/
├── controller/
├── middleware/
├── model/
├── routes/
├── validation/
├── config/
└── server.ts
```

The backend structure is illustrative and should be adjusted to match the actual project files.

## How to Use PendoHub

### Customer

1. Register for an account or log in.
2. Browse the Home and Shop pages.
3. Search for products or filter by category and gender.
4. Open a product to view its details and available stock.
5. Add products to the cart or wishlist.
6. Open the cart to manage quantities and remove items.
7. Proceed to checkout to place an order.
8. Visit the customer dashboard to view order history and track order status.

Customers must be authenticated to use customer-specific cart, wishlist, and order functionality.

### Administrator

1. Log in using an administrator account.
2. Open the admin dashboard.
3. Add, edit, or delete products.
4. Review inventory and low-stock information.
5. View customer orders.
6. Update order statuses as orders are processed.

Administrator-only operations are protected by backend role-based authorization.

## Product Data and Images

Product information is stored in MongoDB and accessed through the backend API rather than a local product array.

Product records include fields such as:

- Product ID
- Name and description
- Category and gender
- Price in Rwandan francs (RWF)
- Available quantity
- Image URL
- Cloudinary image identifier

Product images are managed through Cloudinary. The backend API provides the product data used by the frontend.

## Cart and Wishlist

React Context shares cart and wishlist state across the frontend.

Cart and wishlist data are retrieved and updated through authenticated backend API endpoints. Their persistent data is stored on the backend rather than relying on browser `localStorage` as the source of truth.

Customers must log in to use these features. Administrator accounts cannot use customer cart and wishlist functionality.

## Authentication and Authorization

PendoHub uses backend authentication and role-based access control.

- **Customers:** Browse products, manage their cart and wishlist, place orders, and view their own orders.
- **Administrators:** Manage products and orders through protected administrative endpoints.
- **Protected API routes:** Require authentication and the appropriate role.
- **Passwords and secrets:** Must be handled securely and should never be committed to the repository.

## Order Management

Customers can place orders through the checkout process and view their order history.

Administrators can retrieve orders and update their status. The application supports these statuses:

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

Online payment processing is not included unless a payment provider is integrated separately.

## API Documentation

Swagger UI is available at:

`http://localhost:5000/api-docs`

It provides interactive documentation for the API endpoints that have been documented in the backend.

## Current Limitations

- Online payment integration is not implemented.
- Delivery fee calculation may require additional implementation.
- Contact and newsletter forms may require an external service or backend integration.
- Production deployment requires configuring environment variables, CORS, database access, image storage, and secure authentication settings.

## Future Improvements

- Integrate a secure online payment provider.
- Add delivery fee calculations and shipping options.
- Improve automated frontend and backend testing.
- Deploy the frontend and backend to production.
- Add email notifications for order updates.
- Add product reviews and ratings.
- Improve accessibility and performance.

## License

Add a license if you intend to distribute or publish this project for reuse.
