import { useNavigate } from "react-router-dom";
import { order } from "../../../Types/Types";
import "./../components.css";
import { updateTimeSince } from "../../../Service/Products";
import { Dispatch,SetStateAction } from "react";

type orderCardProps = {
  order: order;
  SetUpdateOrder : Dispatch<SetStateAction<order | null>>
};

function VendorOrderCard({ order , SetUpdateOrder }: orderCardProps) {
  const Navigate = useNavigate();


  return (
      <div className="order-card col-11 col-sm-5 col-md-4 bg-light">
        <div className="order-texts" onClick={() => SetUpdateOrder(order)}>
          <h6
            className="m-0"
            onClick={() =>
              order.product.id != 0 &&
              Navigate(`/view-product/${order.product.id}`)
            }
          >
            Item :{" "}
            <span className="vendor-order-item">{order.product.name}</span>
          </h6>
          <p
            data-bs-toggle="modal"
            data-bs-target="#updateOrderModal"
          >
            quantity : {order.quantity}
          </p>
          <p
            data-bs-toggle="modal"
            data-bs-target="#updateOrderModal"
            className="f-small"
          >
            purchased by : {order.user.username}{" "}
            {updateTimeSince(order.purchased_on)}{" "}
          </p>
          <p
            data-bs-toggle="modal"
            data-bs-target="#updateOrderModal"
            className="f-small"
          >
            paid : ₹‎ {order.total_price}
          </p>
          <p
            data-bs-toggle="modal"
            data-bs-target="#updateOrderModal"
            className={
              order.status == "Pending"
                ? "f-small text-danger"
                : order.status == "Shipped"
                ? "f-small text-warning"
                : "f-small text-success"
            }
          >
            status : {order.status}
          </p>
        </div>
      </div>

  );
}

export default VendorOrderCard;
