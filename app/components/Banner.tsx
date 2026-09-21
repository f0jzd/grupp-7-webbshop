import Link from "next/link";

export default function Banner() {
  return (
    <header className="px-4 bg-white border-b border-gray-300">
      <div className="max-w-7xl w-full mx-auto flex justify-between py-4">
        <Link href={"/"}>
          <h1 className="text-xl font-bold text-black">Inventory Management</h1>
          <p className="hidden md:block text-gray-400">
            Manage and track your global product catalogue across all categories
          </p>
        </Link>

        <Link
          href="/add-product"
          className="min-h-10 px-4 flex items-center gap-2 text-white bg-indigo-500 border-2 border-indigo-500 rounded-xl hover:bg-white hover:text-black ease-in duration-100"
        >
          <span className="material-symbols text-xl font-bold">add</span>
          <p className="text-nowrap md:block">Add Product</p>
        </Link>
      </div>
    </header>
  );
}
