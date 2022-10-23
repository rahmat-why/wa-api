import response from './../response.js'
import AuthClass from './../class/AuthClass.js'

const validate = async(req, res, next) => {
    const { telp } = req.body

    try {
        let is_exist_user = 
            await new AuthClass()
            .setTelp(telp)
            .isExistUser()

        if (!is_exist_user) {
            return response(res, 422, false, 'Account not registered!')
        }

        next()

    } catch (err) {
        return response(res, 401, true, err.message, {})
    }
}

export default validate
