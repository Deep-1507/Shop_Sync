import { useEffect, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import axios from "axios";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Inputbox } from "../components/Inputbox";
import { CustomButton } from "../components/CustomButton";
import ProductCard from "../components/ProductCard";
import DateAndTime from "../components/DateAndTime";

export const OfflineStore = () => {
    const { name } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const storeId = queryParams.get('id');
    const storeName = queryParams.get('name');
    const storeUsername = queryParams.get('username');
    const storeLocation = queryParams.get('location');

    const [products, setProducts] = useState([]);  // Initialize as an empty array
    const [productName, setProductName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    async function fetchOfflineProducts(storeId, productName = '') {
        try {
            const params = {
                id: storeId,
                productName: productName,
            };

            const response = await axios.get('http://localhost:3000/api/v1/offline-products/get-offline-products-for-users', { params });
            const fetchedProducts = Array.isArray(response.data) ? response.data : []; // Ensure it's an array
            console.log('Fetched Products:', fetchedProducts);
            return fetchedProducts;
        } catch (error) {
            console.error('Error fetching offline products:', error.response?.data || error.message);
            throw error;
        }
    }

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedProducts = await fetchOfflineProducts(storeId, productName);
                setProducts(fetchedProducts);
            } catch (err) {
                setError(err.message);
                enqueueSnackbar('Error fetching products', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [storeId, productName]);

    const handleSearchChange = (e) => {
        setProductName(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setProductName(productName);
    };

    return (
        <>
         <Navbar showCart={true} showWishlist={true} showAccount={true} showDashboard={true} showStoreDashboard={false} showLogout={true} showLogin={false} />
        <div className="p-4">
            


            <h1 className="text-center text-3xl font-semibold"> <span className="text-walmartYellow">{storeName}</span> Products</h1>


            <div className="flex justify-between items-center">
    <div className="flex flex-col">
        <p><span className="text-walmartYellow text-lg font-semibold">Store ID:</span> {storeId}</p>
        <p><span className="text-walmartYellow text-lg font-semibold">Store Username:</span> {storeUsername}</p>
        <p><span className="text-walmartYellow text-lg font-semibold">Store Location:</span> {storeLocation}</p>
    </div>

    <div>
        <DateAndTime />
    </div>
</div>


            <form onSubmit={handleSearchSubmit}>
                <Inputbox
                    type="text"
                    placeholder="Search by product name"
                    value={productName}
                    onChange={handleSearchChange}
                />
               
            </form>

            {loading && <p>Loading products...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} showTryOn={true} 
            showBuyNow={true} />
          ))}
        </div>
      </div>
           
        </div>
        <Footer />
        </>
    );
};
