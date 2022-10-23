import {
    Device
} from './../models/ApiModel.js'
import { URL, parse } from 'url';
import request from 'request';
import date from 'date-and-time';
import AuthClass from './../class/AuthClass.js'
import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'

const device_class = class DeviceClass {
    constructor() {
        this.token = null
        this.device_id = null
        this.name = null
        this.telp = null
        this.api_key = null
        this.webhook = null
        this.expired_at = null
        this.device_status = "PENDING"
    }

    setToken(token) {
        this.token = token
        return this
    }

    setDeviceId(device_id) {
        this.device_id = device_id
        return this
    }

    setName(name) {
        this.name = name
        return this
    }

    setTelp(telp) {
        this.telp = telp
        return this
    }

    setWebhook(webhook) {
        this.webhook = webhook
        return this
    }

    setApiKey(api_key) {
        this.api_key = api_key
        return this
    }

    async showDevice() {
        const verify_token = 
            await new AuthClass()
            .verifyToken(this.token)

        const device = await Device.findAll({
            where: {
                user_id: verify_token.id
            },
            attributes: ['device_id', 'name', 'telp', 'expired_at', 'device_status']
        })

        return device
    }

    async getDevice() {
        const device = await Device.findOne({
            where: {
                device_id: this.device_id
            },
            attributes: ['device_id', 'name', 'telp', 'api_key', 'webhook', 'webhook_group', 'expired_at', 'device_status']
        })

        return device
    }

    async getDeviceByKey() {
        const device = await Device.findOne({
            where: {
                api_key: this.api_key
            },
            attributes: ['device_id', 'name', 'telp', 'api_key', 'webhook', 'webhook_group', 'expired_at', 'device_status']
        })

        return device
    }

    async getDeviceByTelp() {
        const device = await Device.findOne({
            where: {
                telp: this.telp
            },
            attributes: ['device_id', 'name', 'telp', 'api_key', 'webhook', 'webhook_group', 'expired_at', 'device_status']
        })

        return device
    }

    async storeDevice() {
        const verify_token = 
            await new AuthClass()
            .verifyToken(this.token)
        
        await Device.create({
            device_id: "DEVICE"+Math.floor(Math.random() * 101)+100,
            name: this.name,
            telp: this.telp,
            user_id: verify_token.id,
            device_status: "NOT ACTIVE"
        })

        return true
    }

    async updateDevice(update) {
        await Device.update(update, {
            where: {
                device_id: this.device_id
            }
        });
    }
    
    async isExistDevice() {
        if (this.device_id) {
            var get_device = await this.getDevice()
        }else if(this.telp) {
            var get_device = await this.getDeviceByTelp()
        }else if(this.api_key) {
            var get_device = await this.getDeviceByKey()
        }
        
        if (!get_device) {
            return false
        }

        return true
    }

    async isActiveDevice() {
        if (this.device_id) {
            var get_device = await this.getDevice()
        }else if(this.telp) {
            var get_device = await this.getDeviceByTelp()
        }else if(this.api_key) {
            var get_device = await this.getDeviceByKey()
        }

        if (!get_device) {
            return false
        }

        if (get_device.device_status !== "ACTIVE") {
            return false
        }

        return true
    }

    async isValidWhatsappNumber() {
        const session = getSession(process.env.SESSION_ID)
        const receiver = formatPhone(this.telp)
        const exists = await isExists(session, receiver)

        return exists
    }
    
    isValidUrl() {
        try {
            new URL(s);
            const parsed = parse(s);
            return protocols
                ? parsed.protocol
                    ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
                    : false
                : true;
        } catch (err) {
            return false;
        }
    }

    responseWebhook() {
        var response = {
            key: {
              id: Math.floor(Math.random() * 10001)+10000,
              sessionId: "6281248891487",
              telp: process.env.SESSION_ID+"@s.whatsapp.net",
              name: "Angel Ping Bot",
              message: "This is example message"
            }
        }

        return response
    }

    setExpiredAt() {
        const expired_at = date.addDays(new Date(), 30);
        this.expired_at = date.format(expired_at, 'YYYY-MM-DD HH:mm:ss');
    }

    async setBeforeExpiredAt() {
        const get_device = await this.getDevice()
        const expired_at = date.addDays(get_device.expired_at, -30);
        this.expired_at = date.format(expired_at, 'YYYY-MM-DD HH:mm:ss');
    }

    async callWebhook() {
        const response = this.responseWebhook()
        // const is_valid_url = this.isValidUrl(this.webhook)
        // if (!is_valid_url) {
        //     return false
        // }

        var options = {
            'method': 'POST',
            'url': this.webhook,
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
        };
        
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });

        return response
    }

    async activateDevice() {
        this.setExpiredAt()

        var update = {
            expired_at: this.expired_at,
            device_status: "ACTIVE"
        }
        
        await Device.update(update, {
            where: {
                device_id: this.device_id
            }
        });

        return 1
    }

    async nonActivateDevice() {
        await this.setBeforeExpiredAt()
        console.log(this.expired_at)
        var update = {
            expired_at: this.expired_at,
            device_status: "NOT ACTIVE"
        }
        
        await Device.update(update, {
            where: {
                device_id: this.device_id
            }
        });

        return 1
    }
}

export default device_class