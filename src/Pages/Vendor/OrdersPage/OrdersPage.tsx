import { ADD } from "../../../App/Config/Constants";
import { product } from "../../../Types/Types";
import "./../../pages.css";
import { useState, useEffect } from "react";

function OrdersPage() {
  const [VendorProducts, SetVendorProducts] = useState<product[]>([]);
  const [Resolved, Setresolved] = useState(false);

  return (
    <div className="col-12 col-sm-10 vendor-home">
      <div className="w-100 d-flex">
        <h3>All Orders</h3>
      </div>

      <div className="row"></div>





      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body add-product-modal">
              

            </div>
            <div className="modal-footer">

              <button type="button" className="btn bg-app-secondary text-white">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
