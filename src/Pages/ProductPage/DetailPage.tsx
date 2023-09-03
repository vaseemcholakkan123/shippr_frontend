import { useState, useContext, useCallback, useEffect } from "react"
import toast from "react-hot-toast"
import { UserContext } from "../../App/App"
import { product } from "../../Types/Types"
import { add_or_remove_from_cart, get_product_by_id } from "../../Service/Products"
import { useParams } from "react-router-dom"
import ProductDetail from "../../App/Components/ProductDetail/ProductDetail"



function DetailPage() {
  const [product , Setproduct] = useState<product | null>(null)
  const { user } = useContext(UserContext)
  const { prod_id } = useParams()

  const updateProduct = useCallback((prod_id:number)=>{
    if(!user) return toast.error("Please login")
    product && add_or_remove_from_cart(prod_id)
    .then(()=>{
      Setproduct({...product, is_in_cart : !product.is_in_cart})
    })
    .catch(()=>{
      toast.error("Internal error")
    })

  },[product])

  useEffect( ()=>{
    prod_id && get_product_by_id(prod_id)
    .then(res=>{
      console.log(res);
      
      Setproduct(res.data)
    })
    .catch(()=>{
      toast.error("internal error")
    })
  }, [])

  return (
    product && <ProductDetail product={product} UpdateInDetailPage={updateProduct} />
  )
}

export default DetailPage