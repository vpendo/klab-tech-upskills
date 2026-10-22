import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  Boxes,
  AlertTriangle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import type { Product } from "../../Types/product";
import {
  getProducts,
  addProduct as createProduct,
  updateProduct as editProduct,
  deleteProduct as removeProduct,
} from "../../services/productService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";

const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must have at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Please enter a product description"),
  category: z.enum(["Shoes", "Clothes"]),
  gender: z.enum(["Men", "Women"]),
  price: z.coerce.number().positive("Price must be greater than zero"),
  quantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
});

type ProductFormValues = z.input<typeof productSchema>;
type ValidatedProductValues = z.output<typeof productSchema>;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      "The request failed. Please try again."
    );
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues, any, ValidatedProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Clothes",
      gender: "Women",
      price: 0,
      quantity: 0,
    },
  });

  async function loadProducts() {
    setLoading(true);
    setPageError("");

    try {
      const response = await getProducts({ limit: 50 });
      setProducts(response.products);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const totalStock = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStockCount = products.filter(
    (product) => product.quantity <= 5
  ).length;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product._id.toLowerCase().includes(searchTerm);

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      const matchesStock =
        stockFilter === "All" ||
        (stockFilter === "Low stock" && product.quantity <= 5) ||
        (stockFilter === "In stock" && product.quantity > 5);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  function openAddForm() {
    setEditingProduct(null);
    setImageFile(null);
    setFormError("");
    setImageInputKey((key) => key + 1);

    reset({
      name: "",
      description: "",
      category: "Clothes",
      gender: "Women",
      price: 0,
      quantity: 0,
    });

    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setImageFile(null);
    setFormError("");
    setImageInputKey((key) => key + 1);

    reset({
      name: product.name,
      description: product.description,
      category: product.category,
      gender: product.gender,
      price: product.price,
      quantity: product.quantity,
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setImageFile(null);
    setFormError("");
    setImageInputKey((key) => key + 1);
    reset();
  }

  const onSubmit: SubmitHandler<ValidatedProductValues> = async (data) => {
    setFormError("");
    setPageError("");
    setSuccessMessage("");

    if (!editingProduct && !imageFile) {
      setFormError("Please select a product image.");
      return;
    }

    if (
      imageFile &&
      !["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)
    ) {
      setFormError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      setFormError("The image must be 5 MB or smaller.");
      return;
    }

    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("gender", data.gender);
    formData.append("price", String(data.price));
    formData.append("quantity", String(data.quantity));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const wasEditing = Boolean(editingProduct);

    try {
      if (editingProduct) {
        await editProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      closeForm();
      await loadProducts();

      setSuccessMessage(
        wasEditing
          ? "Product updated successfully."
          : "Product added successfully."
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(product._id);
    setPageError("");
    setSuccessMessage("");

    try {
      await removeProduct(product._id);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id)
      );

      setSuccessMessage("Product deleted successfully.");
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-orange-600">
              PendoHub Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Products Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your fashion products, prices, and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Feedback messages */}
        {pageError && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{pageError}</p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading ? "..." : products.length}
                </p>
              </div>
              <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                <Package size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Stock</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading ? "..." : totalStock}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Boxes size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock Products</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {loading ? "..." : lowStockCount}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-3 text-red-600">
                <AlertTriangle size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product name or ID..."
                className={`${inputClass} pl-10`}
                aria-label="Search products"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className={inputClass}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              <option value="Shoes">Shoes</option>
              <option value="Clothes">Clothes</option>
            </select>

            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              className={inputClass}
              aria-label="Filter by stock"
            >
              <option value="All">All Stock Levels</option>
              <option value="In stock">In Stock (over 5)</option>
              <option value="Low stock">Low Stock (5 or less)</option>
            </select>
          </div>
        </div>

        {/* Products table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">All Products</h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} results
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Loading products from the server...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Package className="mx-auto text-gray-300" size={42} />
              <h3 className="mt-3 font-semibold text-gray-900">
                No products found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try another search or add a new product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Gender</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Stock</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg border border-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                              <ImageIcon size={21} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {product._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {product.gender}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                        {product.price.toLocaleString()} RWF
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            product.quantity === 0
                              ? "bg-red-100 text-red-700"
                              : product.quantity <= 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.quantity === 0
                            ? "Out of stock"
                            : product.quantity <= 5
                              ? `Low: ${product.quantity}`
                              : product.quantity}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            aria-label={`Edit ${product.name}`}
                            title="Edit product"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteProduct(product)}
                            disabled={deletingId === product._id}
                            aria-label={`Delete ${product.name}`}
                            title="Delete product"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === product._id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add and edit product modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2
                  id="product-form-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the product details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 p-6"
              noValidate
            >
              {formError && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {formError}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className={inputClass}
                    placeholder="e.g. Classic White Sneakers"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    className={inputClass}
                    placeholder="Describe the product..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category")}
                    className={inputClass}
                  >
                    <option value="Clothes">Clothes</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className={inputClass}
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Price (RWF)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0.01"
                    step="1"
                    {...register("price")}
                    className={inputClass}
                    placeholder="25000"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Available Stock
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    {...register("quantity")}
                    className={inputClass}
                    placeholder="10"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="imageFile"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Product Image {editingProduct ? "(optional)" : ""}
                  </label>
                  <input
                    key={imageInputKey}
                    id="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      setImageFile(event.target.files?.[0] ?? null);
                      setFormError("");
                    }}
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {editingProduct
                      ? "Choose a new image only if you want to replace the current one."
                      : "Select a JPEG, PNG, or WebP image up to 5 MB."}
                  </p>

                  {editingProduct?.imageUrl && !imageFile && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={editingProduct.imageUrl}
                        alt={editingProduct.name}
                        className="h-14 w-14 rounded-lg border object-cover"
                      />
                      <span className="text-sm text-gray-500">
                        Current image
                      </span>
                    </div>
                  )}

                  {imageFile && (
                    <p className="mt-2 text-sm text-green-700">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={17} />
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}