import response from './../response.js'
import AuthClass from './../class/AuthClass.js'
import { getSession, isExists, sendMessage, formatPhone } from './../whatsapp.js'

export const register = async(req, res) => {
    const otp = Math.floor(Math.random() * 1001)+1000;
    const { name, telp } = req.body

    let is_exist_user = 
        await new AuthClass()
        .setTelp(telp)
        .isExistUser()

    if (is_exist_user) {
        return response(res, 400, false, 'Account registered!')
    }

    const session = getSession(process.env.SESSION_ID)
    const receiver = formatPhone(telp)

    const exists = await isExists(session, receiver)
    if (!exists) {
        return response(res, 400, false, 'The receiver number is not exists.')
    }

    await sendMessage(session, receiver, {text: "OTP anda "+otp}, 0)

    let store_user = 
        await new AuthClass()
        .setPassword(otp)
        .setName(name)
        .setTelp(telp)
        .storeUser()

    return response(res, 200, true, '', exists)
}

export const login = async(req, res) => {
    const otp = Math.floor(Math.random() * 1001)+1000;
    const { telp } = req.body

    let is_exist_user = 
        await new AuthClass()
        .setTelp(telp)
        .isExistUser()

    if (!is_exist_user) {
        return response(res, 400, false, 'Account not registered!')
    }

    const session = getSession(process.env.SESSION_ID)
    const receiver = formatPhone(telp)

    const exists = await isExists(session, receiver)
    if (!exists) {
        return response(res, 400, false, 'The receiver number is not exists.')
    }

    await sendMessage(session, receiver, {text: "OTP anda "+otp}, 0)

    let password = new AuthClass().setPassword(otp).password
    let update_user = 
        await new AuthClass()
        .setTelp(telp)
        .updateUser({password: password})

    return response(res, 200, true, '', update_user)
}

export const verifyOtp = async(req, res) => {
    const { telp, otp } = req.body

    let verify_otp = 
        await new AuthClass()
        .setPassword(otp)
        .setTelp(telp)
        .verifyPassword()

    if (!verify_otp) {
        return response(res, 400, false, "OTP Invalid")
    }

    var generate_token = 
        await new AuthClass()
        .setTelp(telp)
        .generateToken()

    return response(res, 200, true, '', generate_token)
}