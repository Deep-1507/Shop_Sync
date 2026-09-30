import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CardActions,
} from "@mui/material";
import { CustomButton } from "../components/CustomButton";
import Footer from "../components/Footer";

export const Account = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar(); // To display error messages

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  const userName = queryParams.get("name");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/details`,
          {
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

  return (
    <div>
     <Navbar  showCart={true} showWishlist={true} showAccount={true}/>

      <div className="p-8">
        <div className="text-3xl text-center font-semibold underline decoration-walmartYellow">
          Account Page
        </div>

        <div className="p-4 flex justify-between">
          <div className="mt-4">
            <h2 className="text-2xl  underline decoration-walmartBlue">
              User Data
            </h2>
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

      </div>
      <Footer/>
    </div>
  );
};
