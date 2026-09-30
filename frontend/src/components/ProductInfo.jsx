import React from "react";
import { CardMedia } from "@mui/material";
import axios from "axios";

const ProductInfo = ({ product, onAddToCart }) => {
  const token = localStorage.getItem("token");

  const imageUrl =
    product.productImages && product.productImages.length > 0
      ? product.productImages[0]
      : "/";

  const handleAddToCart = async () => {
    event.preventDefault();
    try {
      // alert("clicked")
      const response = await axios.post(
        "http://localhost:3000/api/v1/online-products/add-to-cart-online",
        {
          productId: product._id,
          productQty: Number(product.productQty),
          productPrice: product.productPrice,
          productName: product.productName,
          productImages: product.productImages,
          brand: product.brand,
          mode: product.mode,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the Authorization header
          },
        }
      );

      console.log("Product added to cart successfully:", response.data);
    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="flex p-4 gap-24 items-center justify-between m-10 rounded-md ">
        <div className="h-1/2">
          <CardMedia
            component="img"
            height="200" // Adjust height as needed
            image={imageUrl}
            alt={product.productName}
            className=" rounded-xl border-2 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl "
          />
        </div>
        <div className="flex border-0 border-gray-300 max-w-xl w-1/2 mx-auto ">
          <div className="flex-1 ">
            <h1 className="text-3xl  font-bold m-2">{product.productName}</h1>
            <p className="text-sm text-gray-600 m-2">
              {product.productDescription}
            </p>

            <div className="flex items-center m-4">
              <span className="text-yellow-500">
                {"★".repeat(product.rating)}
                {"☆".repeat(5 - product.rating)}
              </span>
              <span className="ml-2 text-gray-600">293 ratings</span>
              <span className="ml-4 text-gray-600">
                2K+ bought in past month
              </span>
            </div>

            <div className="text-gray-600 m-2">
              <span className="font-semibold">Brand:</span> {product.brand}
            </div>
            <div className="text-gray-600 m-2">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </div>
            <div className="text-gray-600 m-2">
              <span className="font-semibold">Color:</span> {product.color}
            </div>
            <div className="text-gray-600 m-2">
              <span className="font-semibold">Size:</span> {product.size}
            </div>

            <div className="flex items-baseline m-2">
              <span className="text-2xl text-green-600 font-bold mr-2">
                Rs. {product.productPrice}
              </span>
              <span className="text-sm text-gray-600">/ each</span>
            </div>

            <div className="text-green-600 m-2">In stock</div>
            <div className="m-2 text-gray-600">
              Free delivery Tuesday, 20 August
            </div>

            <div className=" p-4 flex flex-col gap-2 rounded-b-lg">
              <button
                className="bg-yellow-400 text-black px-4 py-2 border border-yellow-600 rounded-lg hover:bg-yellow-500 transition-colors text-xs sm:text-sm"
                onClick={() => handleAddToCart()}
              >
                Add to Cart
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 border border-orange-700 rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
