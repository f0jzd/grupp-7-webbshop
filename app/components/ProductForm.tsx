import { addProductAction } from "@/actions";
import { Product } from "@/types";
import {
  CancelButton,
  ConfirmSubmitButton,
} from "@/components/ConfirmSubmitButton";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

const API_URL = "http://localhost:4000";

const emptyProduct: Product = {
  id: 0,
  title: "",
  description: "",
  thumbnail: "",
  brand: "",
  price: 0,
  categoryId: 0,
  meta: {
    createdAt: "",
    updatedAt: "",
    barcode: "",
    qrCode: "",
  },
  images: [],
};

interface ProductFormProps {
  productId?: number;
  searchParams?: Record<string, string | string[] | undefined>;
}

export const ProductForm = async ({ productId }: ProductFormProps) => {
  const product = productId
    ? await fetch(`${API_URL}/products/${productId}`).then((res) => res.json())
    : emptyProduct;

  const categories = await fetch(`${API_URL}/categories`).then((res) =>
    res.json(),
  );

  return (
    <article className="flex flex-col m-auto max-w-7xl w-full p-4 items-center">
      <h2 className="text-2xl py-4">
        {productId !== undefined ? "Edit Product" : "Add Product"}
      </h2>
      <form
        action={addProductAction}
        key={product.id}
        className="flex flex-col gap-4 items-start max-w-2xl w-full "
      >
        {productId !== undefined && (
          <input type="hidden" name="productId" value={productId} />
        )}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="product-name">Product name:</label>
          <input
            id="product-name"
            type="text"
            className="border p-1 bg-neutral-50"
            name="title"
            defaultValue={product.title}
            placeholder="Enter product title"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="product-description">Product description:</label>
          <textarea
            id="product-description"
            name="description"
            defaultValue={product.description}
            placeholder="Enter description"
            required
            className="w-full min-h-8 field-sizing-content resize-none rounded border p-2 bg-neutral-50"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="product-image">Product Image:</label>
          <input
            id="product-image"
            type="url"
            name="thumbnail"
            defaultValue={product.thumbnail}
            placeholder="Enter thumbnail"
            required
            className="border p-1 rounded bg-neutral-50"
          />
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between gap-4 ">
          <div className="flex flex-col flex-1 ">
            <label htmlFor="product-price">Price:</label>
            <input
              id="product-price"
              type="number"
              name="price"
              defaultValue={product.price}
              placeholder="Enter price"
              required
              min={1}
              className="border h-8 p-1 rounded bg-neutral-50"
            />
          </div>

          <div className="flex flex-col flex-1">
            <label htmlFor="product-stock">Stock:</label>
            <input
              id="product-stock"
              type="number"
              name="stock"
              defaultValue={product.stock}
              placeholder="Enter stock"
              required
              className="border  h-8 p-1 rounded bg-neutral-50"
            />
          </div>
        </div>

        <div className="flex w-full justify-center gap-4">
          <div className="flex flex-col">
            <label htmlFor="product-brand">Brand</label>
            <input
              id="product-brand"
              type="text"
              name="brand"
              defaultValue={product.brand ?? ""}
              placeholder="Enter brand"
              required
              className="border h-8 p-1 rounded bg-neutral-50"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="product-category">Category</label>
            <select
              id="product-category"
              name="categoryId"
              defaultValue={product.categoryId}
              required
              className="border h-8 p-1 rounded bg-neutral-50"
            >
              <option value={0} disabled>
                Select a category
              </option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex m-auto gap-5">
          <ConfirmSubmitButton />
          <CancelButton />
        </div>
      </form>
    </article>
  );
};
