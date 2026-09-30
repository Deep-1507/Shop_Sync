import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

export const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/online-products/get-online-products"
        );
        console.log(response.data); // Check the structure here
        setProducts(response.data);
      } catch (error) {
        enqueueSnackbar("Failed to fetch products", { variant: "error" });
      }
    };
  
    fetchProducts();
  }, [enqueueSnackbar]);

  const handleAddToCart = async (product) => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/online-products/add-to-cart-online",
        {
          productId: product._id,
          productQty: 1,
          productPrice: product.productPrice,
          productName: product.productName,
          productDescription: product.productDescription,
          mode: product.mode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      enqueueSnackbar("Product added to cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add product to cart", { variant: "error" });
    }
  };

  return (
    <div className="scrollbar">
      <div className="mb-3">
        <Navbar showCart={true} showWishlist={true} showAccount={true} showDashboard={true} showStoreDashboard={false} showLogout={true} showLogin={false} />
      </div>
      

      <div className="p-8">
      <div className="text-left font-bold mb-12 ">
  <div className="text-5xl text-neutral-600">Discover Your Next Favorite!</div>
  <div className="text-4xl">Explore our top picks just for you.</div>
</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}>
              <ProductCard 
                product={product} 
                showAddToCart={true} 
                showTryOn={true} 
              />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
