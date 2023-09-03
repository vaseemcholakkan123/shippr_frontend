import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./../components.css";
import { useRef, useContext, useState, useCallback } from "react";
import { vendor_register } from "../../../Service/Auth";
import { toast } from "react-hot-toast";
import {
  CART_PNG,
  DEFAULT_USER_PROFILE,
  LOGOUT_PNG,
  ORDER_PNG,
} from "../../Config/Constants";

function VendorNavbar() {
  const [Loading, SetLoading] = useState(false);
  const modalCloser = useRef<HTMLButtonElement>(null);
  const { user, setUserData } = useContext(UserContext);
  const Navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUserData && setUserData(null);
    window.location.href = "/";
  }, []);

  const handleRegister = useCallback(() => {
    SetLoading(true);
    vendor_register()
      .then(() => {
        SetLoading(false);
        toast.success("Registered successfully");
        modalCloser.current?.click();
        setUserData && user && setUserData({ ...user, is_vendor: true });
      })

      .catch(() => {
        SetLoading(false);
        toast.error("Unknow error");
      });
  }, []);

  return (
    <div className="navbar vendor-navbar">
      <h2 onClick={() => Navigate("/vendor/")}>Shippr</h2>

      <div className="nav-actions">
        <p
          className="text-become-vendor"
        >
          Vendor @{user?.username}
        </p>

        <div className="dropdown">
          {user && (
            <img
              data-bs-toggle="dropdown"
              aria-expanded="false"
              src={DEFAULT_USER_PROFILE}
              className="prof rounded-circle"
              alt=""
            />
          )}
          <ul
            className="dropdown-menu dropdown-menu-end me-2 mt-2"
            aria-labelledby="dropdownMenuButton1"
          >
            <li
              className="nav-dropdown dropdown-item d-flex d-sm-none"
              onClick={() => Navigate("/vendor/")}
            >
              <img src={ORDER_PNG} alt="" />
              <p className="m-0">My products</p>
            </li>
            <li
              className="nav-dropdown dropdown-item d-flex d-sm-none"
              onClick={() => Navigate("/vendor/orders")}
            >
              <img src={CART_PNG} alt="" />
              <p className="m-0">Orders</p>
            </li>
            <li className="nav-dropdown dropdown-item" onClick={handleLogout}>
              <img src={LOGOUT_PNG} alt="" />
              <p className="m-0">Logout</p>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="modal fade"
        id="become_vendor_modal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Sell Products
              </h5>
              <button
                ref={modalCloser}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Become a vendor and start selling your products.</p>
              <p>Please register to continue</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-app-secondary text-white br-7 register-btn"
                disabled={Loading}
                onClick={handleRegister}
              >
                {!Loading ? (
                  "Register"
                ) : (
                  <div className="lds-facebook register-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorNavbar;
