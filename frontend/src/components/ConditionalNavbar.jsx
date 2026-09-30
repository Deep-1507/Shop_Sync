import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const location = useLocation();

  const isStoreDashboard = location.pathname.includes('/store-dashboard');
  const isStoreBillingPage = location.pathname.includes('/store-billing-page');
  const hideCartAndWishlist = isStoreDashboard || isStoreBillingPage ;

  return (
    <div>
      <Navbar showCart={!hideCartAndWishlist} showWishlist={!hideCartAndWishlist} showAccount={!hideCartAndWishlist} showStoreDashboard={hideCartAndWishlist} showPdt={hideCartAndWishlist} showLogin={!hideCartAndWishlist} showLogout={hideCartAndWishlist} />
    </div>
    
  );
};

export default ConditionalNavbar;
