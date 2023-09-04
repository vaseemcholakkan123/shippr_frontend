import { useEffect, useState } from 'react'
import './../../pages.css'
import { order } from '../../../Types/Types'
import { get_user_orders } from '../../../Service/Orders';
import toast from 'react-hot-toast';
import OrderCard from '../../../App/Components/OrderCard/OrderCard';
import { MORE_ICON } from '../../../App/Config/Constants';


function OrderPage() {

  const [Orders , SetOrders] = useState<order[]>([])
  const [NextUrl, setNextUrl] = useState("");
  const [loadNext, loader] = useState(false)


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
  }, [loadNext]);

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
        {NextUrl != "" ? (
            <div className="col-12 d-flex justify-content-center mt-2"  onClick={() => loader(!loadNext)}>
              <div className="app-btn1 d-flex p-2 br-7 align-items-center">
                <p className="m-0 me-2">Show more</p>

                <img src={MORE_ICON} width={18} height={18} alt="" />
              </div>
            </div>
          ) : null}

      </div>

    </div>
  )
}

export default OrderPage