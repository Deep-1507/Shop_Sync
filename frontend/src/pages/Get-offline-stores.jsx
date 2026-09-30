import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Inputbox } from "../components/Inputbox";
import { CustomButton } from "../components/CustomButton";
import { Search } from "../components/Search";

export const Getofflinestores = () => {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar(); // To display error messages

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/api/v1/user/get-store-details", {
          params: { filter },
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(response.data.user);
      } catch (error) {
        setError(error.message);
        enqueueSnackbar("Failed to fetch users", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [filter, token, enqueueSnackbar]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mb-3">
      <Navbar showCart={true} showWishlist={true} showAccount={true} showDashboard={true} showStoreDashboard={false} showLogout={true} showLogin={false} />
      </div>
       <div className="flex justify-between items-center mt-5">
  <div className=" text-left font-bold ml-12">
  
    <div className="text-4xl">Offline Stores near you!</div>
  </div>
  
  <div className="p-8 flex-grow ">
  <Search
            label={"Search Store"}
            placeholder={"Enter Location"}
            onChange={(e) => setFilter(e.target.value)}
          />
  </div>
</div>
       
        <div className="p-8">
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {stores.length > 0 ? (
            stores.map((store) => <Store key={store._id} store={store} />)
          ) : (
            !loading && <div>No users found</div>
          )}
        </div>
      
      <Footer />
    </div>
  );
};

// User component defined here
const Store = ({ store }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between  p-8 m-4 shadow-lg hover:bg-yellow-50 rounded-lg transition ease-in-out duration-300 transform hover:scale-105 ">
      <div className="flex">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-walmartYellow flex items-center justify-center">
            {store.firstName[0]}
          </div>
        </div>
        <div className="ps-8">
          <div>Id: {store._id}</div>
          <div>
            Name: {store.firstName} {store.lastName}
          </div>
          <div>
            Location: {store.location}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <CustomButton
          label={"Enter the Store"}
          onClick={() => {
            const name = encodeURIComponent(store.firstName + " " + store.lastName);
            navigate(`/${name}-products?id=${store._id}&name=${name}&username=${store.username}&location=${store.location}`);
          }}
        />
      </div>
    </div>
  );
};
