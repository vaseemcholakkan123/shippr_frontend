import toast from "react-hot-toast";
import { MORE_ICON } from "../../../App/Config/Constants";
import {
  get_vendor_orders,
  update_order_status,
} from "../../../Service/Orders";
import { order } from "../../../Types/Types";
import "./../../pages.css";
import { useState, useEffect, useCallback, useRef } from "react";
import VendorOrderCard from "../../../App/Components/VendorOrderCard/VendorOrderCard";

function OrdersPage() {
  const [VendorOrders, SetVendorOrders] = useState<order[]>([]);
  const [NextUrl, setNextUrl] = useState("");
  const modalCloser = useRef<HTMLButtonElement>(null);
  const [UpdateOrder, SetUpdateOrder] = useState<order | null>(null);
  const [loadNext, loader] = useState(false)


  const handleOrderUpdate = useCallback(() => {
    UpdateOrder &&
      UpdateOrder.id != 0 &&
      update_order_status(UpdateOrder.id, UpdateOrder.status)
        .then((res) => {
          toast.success("Status Updated");
          SetVendorOrders(VendorOrders.map(order=>{
            if(order.id == UpdateOrder.id) return res.data;
            return order
          }))
          SetUpdateOrder(null);
          modalCloser.current!.click();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Unknown Error");
        });
  }, [UpdateOrder]);

  useEffect(() => {
    get_vendor_orders(NextUrl)
      .then((res) => {
        SetVendorOrders(res.data.results);
        console.log(res);

        if (res.data.next) setNextUrl(res.data.next.split("?")[1]);
        else setNextUrl("");
      })
      .catch(() => {
        toast.error("internal error");
      });
  }, [loadNext]);

  return (
    <div className="col-12 col-sm-10 vendor-home">
      <div className="w-100 d-flex">
        <h3>All Orders</h3>
      </div>

      <div className="row justify-space-between">
        {VendorOrders.map((order) => {
          return (
            <VendorOrderCard
              order={order}
              key={order.id}
              SetUpdateOrder={SetUpdateOrder}
            />
          );
        })}

        {
          !VendorOrders[0] ? 
            <h5 className="mt-3">You've got no orders</h5>
          :
          null
        }

          {NextUrl != "" ? (
            <div className="col-12 d-flex justify-content-center mt-2"  onClick={() => loader(!loadNext)}>
              <div className="app-btn1 d-flex p-2 br-7 align-items-center">
                <p className="m-0 me-2">Show more</p>

                <img src={MORE_ICON} width={18} height={18} alt="" />
              </div>
            </div>
          ) : null}
      </div>

      {/* update order modal */}
      <div
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        className="modal fade"
        id="updateOrderModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update order
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
              <h6>
                Update order for {UpdateOrder && UpdateOrder.product.name}
              </h6>
              <h6>placed by {UpdateOrder && UpdateOrder.user.username}</h6>
              <div className="d-flex gap-2">
                <p>Set status to</p>
                <select
                value={UpdateOrder?.status}
                  onChange={(e) =>
                    UpdateOrder &&
                    SetUpdateOrder({ ...UpdateOrder, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-app-secondary text-white"
                onClick={handleOrderUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
