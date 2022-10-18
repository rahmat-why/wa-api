import response from './../response.js'
import OrderClass from './../class/OrderClass.js'
import DeviceClass from './../class/DeviceClass.js'

export const showProduct = async(req, res) => {

    try {
        let show_product = 
            await new OrderClass()
            .showProduct()

        return response(res, 200, true, 'List product found!', show_product)
    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}

export const getProduct = async(req, res) => {
    const { product_id } = req.params

    try {
        let get_product = 
            await new OrderClass()
            .setProductId(product_id)
            .getProduct()

        if (get_product === null) {
            return response(res, 404, true, 'Product not found!', {})
        }

        return response(res, 200, true, 'Product found!', get_product)
    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}

export const getOrder = async(req, res) => {
    const { order_id } = req.params

    try {
        let get_order = 
            await new OrderClass()
            .setOrderId(order_id)
            .getOrder()

        return response(res, 200, true, 'Order found!', get_order)
    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}

export const storeOrder = async(req, res) => {
    const { device_id, product_id } = req.body

    try {
        let is_running_order = 
            await new OrderClass()
            .setDeviceId(device_id)
            .isRunningOrder()

        if (is_running_order) {
            return response(res, 422, false, 'Current order with this Device is running!')
        }

        const get_device = 
            await new DeviceClass()
            .setDeviceId(device_id)
            .getDevice()

        let is_active_device = 
            await new DeviceClass()
            .setApiKey(get_device.api_key)
            .isActiveDevice()

        if (is_active_device) {
            return response(res, 422, false, 'Cannot order! Device already active!')
        }

        let store_order = 
            await new OrderClass()
            .setDeviceId(device_id)
            .setProductId(product_id)
            .storeOrder()

        return response(res, 200, true, 'Order success!', {})
    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}

export const acceptOrder = async(req, res) => {
    const { order_id } = req.body

    try {
        let is_paid_order = 
            await new OrderClass()
            .setOrderId(order_id)
            .isPaidOrder()

        if (is_paid_order) {
            return response(res, 400, true, 'Order already paid!', {})
        }

        let accept_order = 
            await new OrderClass()
            .setOrderId(order_id)
            .acceptOrder()

        return response(res, 200, true, 'Order accepted!', {})
    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}

export const rollbackAcceptOrder = async(req, res) => {
    const { order_id } = req.body

    try {
        let get_order = 
            await new OrderClass()
            .setOrderId(order_id)
            .getOrder()
            
        if (get_order.payment_status != "PAID") {
            return response(res, 400, true, 'Order have not paid!', {})
        }

        let cancel_order = 
            await new OrderClass()
            .setOrderId(order_id)
            .rollbackAcceptOrder()

        return response(res, 200, true, 'Rollback order successfully!', {})
    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}