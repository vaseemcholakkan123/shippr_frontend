import { Route, Routes } from "react-router-dom";
import VendorHomePage from "./HomePage/VendorHomePage";
import OrdersPage from "./OrdersPage/OrdersPage";
import VendorSidebar from "../../App/Components/VendorSidebar/VendorSidebar";
import VendorNavbar from "../../App/Components/VendorNav/VendorNavbar";

function VendorRoutes() {
  return (
    <div className="row">
      <VendorNavbar />
      <VendorSidebar />
      <Routes>
        <Route path="/" element={<VendorHomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </div>
  );
}

export default VendorRoutes;
