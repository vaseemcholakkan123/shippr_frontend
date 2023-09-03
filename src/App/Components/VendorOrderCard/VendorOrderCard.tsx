
import { useNavigate } from "react-router-dom";
import { order } from "../../../Types/Types";
import { BASE_IMAGE_URL } from "../../Config/Constants";
import "./../components.css";
import { updateTimeSince } from "../../../Service/Products";

type orderCardProps = {
  order: order;
};

function VendorOrderCard({ order }: orderCardProps) {
    const Navigate = useNavigate()

  return (
    <div className="order-card col-12 col-sm-6 col-md-4 bg-light" onClick={()=>Navigate(`/view-product/${order.product.id}`)}>
        <img src={ BASE_IMAGE_URL +  order.product.images[0]} width={100} height={100} alt="" />
      <div className="order-texts">
        <h6 className="m-0">Item : {order.product.name}</h6>
        <p>quantity : {order.quantity}</p>
        <p className="f-small">purchased : {updateTimeSince(order.purchased_on)} </p>
        <p className="f-small">paid : ₹‎ {order.total_price}</p>
      </div>
    </div>
  );
}

export default VendorOrderCard;
