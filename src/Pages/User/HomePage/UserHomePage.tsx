import { useCallback, useContext, useEffect, useState } from "react";
import { ProductCard } from "../../../App/Components";
import "./../../pages.css";
import { category, product, user } from "../../../Types/Types";
import {
  add_or_remove_from_cart,
  get_categories,
  get_user_products,
} from "../../../Service/Products";
import { toast } from "react-hot-toast";
import { UserContext } from "../../../App/App";
import { get_vendors } from "../../../Service/Auth";
import { useParams } from "react-router-dom";
import { MORE_ICON } from "../../../App/Config/Constants";

function UserHomePage() {
  const [products, Setproducts] = useState<product[]>([]);
  const [NextUrl, setNextUrl] = useState("page=1");
  const [Categories, Setcategories] = useState<category[]>([]);
  const [Vendors, SetVendors] = useState<user[]>([]);
  const { prod_query } = useParams();
  const [loadNext, loader] = useState(false);

  const [filter, setFilter] = useState<{
    category: number;
    vendor: number;
    search: string;
  }>({
    category: 0,
    vendor: 0,
    search: "",
  });
  const { user } = useContext(UserContext);

  const updateProduct = useCallback(
    (prod_id: number) => {
      if (!user) return toast.error("please login");
      Setproducts(
        products.map((product) => {
          if (product.id == prod_id)
            product.is_in_cart = !product.is_in_cart;
          return product;
        })
      );
      add_or_remove_from_cart(prod_id)
        .catch(() => {
          Setproducts(
            products.map((product) => {
              if (product.id == prod_id)
                product.is_in_cart = !product.is_in_cart;
              return product;
            })
          );
          toast.error("Network error, try again later");
        });
    },
    [products]
  );

  useEffect(() => {
    get_user_products(NextUrl, {
      ...filter,
      search: prod_query ? prod_query : "",
    })
      .then((res) => {
        Setproducts(res.data.results);

        if (res.data.next) setNextUrl(res.data.next.split("?")[1]);
        else setNextUrl("");
      })
      .catch(() => {
        toast.error("internal error");
      });

    get_vendors()
      .then((res) => {
        SetVendors(res.data);
      })
      .catch(() => {
        toast.error("Internal error");
      });

    get_categories()
      .then((res) => {
        Setcategories(res.data);
      })
      .catch(() => {
        toast.error("Internal error");
      });
  }, [filter, loadNext, prod_query]);

  return (
    <>
      <div className="home-main">
        <div className="d-block d-md-flex w-100 align-items-center main-header">
          <h3>Best { filter.category != 0  ? "in " + Categories.find(category=>category.id == filter.category)?.name : filter.vendor != 0  ? "by " + Vendors.find(vendor=>vendor.id == filter.vendor)?.username :  "products you'll ever see" }</h3>
          <p
            className="app-btn1 p-2 br-7 ms-md-auto"
            data-bs-toggle="offcanvas"
            data-bs-target="#filteroffcanvas"
            aria-controls="offcanvasRight"
          >
            Filters
          </p>
        </div>

        <div className="row gap-2 d-grid card-holder">
          {products.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                updateInHome={updateProduct}
              />
            );
          })}
          {!products[0] && (filter.category != 0 || filter.vendor != 0) ? (
            <h6 className="mt-2">No product for this filter</h6>
          ) : prod_query && !products[0] ? (
            <h5 className="m-2">No results for "{prod_query}"</h5>
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
      </div>

      {/* filter offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="filteroffcanvas"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">Filter products</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body filter-offcanvas">
          <p
            className="f-small ms-auto m-0 ms-auto  cursor-pointer"
            onClick={() => setFilter({ vendor: 0, category: 0, search: "" })}
          >
            clear filters
          </p>

          <p>Filter by category</p>
          <select
            onChange={(e) =>
              setFilter({ ...filter, category: Number(e.target.value) })
            }
          >
            {Categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>

          <p className="mt-2">by vendor</p>

          <select
            onChange={(e) =>
              setFilter({ ...filter, vendor: Number(e.target.value) })
            }
          >
            {Vendors.map((vendor) => {
              return (
                <option value={vendor.id} key={vendor.id}>
                  {vendor.username}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </>
  );
}

export default UserHomePage;
