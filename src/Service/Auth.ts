import ShipprAxios from "../App/Config/AxiosConfig/AxiosConfig";




export async function user_login(username:string , password:string) {

    try {

        const response = await ShipprAxios.post('auth/login/' , { username , password });
        return Promise.resolve(response)

    } catch (error) {
        return Promise.reject(error)
    }

}

export async function user_signup(username:string , password:string) {

    try {

        await ShipprAxios.post('auth/signup/' , { username , password });
        return Promise.resolve()

    } catch (error) {
        return Promise.reject(error)
    }

}

export async function vendor_login(username:string , password:string) {

    try {

        const response = await ShipprAxios.post('auth/vendor-login/' , { username , password });
        return Promise.resolve(response)
        
    } catch (error) {
        return Promise.reject(error)
    }

}

export async function vendor_register() {

    try {

        await ShipprAxios.post('auth/register-vendor/');
        return Promise.resolve()
        
    } catch (error) {
        return Promise.reject(error)
    }

}
