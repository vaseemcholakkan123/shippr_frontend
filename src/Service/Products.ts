import ShipprAxios from "../App/Config/AxiosConfig/AxiosConfig";
import { BASE_IMAGE_URL } from "../App/Config/Constants";
import { productform } from "../Types/Types";




export function get_object_url(file : File | string): string {
    if(typeof file === 'string'){
        if(file.startsWith('/media')) return BASE_IMAGE_URL + file
        return file
    }
    else return URL.createObjectURL(file!)
}



export async function vendor_add_product(data : ( productform & { images: File[] } ) ) {

    try {
        console.log(data);
        
        const response = await ShipprAxios.post('products/action/' , data , {headers : {"Content-Type" : "multipart/form-data"}});
        return Promise.resolve(response)

    } catch (error) {
        return Promise.reject(error)
    }

}

export async function vendor_update_product( prod_id : number, data : ( productform & { images: File[] } ) ) {

    try {
        const response = await ShipprAxios.patch(`products/action/${prod_id}` , data , {headers : {"Content-Type" : "multipart/form-data"}});
        return Promise.resolve(response)

    } catch (error) {
        return Promise.reject(error)
    }

}

export async function get_vendor_products(nexturl: string) {
    try {
        const response = await ShipprAxios.get(`products/get-vendor-products/?${nexturl}`)
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
}



export function updateTimeSince(timeString : string) {
    let time;
    const then = new Date(timeString);
    const now = new Date();
    const secondsPast = (now.getTime() - then.getTime()) / 1000;
    const minutesPast = Math.floor(secondsPast / 60);
    const hoursPast = Math.floor(minutesPast / 60);
    const daysPast = Math.floor(hoursPast / 24);
    

    if (daysPast > 6) {
        const year = then.getFullYear() === now.getFullYear() ? '' : ' ' + then.getFullYear();
        const month = then.toLocaleString('default', {month: 'short'});
        const day = then.getDate();
        time = then.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
        return month + ' ' + day + year + ', ' + time;
    } else if (daysPast > 0) {
        const days = daysPast === 1 ? "1 day" : daysPast + " days";
        time = then.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
        return days + " ago, " + time;
    } else if (hoursPast > 0) {
        return hoursPast + " hour ago";
    } else if (minutesPast > 0) {
        return minutesPast + " minutes ago";
    } else {
        return "just now";
    }
}


export async function delete_product(prod_id:number) {

    try {
        await ShipprAxios.delete(`products/action/${prod_id}`)
        return Promise.resolve()
    } catch (error) {
        return Promise.reject(error)
    }
    
}


export async function get_categories() {
    try {
        const response = await ShipprAxios.get('products/get-categories/')
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject()
    }
}



export async function add_or_remove_from_cart(prod_id:number) {
    try {
        await ShipprAxios.post(`products/add-remove-cart/${prod_id}/`)
        return Promise.resolve()
    } catch (error) {
        return Promise.reject()
    }
}

export async function get_user_products(nexturl : string) {
    try {
        const response = await ShipprAxios.get(`products/get-user-products/?${nexturl}`)
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject()
    }
}

export async function get_user_cart_items(nexturl : string) {
    try {
        const response = await ShipprAxios.get(`products/get-user-cart/?${nexturl}`)
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject()
    }
}

export async function get_product_by_id(prod_id : string) {
    try {
        const response = await ShipprAxios.get(`products/get-product/${prod_id}`)
        return Promise.resolve(response)
    } catch (error) {
        return Promise.reject()
    }
}