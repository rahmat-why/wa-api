import {
    Config
} from './../models/ApiModel.js'

const config_class = class ConfigClass {
    async getBankAccount() {
        const bank_account = {
            name:"Rahmat Wahyu", 
            number: "081248891487",
            bank_name: "DANA"
        }

        return bank_account
    }
}

export default config_class