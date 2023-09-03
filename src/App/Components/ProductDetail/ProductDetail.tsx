import React, { useCallback, useContext, useRef, useState } from "react";
import { product, purchaseForm } from "../../../Types/Types";
import "./../components.css";
import { BASE_IMAGE_URL, IN_CART, TO_CART } from "../../Config/Constants";
import { updateTimeSince } from "../../../Service/Products";
import { toast } from "react-hot-toast";
import { UserContext } from "../../App";
import { purchase_products } from "../../../Service/Orders";

type detailprops = {
  product: product;
  UpdateInDetailPage: (id: number) => void;
};

function ProductDetail({ product, UpdateInDetailPage }: detailprops) {
  const [Loading, SetLoading] = useState(false);
  const {user} = useContext(UserContext)
  const modalCloser = useRef<HTMLButtonElement>(null)
  const [PurchaseForm, SetPurchaseForm] = useState<purchaseForm>({
    product: product ? product.id : 0,
    quantity: 1,
  });
  const handlePurchase = useCallback(() => {
    SetLoading(true)
    if(!user) return toast.error("Please login to purchase")
    if(PurchaseForm.quantity <= 0) return toast.error("Enter a valid quantity")
    purchase_products([PurchaseForm])
    .then(()=>{
        toast.success("Purchase completed successfully, see orders")
        modalCloser.current!.click()
        SetLoading(false)
    })
    .catch((err)=>{
        console.log(err);
        
        SetLoading(false)
        toast.error("Internal Error")
    })

  }, [PurchaseForm]);

  return (
    <div className="detail-main">
      <div className="row">
        <div className="col-12 col-md-6">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {product.images.map((image, idx) => {
                return (
                  <div
                    className={
                      idx == 0
                        ? "carousel-item active detail-images"
                        : "detail-images carousel-item"
                    }
                  >
                    <img
                      src={BASE_IMAGE_URL + image}
                      className="d-block w-100"
                    />
                  </div>
                );
              })}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6 detail-texts">
          <div>
            <div className="d-flex w-100 align-items-center">
              <h3>{product.name}</h3>
              <img
                src={product.is_in_cart ? IN_CART : TO_CART}
                alt=""
                className="detail-cart-icon"
                onClick={() => {
                  UpdateInDetailPage(product.id);
                }}
              />
            </div>
            <p className="product-desc">{product.description}</p>
          </div>

          <div>
            <div className="d-flex w-100 align-items-center">
              <div>
                <p className="m-0">In {product.category.name}s</p>
                <p className="product-time">
                  Posted {updateTimeSince(product.posted_date)}
                </p>
                <p className="product-time">Vendor {product.vendor.username}</p>
              </div>
              <h6 className="detail-price">₹‎ {product.price}</h6>
            </div>
            <p
              className="w-100 app-btn1 br-7 p-2 text-center mt-1"
              data-bs-toggle="modal"
              data-bs-target="#purchaseModal"
              onClick={() =>
                SetPurchaseForm({
                  product: product ? product.id : 0,
                  quantity: 1,
                })
              }
            >
              Buy Now ₹‎ {product.price}
            </p>
          </div>
        </div>
      </div>

      {/* purchase modal */}

      <div
        className="modal fade"
        id="purchaseModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Confirm Purchase
              </h1>
              <button
              ref={modalCloser}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6>Purchasing {product.name}</h6>
              <div className="d-flex gap-1 align-items-center">
                <p>quantity</p>
                <div className="quantity-input-div">
                  <p
                    onClick={() => {
                      PurchaseForm.quantity > 1 &&
                        SetPurchaseForm({
                          ...PurchaseForm,
                          quantity: PurchaseForm.quantity - 1,
                        });
                    }}
                  >
                    -
                  </p>
                  <input type="number" value={PurchaseForm.quantity} min={1} />
                  <p
                    onClick={() =>
                      SetPurchaseForm({
                        ...PurchaseForm,
                        quantity: PurchaseForm.quantity + 1,
                      })
                    }
                  >
                    +
                  </p>
                </div>
              </div>
              <p className="mt-3">Total : ₹‎ {product.price * PurchaseForm.quantity}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn bg-app-secondary text-white add-prod-btn" onClick={handlePurchase}>
              {!Loading ? (
                  "Purchase"
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

export default ProductDetail;
