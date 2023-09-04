import { Route, Routes } from "react-router-dom";
import VendorHomePage from "./HomePage/VendorHomePage";
import OrdersPage from "./OrdersPage/OrdersPage";
import VendorSidebar from "../../App/Components/VendorSidebar/VendorSidebar";
import VendorNavbar from "../../App/Components/VendorNav/VendorNavbar";
import CategoryPage from "./CategoryPage/CategoryPage";

function VendorRoutes() {
  return (
    <div className="row">
      <VendorNavbar />
      <VendorSidebar />
      <Routes>
        <Route path="/" element={<VendorHomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/category" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}

export default VendorRoutes;
