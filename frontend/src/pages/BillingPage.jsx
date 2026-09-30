import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ConditionalNavbar from "../components/ConditionalNavbar";
import { Inputbox } from "../components/Inputbox";
import Navbar from "../components/Navbar";
import "./Signin.css";
import FullPagePopup from "../components/FullPagePopup";
import DateAndTime from "../components/DateAndTime";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CardActions,
} from "@mui/material";
import { CustomButton } from "../components/CustomButton";
import { ProductsCardNew } from "../components/ProductsCardNew";
import Footer from "../components/Footer";

export const BillingPage = () => {
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [billingProducts, setBillingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [TotalBillvalue,setTotalBillValue] = useState(null);
  const [productsOffline, setProductsOffline] = useState([]);
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar(); // To display error messages

    const today = new Date();
    const sessionDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const sessionTime = today.toTimeString().split(' ')[0]; // HH:MM:SS

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  const userName = queryParams.get("name");
  const userUsername = queryParams.get("username");
  console.log(billingProducts);

  useEffect(() => {
    const calculateTotalAmount = () => {
        const total = billingProducts.reduce((acc, product) => acc + parseFloat(product.productPrice), 0);
        setTotalBillValue(total);
    };

    calculateTotalAmount();
}, [billingProducts]);




  const addToBilling = (product) => {
    setBillingProducts((prevBillingProducts) => {
      if (!prevBillingProducts.some((p) => p._id === product._id)) {
        return [...prevBillingProducts, product];
      }
      return prevBillingProducts;
    });
  };

  const removeFromBilling = (productId) => {
    setBillingProducts((prevBillingProducts) =>
      prevBillingProducts.filter((product) => product._id !== productId)
    );
  };

  useEffect(() => {
    const fetchProductsOffline = async () => {
      setLoading(true);
      setError("");
      console.log("Token used for request:", token); // Debugging line
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/offline-products/get-offline-products",
          {
            params: query ? { productName: query } : {},
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProductsOffline(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Error fetching products");
        console.error("Fetch error:", err); // Log the error for more details
      }
      setLoading(false);
    };
  
    fetchProductsOffline();
  }, [query, token]);
  
  

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/details`,
          {
            params: { id: userId }, // Pass userId as a query parameter
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserData(response.data.user); // Access user data correctly
      } catch (error) {
        setError(error.message);
        enqueueSnackbar("Failed to fetch user data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, enqueueSnackbar]);

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/stores/details`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStoreData(response.data.store);
      } catch (error) {
        setError(error.message);
        enqueueSnackbar("Failed to fetch store data", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/v1/online-products/getitems-from-onlinecart-for-billing",
                {
                    params: { id: userId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProducts(response.data.CartProducts);
        } catch (error) {
            enqueueSnackbar("Failed to fetch products from cart", {
                variant: "error",
            });
        }
    };

    fetchProducts();
}, [enqueueSnackbar, token, userId]);

const handleSubmit = async () => {
  try {
      // Prepare the data to be sent in the request
      const data = {
          sessionDate,
          sessionTime,
          storeId: storeData._id,
          storeHandlersName: `${storeData.firstName} ${storeData.lastName}`,
          userId: userData._id,
          customersName: `${userData.firstName} ${userData.lastName}`,
          Items: billingProducts, // Ensure this is an array of items
          billingAmount: TotalBillvalue,
      };

      // Make the API request
      const response = await axios.post(
          'http://localhost:3000/api/v1/stores/create-session',
          data,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
  setSuccess('Session created successfully!');
  setError('');
  console.log(response.data); // Log the response data if needed

  // Set popup message and show popup
  setPopupMessage('Billing Done! Session Closed Successfully! Thank you for shopping with us 😊');
  setShowPopup(true);
} catch (err) {
  // Handle errors
  setError('Error creating session');
  setSuccess('');
  console.error(err);
}

};



  return (
    <div className="flex flex-col min-h-screen">
       
      {/* Your component content */}
      {/* <button onClick={handleSubmit}>Submit</button> */}
      {showPopup && <FullPagePopup message={popupMessage} duration={2000} navigateTo="/store-dashboard" />}
    
      <div>
        <ConditionalNavbar/>
      </div>

      <div className="p-10 ">
      <div className="flex justify-between items-center">
  <div className=" text-left font-bold">
    <div className="text-5xl text-neutral-600">Welcome!</div>
    <div className="text-4xl">Simplified billing awaits.</div>
  </div>
  
  <div className="p-4">
    <DateAndTime />
  </div>
</div>


        <div className="p-4 flex justify-between rounded-2xl shadow-2xl bg-slate-50 ">
          <div className="mt-4">
          <div className="text-3xl p-3 flex items-baseline">
              <div className="text-cyan-800 mr-1 font-bold"> STORE</div>
              <div className="font-extralight">DATA</div>
            </div>
            {loading && <div>Loading store data...</div>}
            {error && <div>Error: {error}</div>}
            {storeData ? (
              <div>
                <div>Id: {storeData._id}</div>
                <div>
                  Name: {storeData.firstName} {storeData.lastName}
                </div>
                <div>Username: {storeData.username}</div>
                <div>Location: {storeData.location}</div>
              </div>
            ) : (
              !loading && <div>No store data available</div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-3xl p-3 flex items-baseline">
              <div className="text-cyan-800 mr-1 font-bold"> USER</div>
              <div className="font-extralight">DATA</div>
            </div>
            {loading && <div>Loading user data...</div>}
            {error && <div>Error: {error}</div>}
            {userData ? (
              <div>
                <div>Id: {userData._id}</div>
                <div>
                  Name: {userData.firstName} {userData.lastName}
                </div>
                <div>Username: {userUsername}</div>
                {/* Display additional user data here if available */}
              </div>
            ) : (
              !loading && <div>No user data available</div>
            )}
          </div>
        </div>

        <hr />

        <div className="flex mt-4 rounded-2xl shadow-2xl bg-slate-50">
          <div className="w-1/3 ">
            <h2 className="text-2xl text-center font-sans mt-5 mb-4">
              Products Section
            </h2>
            <hr  class="border-t border-gray-300"></hr>
           
            <div className="w-full p-3">
              <Inputbox
                label={"Search Products"}
                placeholder={"Enter Product ID or Name"}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            
            <div className="p-4">
            <div className=" overflow-y-scroll h-192 scrollbar ">
              {productsOffline.length > 0 ? (
                <ul>
                  {productsOffline.map((product) => (
                    <li key={product._id} className="border shadow-xl p-4 my-4">
                      <p>ID:{product._id}</p>
                      <p>Mode:{product.mode}</p>
                      <h3>{product.productName}</h3>
                      <p>{product.productDescription}</p>
                      <p>Price: {product.productPrice}</p>
                      <p>Quantity: {product.productQty}</p>
                      <span className="">
                        <CustomButton
                          label={"Add to Billing"}
                          onClick={() => addToBilling(product)}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products found</p>
              )}
            </div>
            </div>
          </div>
         

          <div className="w-1/3 bg-walmartBlue bg-opacity-5 rounded-2xl shadow-2xl  ">
            <h2 className="text-2xl text-center font-sans mt-5 mb-4">
              Billing Section
            </h2>
            <hr  class="border-t border-gray-300"></hr>
            <div className="p-4 ">
            <div className="overflow-y-scroll h-192 scrollbar">
              {billingProducts.length > 0 ? (
                <ul>
                  {billingProducts.map((product) => (
                    <li key={product._id} className="border shadow-xl p-4 my-4">
                      <p>{product._id}</p>
                      <p>Mode:{product.mode}</p>
                      <h3>{product.productName}</h3>
                      <p>{product.productDescription}</p>
                      <p>Price: {product.productPrice}</p>
                      <p>Quantity: {product.productQty}</p>
                      <span className="">
                        <CustomButton
                          label={"Remove from Billing"}
                          onClick={() => removeFromBilling(product._id)}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products found</p>
              )}

              <div className="flex border-4 rounded-lg justify-between shadow-xl p-4">
                <div>Total Amount:</div>
                <div>{TotalBillvalue}</div>
              </div>
              <button
                onClick={handleSubmit}
                type="button"
                className="w-full text-white bg-red-600 mt-8 hover:bg-red-800 focus:outline-none cursor-pointer focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
              >
                Start Billing and Close the Session
              </button>
              </div>
            </div>
          </div>

          <div className=" "></div>
          <div className="w-1/3">
            <h2 className="text-2xl text-center font-sans mt-5 mb-4">
              Users Online Cart
            </h2>
            <hr  class="border-t border-gray-300"></hr>
           
            <div className="m-4 font-semibold text-center ">
              <span className="text-2xl text-gray-800">
                Cart: {products.length} item{products.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="p-3">
            <div className="overflow-y-scroll h-192 scrollbar">
           
          
  {products.length > 0 ? (
    <ul>
      {products.map((product) => (
        <ProductsCardNew
          key={product._id}
          product={product}
          onAddToBilling={addToBilling}
        />
      ))}
    </ul>
  ) : (
    <p>No products found</p>
  )}

            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
