import { useCallback, useContext, useEffect, useState } from "react";
import { Navbar, ProductCard } from "../../../App/Components";
import "./../../pages.css";
import { product } from "../../../Types/Types";
import {
  add_or_remove_from_cart,
  get_user_products,
} from "../../../Service/Products";
import { toast } from "react-hot-toast";
import { UserContext } from "../../../App/App";

function UserHomePage() {
  const [products, Setproducts] = useState<product[]>([]);
  const [NextUrl, setNextUrl] = useState("");
  const { user } = useContext(UserContext);

  const updateProduct = useCallback(
    (prod_id: number) => {
      if (!user) return toast.error("please login");
      add_or_remove_from_cart(prod_id)
        .then(() => {
          Setproducts(
            products.map((product) => {
              if (product.id == prod_id)
                product.is_in_cart = !product.is_in_cart;
              return product;
            })
          );
        })
        .catch(() => {
          toast.error("Network error, try again later");
        });
    },
    [products]
  );

  useEffect(() => {
    get_user_products(NextUrl)
      .then((res) => {
        Setproducts(res.data.results);
        console.log(res);

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
        <h3>Best products you'll ever see</h3>

        <div className="row gap-2">
          {products.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                updateInHome={updateProduct}
              />
            );
          })}
        </div>
      </div>

    </>
  );
}

export default UserHomePage;
