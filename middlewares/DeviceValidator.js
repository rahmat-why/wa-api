import response from './../response.js'
import DeviceClass from './../class/DeviceClass.js'

const validate = async(req, res, next) => {
    var api_key = req.headers["angel-key"]
    if (!api_key) {
        return response(res, 401, false, 'Angel key invalid')
    }

    let is_active_device = 
        await new DeviceClass()
        .setApiKey(api_key)
        .isActiveDevice()

    if (!is_active_device) {
        return response(res, 401, false, 'Angel key invalid')
    }

    res.locals.sessionId = is_active_device.device_id

    next()
}

export default validate
