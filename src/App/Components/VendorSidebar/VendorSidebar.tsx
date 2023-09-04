import { useNavigate } from "react-router-dom";
import "./../components.css";

function VendorSidebar() {
    const Navigate = useNavigate()

  return (
    <div className="col-2 d-sm-block d-none vendor-sidebar">
      <p
        className={
          window.location.pathname.split("/")[2] == ""
            ? "sidebar-item sidebar-item-active"
            : "sidebar-item"
        }
        onClick={()=>Navigate('/vendor/')}
      >
        Products
      </p>
      <p
        className={
          window.location.pathname.split("/")[2] == "orders"
            ? "sidebar-item sidebar-item-active"
            : "sidebar-item"
        }
        onClick={()=>Navigate('/vendor/orders')}
      >
        Orders
      </p>
      <p
        className={
          window.location.pathname.split("/")[2] == "category"
            ? "sidebar-item sidebar-item-active"
            : "sidebar-item"
        }
        onClick={()=>Navigate('/vendor/category')}
      >
        Category
      </p>
    </div>
  );
}

export default VendorSidebar;
