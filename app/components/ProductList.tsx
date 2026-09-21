import { Product } from "@/types";
import ProductCard from "./ProductCard";

export const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <ul className="bg-neutral-50">
      <div className="product-table-grid font-semibold text-neutral-500 text-sm py-4">
        <p className="text-left">Title</p>
        <p className="text-left">Brand</p>
        <p className="text-left">Category</p>
        <p className="text-right">Stock</p>
        <p className="text-right">Price</p>
        <p className="text-center">Actions</p>
      </div>
      {products.map((product) => (
        <li
          key={product.id}
          className="flex flex-col bg-white border-bs border-gray-200"
        >
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            sku={product.sku}
            thumbnail={product.thumbnail}
            brand={product.brand}
            category={product.category}
            availabilityStatus={product.availabilityStatus}
            stock={product.stock}
            price={product.price}
          />
        </li>
      ))}
    </ul>
  );
};
