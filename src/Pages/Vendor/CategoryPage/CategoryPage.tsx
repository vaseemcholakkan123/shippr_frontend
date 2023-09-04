import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { get_categories, vendor_add_category } from "../../../Service/Products";
import { category } from "../../../Types/Types";
import { ADD } from "../../../App/Config/Constants";
import './../../pages.css'

function CategoryPage() {
  const CategorymodalCloser = useRef<HTMLButtonElement>(null);
  const [Categories, Setcategories] = useState<category[]>([]);
  const [NewCategory, SetAddCategory] = useState("")

  const add_category = useCallback(() => {
    if (NewCategory == "")
      return toast.error("Enter a name");
    vendor_add_category({ name: NewCategory })
      .then((res) => {
        Setcategories([res.data, ...Categories]);
        toast.success("category added");
        CategorymodalCloser.current!.click();
        SetAddCategory("")
      })
      .catch(err => {
        if(err.response.data.name) return toast.error(err.response.data.name)
        toast.error("Uknown error");
      });
  }, [NewCategory, Categories]);

  useEffect(() => {
    get_categories()
      .then((res) => {
        Setcategories(res.data);
      })
      .catch(() => toast.error("error while getting categories"));
  }, []);

  return (
    <div className="col-12 col-sm-10 vendor-home">
      <div className="w-100 d-flex">
        <h3>All Categories</h3>
        <div
          className="ms-auto me-1 d-flex gap-1 align-items-center add-product-btn"
          data-bs-toggle="modal"
          data-bs-target="#add_category_modal"
        >
          <p className="m-0">Add</p>
          <img src={ADD} className="add-icon" alt="" />
        </div>
      </div>

      <div className="row category-row">
        {Categories.map((category) => {
          return (
            <div className="col-3 category-card d-flex">
              <h4 className="m-0">{category.name}</h4>
            </div>
          );
        })}
      </div>

      {/* add category modal */}

      <div
        className="modal fade"
        id="add_category_modal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add category
              </h5>
              <button
                type="button"
                ref={CategorymodalCloser}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5>Enter category name</h5>
              <input
                type="text"
                onChange={e=>SetAddCategory(e.target.value)}
                className="category-inp"
                placeholder="Ex : Shirt"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-app-secondary text-white"
                onClick={add_category}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
