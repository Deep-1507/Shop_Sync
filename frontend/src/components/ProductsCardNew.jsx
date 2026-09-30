import { useState } from "react";
import { CustomButton } from "../components/CustomButton";

export const ProductsCardNew = ({ product, onAddToBilling, onRemoveFromBilling, isInBillingSection = false }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <li className="border shadow-xl p-4 my-4 rounded-lg">
      {/* Display product image */}
      <div className="mb-4">
        {product.productImages && product.productImages.length > 0 ? (
          <img
            src={product.productImages[0]}
            alt={product.productName}
            className="w-full h-48 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">{product.productName}</h3>
        <p className="text-gray-700 mb-1">Price: Rs. {product.productPrice}</p>
        <p className="text-gray-700 mb-1">Quantity: {product.productQty}</p>
        <p className="text-gray-700 mb-1">Mode: {product.mode}</p>

        {showMore && (
          <div className="mt-4">
            <p className="text-gray-700 mb-1">Category: {product.category}</p>
            <p className="text-gray-700 mb-1">Brand: {product.brand}</p>
            <p className="text-gray-700 mb-1">In Stock: {product.inStock ? 'Yes' : 'No'}</p>
            <p className="text-gray-700 mb-1">Color: {product.color}</p>
            <p className="text-gray-700 mb-1">Size: {product.size}</p>
            <p className="text-gray-700 mb-1">Material: {product.material}</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="pb-4">

      
        <CustomButton
          label={showMore ? "Show Less" : "Show More"}
          onClick={() => setShowMore(prev => !prev)}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 my-4"
        />  </div>
        {isInBillingSection ? (
          <CustomButton
            label={"Remove from Billing"}
            onClick={() => onRemoveFromBilling(product._id)}
            className="w-full bg-red-500 text-white hover:bg-red-600 mt-2"
          />
        ) : (
          <CustomButton
            label={"Add to Billing"}
            onClick={() => onAddToBilling(product)}
            className="w-full bg-green-500 text-white hover:bg-green-600 mt-2"
          />
        )}
      </div>
    </li>
  );
};


