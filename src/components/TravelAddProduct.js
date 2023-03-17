
import { useState, useEffect } from "react";

function TravelAddProduct({ onAddProduct }) {
  const [productName, setProductName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddProduct({ productName, productUrl, sellingPrice });
    setProductName('');
    setProductUrl('');
    setSellingPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Add Product</h2>
      <div className="mb-4">
        <label
          htmlFor="product-name"
          className="block text-gray-700 font-medium mb-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="product-name"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          className="border-gray-300 border rounded-md px-4 py-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="product-url"
          className="block text-gray-700 font-medium mb-2"
        >
          Product URL
        </label>
        <input
          type="url"
          id="product-url"
          value={productUrl}
          onChange={(event) => setProductUrl(event.target.value)}
          className="border-gray-300 border rounded-md px-4 py-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="selling-price"
          className="block text-gray-700 font-medium mb-2"
        >
          Selling Price
        </label>
        <input
          type="number"
          id="selling-price"
          value={sellingPrice}
          onChange={(event) => setSellingPrice(event.target.value)}
          className="border-gray-300 border rounded-md px-4 py-2 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md"
      >
        Add Product
      </button>
    </form>
  );
}
export default TravelAddProduct;
