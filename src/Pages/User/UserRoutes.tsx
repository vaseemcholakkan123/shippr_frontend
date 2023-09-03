

import { Route, Routes} from 'react-router-dom'
import UserHomePage from './HomePage/UserHomePage'
import OrderPage from './OrderPage/OrderPage'
import CartPage from './CartPage/CartPage'
import LoginProtectedRoute from '../LoginProtectedRoute/LoginProtectedRoute'
import { Navbar } from '../../App/Components'
import DetailPage from '../ProductPage/DetailPage'

function UserRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
          <Route path='/' element={<UserHomePage />} />
          <Route path='/my-orders' element={ <LoginProtectedRoute> <OrderPage /> </LoginProtectedRoute> } />
          <Route path='/my-cart' element={ <LoginProtectedRoute > <CartPage /> </LoginProtectedRoute> } />
          <Route path='/view-product/:prod_id' element={ <DetailPage /> } />
      </Routes>
    </>
    )
}

export default UserRoutes