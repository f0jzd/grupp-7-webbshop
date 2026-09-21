"use client";
import { debounce, isValidRegExp } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const path = usePathname();
  const { replace } = useRouter();
  const [message, setMessage] = useState("");

  const handleSearch = debounce((term: string) => {
    const params = new URLSearchParams(searchParams);
    const validation = validate(term);
    if (validation.success) {
      params.delete("page");
      params.set("search", term);
    } else {
      params.delete("search");
    }

    setMessage(validation.message);
    replace(`${path}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="relative w-full sm:w-auto flex-1">
      {message && (
        <p className="absolute inset-y-10 inset-x-3 font-semibold text-red-600 text-sm">
          {message}
        </p>
      )}
      <label htmlFor="search-product" className="sr-only">
        Search for product:
      </label>
      <input
        id="search-product"
        type="search"
        placeholder="Search products..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("search")?.toString()}
      />
    </div>
  );
}

function validate(term: string): { success: boolean; message: string } {
  if (!term) {
    return { success: false, message: "" };
  }
  if (term.length < 3) {
    return { success: false, message: "Enter at least 3 characters." };
  }
  if (!isValidRegExp(term)) {
    return {
      success: false,
      message: "Invalid regular expression.",
    };
  }
  return { success: true, message: "" };
}
