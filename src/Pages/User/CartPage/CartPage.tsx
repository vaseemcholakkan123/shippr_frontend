import { useState, useContext, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../../App/App";
import { ProductCard } from "../../../App/Components";
import {
  add_or_remove_from_cart,
  get_user_cart_items,
  get_user_products,
} from "../../../Service/Products";
import { cartitem, product, purchaseForm } from "../../../Types/Types";
import "./../../pages.css";
import { purchase_products } from "../../../Service/Orders";

function CartPage() {
  const [cartItems, SetCartItems] = useState<cartitem[]>([]);
  const [NextUrl, setNextUrl] = useState("");
  const { user } = useContext(UserContext);
  const [Loading, SetLoading] = useState(false);
  const modalCloser = useRef<HTMLButtonElement>(null);
  const [purchaseForms, SetPurchaseForms] = useState<purchaseForm[]>([]);

  const handlePurchase = useCallback(() => {
    SetLoading(true);
    if (!user) return toast.error("Please login to purchase");
    purchaseForms.map(form=>{
        if(form.quantity <= 0) return toast.error("Enter a valid quantity")
    })
    purchase_products(purchaseForms)
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
  }, [purchaseForms]);

  const updateProduct = useCallback(
    (prod_id: number) => {
      if (!user) return toast.error("please login");
      add_or_remove_from_cart(prod_id)
        .then(() => {
        SetPurchaseForms(purchaseForms.filter(form=>form.product != prod_id))
          SetCartItems(
            cartItems.filter((cart_item) => cart_item.product.id != prod_id)
          );
        })
        .catch(() => {
          toast.error("Network error, try again later");
        });
    },
    [cartItems]
  );

  useEffect(() => {
    get_user_cart_items(NextUrl)
      .then((res) => {
        SetCartItems(res.data.results);
        if (res.data.next) setNextUrl(res.data.next.split("?")[1]);
        else setNextUrl("");
      })
      .catch(() => {
        toast.error("internal error");
      });
  }, [NextUrl]);

  return (
    <>
      <div className="home-main">
        <div className="d-flex w-100">
          <h3>Your Cart</h3>
          <p
            className="app-btn1 ms-auto br-7 p-2"
            data-bs-toggle="modal"
            data-bs-target="#purchaseModal"
            onClick={() =>
              SetPurchaseForms(
                cartItems.map((cart_item) => {
                  return {
                    product: cart_item.product.id,
                    quantity: 1,
                  };
                })
              )
            }
          >
            Purchase All
          </p>
        </div>

        <div className="row gap-2">
          {cartItems.map((cart_item) => {
            return (
              <ProductCard
                key={cart_item.product.id}
                product={cart_item.product}
                updateInHome={updateProduct}
              />
            );
          })}
          {!cartItems[0] ? (
            <h5 className="m-3">No items in your cart</h5>
          ) : null}
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
              <h6>Purchasing cart items</h6>

              <div className="row gap-1">
                {purchaseForms.map((form) => {
                  return (
                    <div key={form.product} className="mt-3 cart-purchase-item col-11 col-md-5">
                      <p className="mb-2">
                        {
                          cartItems.find(
                            (item) => item.product.id == form.product
                          )?.product.name
                        }
                      </p>
                      <div className="d-flex gap-1 align-items-center">
                        <p>quantity</p>
                        <div className="quantity-input-div">
                          <p
                            onClick={() => {
                              form.quantity > 1 &&
                                SetPurchaseForms(
                                  purchaseForms.map((current_form) => {
                                    if (current_form.product == form.product)
                                      current_form.quantity -= 1;
                                    return current_form;
                                  })
                                );
                            }}
                          >
                            -
                          </p>
                          <input type="number" value={form.quantity} min={1} />
                          <p
                            onClick={() =>
                              SetPurchaseForms(
                                purchaseForms.map((current_form) => {
                                  if (current_form.product == form.product) {
                                    current_form.quantity += 1;
                                  }
                                  return current_form;
                                })
                              )
                            }
                          >
                            +
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2 mb-3">
                Total to pay :{" ₹‎ "}
                {purchaseForms.reduce(
                  (total, form) =>
                    total +
                    form.quantity *
                      cartItems.find((item) => item.product.id == form.product)!
                        .product.price,
                  0
                )}
              </p>

              <div className="modal-footer">
                <button
                disabled={Loading}
                  type="button"
                  className="btn bg-app-secondary text-white add-prod-btn"
                  onClick={handlePurchase}
                >
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
    </>
  );
}

export default CartPage;
