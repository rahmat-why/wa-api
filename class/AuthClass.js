import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    User,
    Config
} from './../models/ApiModel.js'

const auth_class = class AuthClass {
    constructor() {
        this.telp = null
        this.name = null
        this.password = null
        this.otp = null
    }

    setTelp(telp) {
        this.telp = telp
        return this
    }

    setName(name) {
        this.name = name
        return this
    }

    setPassword(otp) {
        const string_otp = otp.toString()
        this.otp = string_otp
        const saltRounds = 10;
        const hash = bcrypt.hashSync(string_otp, saltRounds);
        this.password = hash
        
        return this
    }

    async getConfig(key) {
        const config = await Config.findOne({
            where: {
                key: key
            }
        })

        return config
    }

    async storeUser() {
        await User.create({
            name: this.name,
            telp: this.telp,
            password: this.password
        })
    }

    async getUser() {
        const user = await User.findOne({
            where: {
                telp: this.telp
            }
        })

        return user
    }

    async updateUser(update) {
        const user = await User.update(update, {
            where: {
                telp: this.telp
            }
        })

        return user
    }

    async isExistUser() {
        const user = await this.getUser()
        if (user === null) {
            return false
        }

        return true
    }

    async generateToken() {
        const user = await this.getUser()
        var token = jsonwebtoken.sign(JSON.stringify(user), 'shhhhh');
        const update_user = await this.updateUser({token: token})
        var verify_token = this.verifyToken(token)
        verify_token.token = token
        
        return verify_token
    }

    async verifyToken(token) {
        const decoded = jsonwebtoken.verify(token, 'shhhhh', function(err, decoded) {
            return decoded
        });
        return decoded
    }

    async verifyPassword() {
        const user = await this.getUser()
        const is_valid = bcrypt.compareSync(this.otp, user.password);

        return is_valid
    }

    async login() {
        const user = await this.getUser()
        const is_valid = bcrypt.compareSync(this.otp, user.password);

        return is_valid
    }
}

export default auth_class