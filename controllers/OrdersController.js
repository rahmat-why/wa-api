import response from './../response.js'
import OrderClass from './../class/OrderClass.js'

export const showProduct = async(req, res) => {
    let show_product = 
        await new OrderClass()
        .showProduct()

    return response(res, 200, true, '', show_product)
}

export const getProduct = async(req, res) => {
    const { product_id } = req.params

    let get_product = 
        await new OrderClass()
        .setProductId(product_id)
        .getProduct()

    return response(res, 200, true, '', get_product)
}

export const getOrder = async(req, res) => {
    const { order_id } = req.params

    let get_order = 
        await new OrderClass()
        .setOrderId(order_id)
        .getOrder()

    return response(res, 200, true, '', get_order)
}

export const storeOrder = async(req, res) => {
    const { device_id, product_id } = req.body

    let store_order = 
        await new OrderClass()
        .setDeviceId(device_id)
        .setProductId(product_id)
        .storeOrder()

    return response(res, 200, true, '', store_order)
}