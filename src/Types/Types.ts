

type user = {
    id : number,
    username: string,
    is_vendor: boolean,
}

type review = {
    id : number,
    review : string,
    rating : number,
}

type product = {
    id : number,
    vendor : user,
    name: string ,
    description: string,
    stock : number , 
    price: number ,
    posted_date : string,
    images : string[],
    reviews : review[], 
    is_in_cart : boolean,
    is_purchased : boolean,
    category : category
}

type cartitem = {
    id : number,
    product : product,
    quantity : number,
}

type order = {
    id : number,
    user : user,
    product : product,
    quantity : number,
    total_price : number,
    purchased_on : string,
}

import { Dispatch , SetStateAction } from "react"

type user_context_type = {
    user : user | null,
    setUserData : Dispatch<SetStateAction<user | null>> | null,
}


type productform = {
    name : string , description : string , price : number , category : number
}

type category = {
    name : string , id : number ,
}

type purchaseForm = {
    product : number,
    quantity : number,
}

export type { product , purchaseForm, cartitem , category , order , user , review ,user_context_type, productform }