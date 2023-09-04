import ShipprAxios from "../App/Config/AxiosConfig/AxiosConfig";
import { purchaseForm } from "../Types/Types";



export async function purchase_products(data:purchaseForm[]) {
    try {
        await ShipprAxios.post('services/purchase/',data)
        return Promise.resolve()
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function get_user_orders(nexturl : string) {
    try {
        const response = await ShipprAxios.get(`services/get-user-orders/${nexturl}`)
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function get_vendor_orders(nexturl : string) {
    try {
        const response = await ShipprAxios.get(`services/get-vendor-orders/${nexturl}`)
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
}

export async function update_order_status(order_id:number , new_status:string) {
    try {
        console.log(new_status);
        
        const response = await ShipprAxios.patch(`services/update-order-status/${order_id}`,{status : new_status})
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
    
}