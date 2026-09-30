import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { CustomButton } from './CustomButton';

const ProductCard = ({ product, showAddToCart, showTryOn, showBuyNow, children }) => {
  const imageUrl = product.productImages && product.productImages.length > 0
    ? product.productImages[0]
    : '/'; // Placeholder image if no image data

  const handleTryOn = async () => {
    try {
      const response = await axios.post('http://localhost:8080/upload_product_image/', {
        imageUrl: imageUrl,
      }, {
        withCredentials: true, // This ensures cookies are sent with the request
      });

      console.log('Image uploaded successfully:', response.data);
      localStorage.setItem('source_image', response.data);
      // Redirect to the upload_source_image page in a new window
      const newWindow = window.open('http://localhost:8080/upload_profile_image/', '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddToCart = async () => {
    event.preventDefault(); 
    try {

      const response = await axios.post(
        "http://localhost:3000/api/v1/online-products/add-to-cart-online",
        {
          productId: product._id,
          productQty: Number(product.productQty),
          mode: product.mode,
        },
        {
          withCredentials: true,
        }
      );
  
      console.log("Product added to cart successfully:", response.data);
      
    } catch (error) {
      console.error("Error adding product to cart:", error.response?.data || error.message);
    }
  };

  const handleBuyNow = () => {
    // Implement the Buy Now functionality here
    console.log("Buy Now clicked for:", product.productName);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
      <img
        src={imageUrl}
        alt={product.productName}
        className="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">
          {product.productName}
        </h2>
        <p className="text-gray-700 mb-2">{product.productDescription}</p>
        <p className="text-lg font-bold text-green-600 mb-4">Rs. {product.productPrice}</p>
        <div className="flex gap-2">

        {showBuyNow && (
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleBuyNow} 
              className="flex-1 transition-transform duration-300 hover:scale-105"
            >
              Buy Now
            </Button>
          )}
          
          {showAddToCart && (
            <CustomButton label={"Add to Cart"} onClick={handleAddToCart} className={"flex-1 transition-transform duration-300 hover:scale-105"}/>
          )}
          {showTryOn && (
           <CustomButton 
           label="Try On" 
           className={`relative bg-gradient-to-r from-[#E5AF6F] to-[#D079CE] text-white py-3 px-6 rounded-lg text-lg 
                       before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-30 
                       hover:shadow-lg focus:outline-none`} 
           onClick={handleTryOn}
         />
          )}

          {children}
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
