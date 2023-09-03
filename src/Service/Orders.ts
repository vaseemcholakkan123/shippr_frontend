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