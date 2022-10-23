import {
    Config
} from './../models/ApiModel.js'

const config_class = class ConfigClass {
    async getConfig(key) {
        const show_config = await Config.findOne({
            where: {
                key: key
            }
        })

        return show_config
    }

    async getBankAccount(key) {
        const get_bank_account = this.getConfig("REKENING")

        return get_bank_account
    }
}

export default config_class