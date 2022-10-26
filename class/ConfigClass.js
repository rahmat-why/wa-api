import {
    Config
} from './../models/ApiModel.js'

const config_class = class ConfigClass {
    async getBankAccount() {
        const bank_account = await Config.findOne({
            where: {
                key: "BANK ACCOUNT"
            }
        })

        return bank_account
    }
}

export default config_class