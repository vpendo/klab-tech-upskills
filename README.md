# klab-tech-upskills

Backend development project for the Tech Upskill Program at kLab.

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/vpendo/klab-tech-upskills.git
cd klab-tech-upskills
```

Replace `<your-repository-url>` with your repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your MongoDB connection string and JWT secret.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_here
```

Generate a secure random secret using Git Bash:

```bash
openssl rand -hex 64
```

**Important:** Never commit your `.env` file to GitHub. Ensure it is included in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

### 5. Access the API

- **API:** http://localhost:5000
- **Swagger documentation:** http://localhost:5000/api-docs

## Technologies

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Swagger
- bcrypt
- JSON Web Token (JWT)

## Authentication

The API uses **bcrypt** to hash passwords and **JWT** to authenticate users.

### Authentication flow

1. Register using `POST /api/auth/register`. The password is hashed before being stored.
2. Log in using `POST /api/auth/login` to receive an authentication token valid for one day.
3. Include the token in the `Authorization` header when accessing protected endpoints.

```http
Authorization: Bearer <token>
```

### Using Swagger authorization

1. Open http://localhost:5000/api-docs.
2. Click **Authorize**.
3. Paste your JWT token into the authorization field.
4. Confirm authorization and test the protected endpoints.

Follow the format requested by the Swagger authorization dialog.

## User Roles and Permissions

| Role | Permissions |
|---|---|
| `customer` | View products |
| `admin` | View, create, update, and delete products |

Newly registered users receive the `customer` role by default. Users cannot select the administrator role during registration.

### Creating an administrator account

1. Register a normal user.
2. Update that user's `role` field to `"admin"` in MongoDB.
3. Log in again to obtain a token containing the updated role.
4. Use the new token to access administrator-only endpoints.

Do not expose administrator privileges through public registration.

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a user account |
| `POST` | `/api/auth/login` | Public | Log in and receive a JWT |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Retrieve all products |
| `GET` | `/api/products/:id` | Public | Retrieve a product by ID |
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

This structure represents the project's main backend modules.

## Testing and Expected Responses

The following checks verify authentication and role-based access to product creation.

| Request | Expected HTTP status |
|---|---|
| `POST /api/products` without a token | `401 Unauthorized` |
| `POST /api/products` with a customer token | `403 Forbidden` |
| `POST /api/products` with an admin token and valid product data | `201 Created` |

These are the expected results when authentication, authorization, validation, and route configuration are implemented correctly.

## Security Notes

- Keep `.env` files and secrets out of version control.
- Hash passwords before saving them to the database.
- Validate incoming request data.
- Protect administrator endpoints with authentication and role-based authorization.
- Use HTTPS and secure environment configuration when deploying to production.

## License

Add a license if you intend to distribute or publish this project for reuse.
