import response from './../response.js'
import ConfigClass from './../class/ConfigClass.js'

export const getBankAccount = async(req, res) => {
    let get_bank_account = 
        await new ConfigClass()
        .getBankAccount()

    return response(res, 200, true, '', get_bank_account)
}