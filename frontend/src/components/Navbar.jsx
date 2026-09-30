import { Icon } from "@iconify/react";
import { CustomButton } from "../components/CustomButton";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { MdStoreMallDirectory } from "react-icons/md";
import storeIcon from '@iconify-icons/mdi/store';

const Navbar = ({ showCart ,showWishlist , showAccount , showDashboard , showStoreDashboard, showLogin , showLogout , showStoreLogin , showPdt}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    enqueueSnackbar("Logout successful", { variant: "success" });

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="w-full">
      <div className="Navbar w-full bg-walmartBlue flex items-center justify-between px-6 shadow-md h-20 font-sans">
        <div className="flex items-center text-white text-4xl font-bold">
          ShopSync.
        </div>
        <div className="flex items-center w-1/3 relative">
  <input
    type="text"
    placeholder="Search..."
    className="w-full px-3 py-1.5 rounded-full bg-white text-[#0071CE] focus:outline-none"
  />
  <span className="absolute right-2 flex items-center justify-center w-7 h-7 bg-walmartBlue rounded-full">
    <Icon icon="ic:baseline-search" color="white"/>
  </span>
</div>

        <div>
        <CustomButton 
  label="Try On" 
  className={`relative bg-gradient-to-r from-[#E5AF6F] to-[#D079CE] text-white py-3 px-6 rounded-lg text-lg 
              before:content-[''] before:absolute before:inset-0 before:bg-white before:opacity-10 before:rounded-lg 
              before:transition-opacity before:duration-300 before:ease-in-out hover:before:opacity-30 
              hover:shadow-lg focus:outline-none`} 
  onClick={() => { 
    const newWindow = window.open('http://localhost:8080/upload_source_image/', '_blank');
    if (newWindow) {
        newWindow.focus(); // Ensures the new tab is focused
    }
  }}
/>


        </div>

        {/* Right section with icons and logout button */}
        <div className="flex items-center space-x-6">

           {showDashboard && (
 <div className="flex items-center space-x-1 cursor-pointer mr-4 bg-walmartYellow p-2 rounded-2xl"
 onClick={() => navigate("/get-store-details")}
 >
 <Icon icon={storeIcon} width="24" color="white" />
 
 <span className="text-white">Stores Near me</span>
</div>
          )

          }

           {showDashboard && (
           
          <div>
          <div className="flex items-center space-x-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
            >
            <Icon icon="ri:dashboard-horizontal-fill" width="24" color="white" />
            <span className="text-white">Dashboard</span>
          </div>
          </div>
           
           
           )}

         {showStoreDashboard && (
            <div className="flex items-center space-x-1 cursor-pointer"
            onClick={() => navigate("/store-dashboard")}
            >
            <Icon icon="ri:dashboard-horizontal-fill" width="24" color="white" />
            <span className="text-white">Dashboard</span>
          </div>
           )}


          {showWishlist && (
            <div className="flex items-center space-x-1 cursor-pointer">
            <Icon icon="mdi:heart" width="24" color="white" />
            <span className="text-white">Wishlist</span>
          </div>
           )}

          
          {showCart && (
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => navigate("/online-cart")}
            >
              <Icon icon="tabler:shopping-cart" width="24" color="white" />
              <span className="text-white">My Cart</span>
            </div>
          )}

          {showAccount && ( 
            <div className="flex items-center space-x-1 cursor-pointer"
            onClick={() => navigate("/account")}
          >
            <Icon icon="material-symbols:person" width="24" color="white" />
            <span className="text-white">My Account</span>
          </div>
        
        )}

          {showPdt && (
            <div className="bg-white px-4 py-2 text-walmartBlue flex items-center justify-center rounded-full font-semibold cursor-pointer shadow-lg hover:bg-gray-100 transition duration-300">
            <button onClick={() => navigate("/add-product-in-store")}>
              Add your Product
            </button>
          </div>
        )}
          
        {showLogout && (
            <div className="bg-white px-4 py-2 text-walmartBlue flex items-center justify-center rounded-full font-semibold cursor-pointer shadow-lg hover:bg-gray-100 transition duration-300">
            <button onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}

          {showLogin && (
            <div className="bg-white px-4 py-2 text-walmartBlue flex items-center justify-center rounded-full font-semibold cursor-pointer shadow-lg hover:bg-gray-100 transition duration-300" >
            <button onClick={() => navigate("/auth")} >
             User Log in
            </button>
          </div>
          )}

{showStoreLogin && (
            <div className="bg-white px-4 py-2 text-walmartBlue flex items-center justify-center rounded-full font-semibold cursor-pointer shadow-lg hover:bg-gray-100 transition duration-300" >
            <button onClick={() => navigate("/store-auth")} >
             Store Log in
            </button>
          </div>
          )}

        </div>
      </div>
      <div className="bg-walmartBlue opacity-25 h-8"></div>
    </div>
  );
};

export default Navbar;