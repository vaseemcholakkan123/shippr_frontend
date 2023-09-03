import React from "react";
import { product } from "../../../Types/Types";
import { updateTimeSince } from "../../../Service/Products";
import { BASE_IMAGE_URL, IN_CART, TO_CART } from "../../Config/Constants";
import "./../components.css";
import { useNavigate } from "react-router-dom";

type productCardProps = {
  product: product;
  updateInHome: (prod_id: number) => void;
};

function ProductCard({ product, updateInHome }: productCardProps) {
  const Navigate = useNavigate();

  return (
    <div key={product.id} className="product-card col-5 col-sm-3 bg-light">
      <div className="w-100">
        <img
          onClick={() => Navigate(`/view-product/${product.id}`)}
          src={BASE_IMAGE_URL + product.images[0]}
          alt=""
          className="product-image w-100"
        />
        <img
          src={product.is_in_cart ? IN_CART : TO_CART}
          className="cart-icon"
          alt=""
          onClick={() => {
            updateInHome(product.id);
          }}
        />
      </div>
      <div
        className="product-card-texts"
        onClick={() => Navigate(`/view-product/${product.id}`)}
      >
        <div className="d-flex w-100">
          <p className="product-title">{product.name}</p>
          <p className="price-text">₹‎ {product.price}</p>
        </div>
        <p className="category-text">In {product.category.name}</p>
        <p className="product-time">{updateTimeSince(product.posted_date)}</p>
      </div>
    </div>
  );
}

export default ProductCard;
