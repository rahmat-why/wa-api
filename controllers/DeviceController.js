import response from './../response.js'
import DeviceClass from './../class/DeviceClass.js'

export const showDevice = async(req, res) => {
    let show_device = 
        await new DeviceClass()
        .showDevice()

    return response(res, 200, true, '', show_device)
}

export const getDevice = async(req, res) => {
    const { device_id } = req.params
    
    let get_device = 
        await new DeviceClass()
        .setDeviceId(device_id)
        .getDevice()

    return response(res, 200, true, '', get_device)
}

export const storeDevice = async(req, res) => {
    const { name, telp } = req.body
    
    let get_device = 
        await new DeviceClass()
        .setName(name)
        .setTelp(telp)
        .storeDevice()

    return response(res, 200, true, '', get_device)
}

export const updateDevice = async(req, res) => {
    const { api_key, webhook } = req.body
    const { device_id } = req.params
    
    var update = {
        api_key: api_key,
        webhook: webhook
    }
    
    let update_device = 
        await new DeviceClass()
        .setDeviceId(device_id)
        .updateDevice(update)

    return response(res, 200, true, '', update_device)
}

export const callWebhook = async(req, res) => {
    const { webhook } = req.body
    
    let call_webhook = 
        await new DeviceClass()
        .setWebhook(webhook)
        .callWebhook()

    return response(res, 200, true, 'success', call_webhook)
}