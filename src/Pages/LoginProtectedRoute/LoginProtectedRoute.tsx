import React , {useContext} from 'react'
import {Navigate} from "react-router-dom";
import { UserContext } from '../../App/App';
import { user } from '../../Types/Types';



function LoginProtectedRoute({children} : { children : React.ReactNode}) {
    const { setUserData } = useContext(UserContext)
    let user : user | null = null;
    const user_data = localStorage.getItem("logged_user")
    if (user_data) user = JSON.parse(user_data)
    
    
    
    if (localStorage.getItem("logged_user")  && user ) return children
    else {
        localStorage.clear()
        setUserData && setUserData(null)
        return <Navigate to={"/auth/login"} />
    }
}

export default LoginProtectedRoute