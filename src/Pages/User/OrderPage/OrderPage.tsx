import React, { useEffect, useState } from 'react'
import './../../pages.css'
import { order } from '../../../Types/Types'
import { get_user_orders } from '../../../Service/Orders';
import toast from 'react-hot-toast';
import OrderCard from '../../../App/Components/OrderCard/OrderCard';


function OrderPage() {

  const [Orders , SetOrders] = useState<order[]>([])
  const [NextUrl, setNextUrl] = useState("");


  useEffect(() => {
    get_user_orders(NextUrl)
      .then((res) => {
        SetOrders(res.data.results);
        console.log(res);

        if (res.data.next) setNextUrl(res.data.next.split("?")[1]);
        else setNextUrl("");
      })
      .catch(() => {
        toast.error("internal error");
      });
  }, [NextUrl]);

  return (
    <div className='order-main'>
        <h3>Your Orders</h3>

      <div className="row mt-2 justify-space-between">
        {Orders.map(order=>{
          return(
            <OrderCard order={order} key={order.id} />
          )
        })

        }
        {
          !Orders[0] ?
            <h6 className='m-2'>You've not placed any orders</h6>
          :
          null
        }
      </div>

    </div>
  )
}

export default OrderPage