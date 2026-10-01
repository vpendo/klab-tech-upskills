# klab-tech-upskills
Tech Upskill Program at kLab
# kLab Tech Upskills

Tech Upskill Program at kLab.

## Project Setup

1. Clone the repository.

2. Install dependencies:

```bash
   npm install
```

3. Create a `.env` file and add your MongoDB connection and JWT secret:

```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret_here
```

   <!-- EXTRA -->
   Generate a secret in Git Bash:

```bash
   openssl rand -hex 64
```

   Never upload `.env` to GitHub. Make sure it is in `.gitignore`.

4. Start the development server:

```bash
   npm run dev
```

5. Open the API:
   `http://localhost:5000`

6. Open Swagger documentation:
   `http://localhost:5000/api-docs`

## Technologies

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Swagger
* bcrypt <!-- EXTRA -->
* JSON Web Token (JWT) <!-- EXTRA -->

<!-- EXTRA: everything below is new -->

## Authentication

The API uses **bcrypt** to hash passwords and **JWT** to authenticate users.

1. A user registers with `POST /api/auth/register`. The password is hashed before it is saved.
2. The user logs in with `POST /api/auth/login` and receives a token (valid for 1 day).
3. Protected routes need this header:

```http
   Authorization: Bearer <token>
```

In Swagger, click **Authorize**, paste the token only, and confirm.

### Roles

| Role | Permissions |
| --- | --- |
| `customer` | View products (default role after register) |
| `admin` | View, create, update, and delete products |

The role cannot be chosen at registration. To create an admin, register a normal user, change `role` to `"admin"` in MongoDB, then login again to get a new token.

## API Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create an account |
| `POST` | `/api/auth/login` | Public | Login and get a token |
| `GET` | `/api/products` | Public | Get all products |
| `GET` | `/api/products/:id` | Public | Get a product by ID |
| `POST` | `/api/products` | Admin | Create a product |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |

## Project Structure

```text
src/
├── config/
│   ├── db.ts
│   └── swagger.ts
├── controller/
│   ├── auth.controller.ts
│   └── product.controller.ts
├── middleware/
│   └── auth.middleware.ts
├── model/
│   ├── product.model.ts
│   └── user.model.ts
├── router/
│   ├── auth.router.ts
│   └── product.router.ts
└── server.ts
```

## Testing

| Request | Expected |
| --- | --- |
| `POST /api/products` with no token | 401 |
| `POST /api/products` with a customer token | 403 |
| `POST /api/products` with an admin token | 201 |