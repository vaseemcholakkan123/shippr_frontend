import {
  ADD,
  BASE_IMAGE_URL,
  CLOSE,
  DEFAULT_PROD_IMAGES,
  MORE_ICON,
  OPTIONS,
} from "../../../App/Config/Constants";
import { category, product, productform } from "../../../Types/Types";
import "./../../pages.css";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  delete_product,
  get_categories,
  get_object_url,
  get_vendor_products,
  updateTimeSince,
  vendor_add_product,
  vendor_update_product,
} from "../../../Service/Products";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const image_looper = [0, 1, 2];

function VendorHomePage() {
  const [VendorProducts, SetVendorProducts] = useState<product[]>([]);
  const [prod_images, SetproductImages] = useState<(File | string)[]>([]);
  const [Resolved, Setresolved] = useState(false);
  const [Categories, Setcategories] = useState<category[]>([]);
  const [Loading, Setloading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const modalCloser = useRef<HTMLButtonElement>(null);
  const modalOpener = useRef<HTMLDivElement>(null);
  const [NextUrl, setNextUrl] = useState("");
  const deleteModalCloser = useRef<HTMLButtonElement>(null);
  const [updating, Setupdating] = useState(0);
  const [deleteProduct, SetDeleteProduct] = useState<product | null>(null);
  const [loadNext, loader] = useState(false);
  const Navigate = useNavigate()
  const [productform, SetProductForm] = useState<productform>({
    name: "",
    description: "",
    price: 0,
    category: 0,
  });

  const ValidateForm = useCallback(() => {
    if (productform.name == "") {
      toast.error("Enter a name");
      return false;
    }
    if (productform.category == 0) {
      toast.error("Select a category");
      return false;
    }
    if (productform.description == "") {
      toast.error("Enter a description");
      return false;
    }
    if (productform.price <= 0) {
      toast.error("Enter a valid price");
      return false;
    }
    if (prod_images.length < 1) {
      toast.error("Add atleast one image");
      return false;
    }
    return true;
  }, [productform, prod_images]);

  const handleUpdateProductRequest = useCallback(() => {
    if (ValidateForm()) {
      Setloading(true);
      vendor_update_product(updating, { ...productform, images: prod_images as File[] })
        .then((res) => {
          Setloading(false);
          toast.success("product updated");
          modalCloser.current!.click();
          SetVendorProducts(
            VendorProducts.map((prod) => {
              if (prod.id === updating) return res.data;
              return prod;
            })
          );
          Setupdating(0);
        })

        .catch((err) => {
          Setloading(false);
          if (err.response.data.message) {
            toast.error(err.response.data.message);
          } else toast.error("Unknown error");
          console.log(err);
        });
    }
  }, [productform, prod_images, VendorProducts, updating]);

  const handleUpdateProduct = useCallback((product: product) => {
    Setupdating(product.id);
    setShowDropdown(false);
    setActiveDropdown(-1)
    SetProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category.id,
    });
    SetproductImages(product.images.map((image) => image));
    modalOpener.current?.click();
  }, []);

  const handleAddProduct = useCallback(() => {
    if (ValidateForm()) {
      Setloading(true);
      vendor_add_product({ ...productform, images: prod_images as File[] })
        .then((res) => {
          console.log(res);

          Setloading(false);
          toast.success("product added");
          modalCloser.current!.click();
          SetVendorProducts([res.data, ...VendorProducts]);
        })

        .catch((err) => {
          Setloading(false);
          if (err.response.data.message) {
            toast.error(err.response.data.message);
          } else toast.error("Unknown error");
          console.log(err);
        });
    }
  }, [productform, prod_images, VendorProducts]);

  useEffect(() => {
    get_vendor_products(NextUrl)
      .then((res) => {
        Setresolved(true);
        console.log(res);

        SetVendorProducts(res.data.results);

        if (res.data.next) setNextUrl(res.data.next.split("?")[1]);
        else setNextUrl("");
      })
      .catch((err) => {
        console.log(err);

        toast.error("Uknown error");
      });
  }, [loadNext]);

  return (
    <div className="col-12 col-sm-10 vendor-home">
      <div className="w-100 d-flex">
        <h3>Your Products</h3>
        <div
          ref={modalOpener}
          className="ms-auto me-1 d-flex gap-1 align-items-center add-product-btn"
          onClick={() => {
            get_categories()
              .then((res) => {
                Setcategories(res.data);
              })
              .catch(() => toast.error("error while getting categories"));
          }}
          data-bs-toggle="modal"
          data-bs-target="#add_update_modal"
        >
          <p className="m-0">Add</p>
          <img src={ADD} className="add-icon" alt="" />
        </div>
      </div>

      <div className="row gap-1 card-holder d-grid mt-2">
        {VendorProducts.map((product) => {
          return (
            <div key={product.id} className="product-card bg-light">
              <div className="w-100">
                <img
                  src={BASE_IMAGE_URL + product.images[0]}
                  alt=""
                  className="product-image w-100"
                />
                <div className="dropdown">
                  <img
                    onClick={() => {
                      setShowDropdown(!showDropdown)
                      setActiveDropdown(product.id)
                    }}
                    src={OPTIONS}
                    className="option-png rounded-circle"
                    role="button"
                    id={`dropdownMenuButton${product.id}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <ul
                    className={`dropdown-menu ${showDropdown && product.id === activeDropdown ? "show" : ""}`}
                    aria-labelledby={`dropdownMenuButton${product.id}`}
                  >
                    <li className="dropdown-item" onClick={()=>Navigate(`/view-product/${product.id}`)}>View</li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        handleUpdateProduct(product);
                      }}
                    >
                      Edit
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        SetDeleteProduct(product)
                        setShowDropdown(false);
                        setActiveDropdown(-1)
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                    >
                      Delete
                    </li>
                  </ul>
                </div>
              </div>

              <div className="product-card-texts">
                <div className="d-flex w-100">
                  <p className="product-title">{product.name}</p>
                  <p className="price-text">₹‎ {product.price}</p>
                </div>
                <p className="category-text">{product.category.name}</p>
                <p className="product-time">
                  {updateTimeSince(product.posted_date)}
                </p>
              </div>
            </div>
          );
        })}

        {Resolved && !VendorProducts[0] ? (
          <h5>You have not added any products yet.</h5>
        ) : !Resolved ? (
          <div className="lds-facebook register-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : null}

        {NextUrl != "" ? (
          <div
            className="col-12 d-flex justify-content-center mt-2"
            onClick={() => loader(!loadNext)}
          >
            <div className="app-btn1 d-flex p-2 br-7 align-items-center">
              <p className="m-0 me-2">Show more</p>

              <img src={MORE_ICON} width={18} height={18} alt="" />
            </div>
          </div>
        ) : null}
      </div>

      {/* add / edit product modal */}

      <div
        className="modal fade"
        id="add_update_modal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog add-product-modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add details
              </h5>
              <button
                ref={modalCloser}
                onClick={() => {
                  Setupdating(0);
                  SetProductForm({
                    name: "",
                    description: "",
                    price: 0,
                    category: 0,
                  });
                  SetproductImages([]);
                }}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body add-product-modal">
              <div className="w-100">
                <label htmlFor="product_name" className="w-100">
                  Product name
                </label>
                <input
                  value={productform.name}
                  onChange={(e) => {
                    SetProductForm({ ...productform, name: e.target.value });
                  }}
                  type="text"
                  id="product_name"
                  className="col-12 col-sm-6"
                />
              </div>

              <div className="w-100">
                <label htmlFor="product_category" className="w-100">
                  Category
                </label>
                <select
                  value={productform.category}
                  id="product_category"
                  onChange={(e) => {
                    SetProductForm({
                      ...productform,
                      category: parseInt(e.target.value),
                    });
                  }}
                >
                  <option value={0}>select</option>
                  {Categories.map((category) => {
                    return (
                      <option value={category.id} key={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-100">
                <label htmlFor="product_description">Product description</label>
                <textarea
                  value={productform.description}
                  id="product_description"
                  rows={3}
                  onChange={(e) =>
                    SetProductForm({
                      ...productform,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="w-100">
                <label htmlFor="product_price" className="w-100">
                  Product price
                </label>
                <input
                  value={productform.price != 0 ? productform.price : ""}
                  onChange={(e) =>
                    SetProductForm({
                      ...productform,
                      price: Number(e.target.value),
                    })
                  }
                  type="number"
                  min={1}
                  id="product_price"
                  className="w-100"
                />
              </div>

              <div className="row gap-3">
                <div className="col-12 d-flex">
                  <label htmlFor="product_images">Images</label>
                  <div className="ms-auto me-md-1 me-0">
                    <label htmlFor="product_images">
                      Add
                      <img src={ADD} className="add-icon ms-md-2 ms-1" alt="" />
                    </label>
                    <input
                      multiple
                      accept="image/png, image/gif, image/jpeg ,image/webp"
                      type="file"
                      id="product_images"
                      className="d-none"
                      onChange={(e) => {
                        let new_images: File[] = [];
                        if (e.target.files && prod_images.length < 4) {
                          for (
                            let idx = 0;
                            idx < e.target.files.length;
                            idx++
                          ) {
                            new_images.push(e.target.files[idx]);
                          }
                        }
                        SetproductImages([...prod_images, ...new_images]);
                      }}
                    />
                  </div>
                </div>

                {image_looper.map((i) => {
                  return (
                    <div
                      key={i}
                      className="col-5 col-sm-3 d-flex align-items-center prod-image-cotainer"
                    >
                      <img
                        src={
                          prod_images[i]
                            ? get_object_url(prod_images[i])
                            : DEFAULT_PROD_IMAGES
                        }
                        alt=""
                        className={
                          prod_images[i] ? "col-12 bg-app-secondary2" : "col-12"
                        }
                      />
                      {prod_images[i] ? (
                        <img
                          src={CLOSE}
                          width={22}
                          height={22}
                          className="prod-image-close"
                          alt=""
                          onClick={() => {
                            prod_images.splice(i, 1);
                            SetproductImages([...prod_images]);
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn text-white bg-app-secondary add-prod-btn"
                onClick={() => {
                  updating != 0
                    ? handleUpdateProductRequest()
                    : handleAddProduct();
                }}
              >
                {!Loading ? (
                  updating != 0 ? (
                    "Update"
                  ) : (
                    "Add"
                  )
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

      {/* delete product modal */}

      <div
        className="modal fade"
        id="delete-modal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Delete product
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                ref={deleteModalCloser}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h4>Deleting {deleteProduct ? deleteProduct.name : ""}</h4>
              <p>This will delete all the related photos</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary bg-app-secondary"
                onClick={(e) => {
                  e.currentTarget.innerText = "Deleting...";
                  deleteProduct &&
                    delete_product(deleteProduct.id)
                      .then(() => {
                        SetVendorProducts(
                          VendorProducts.filter(
                            (product) => product.id != deleteProduct.id
                          )
                        );
                        toast.success("Product deleted");
                        deleteModalCloser.current?.click();
                        e.currentTarget.innerText = "Delete";
                      })
                      .catch((er) => {
                        console.log(er);
                        e.currentTarget.innerText = "Delete";
                      });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorHomePage;
