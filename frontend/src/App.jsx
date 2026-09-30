import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import './App.css';
import { Dashboard } from "./pages/Dashboard";
import { StoreDashBoard } from "./pages/StoreDashBoard";
import {BillingPage} from './pages/BillingPage';
import { Account } from './pages/Account';
import { Cart } from "./pages/Cart";
import { SnackbarProvider } from 'notistack';
import AuthContainer from './pages/AuthContainer';
import StoreAuth from './pages/StoreAuth';
import HomePage from './pages/Homepage';
import {AddProductoffline} from './pages/AddProduct-offline';
import {AddProductonline} from './pages/AddProduct-online';
import ProductInfoPage from './pages/ProductInfoPage';
import {Getofflinestores} from './pages/Get-offline-stores';
import {OfflineStore} from './pages/Offline-Store';
// import { Products } from "./pages/Products";

function App() {
  const [count, setCount] = useState(0);

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/add-product-in-store" element={<AddProductoffline />} />
          <Route path="/add-product-in-onlinestore" element={<AddProductonline />} />
          <Route path="/store-auth" element={<StoreAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/online-cart" element={<Cart />} />
          <Route path="/store-dashboard" element={< StoreDashBoard />} />
          <Route path="/store-billing-page" element={<BillingPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/get-store-details" element={<Getofflinestores />} />
          <Route path="/:name-products" element={<OfflineStore />} />
          <Route path="/product/:productId" element={<ProductInfoPage />} />
          {/* <Route path="/online-products" element={<Products />} /> */}
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
