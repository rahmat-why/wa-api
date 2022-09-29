import {
    Device
} from './../models/ApiModel.js'
import { URL, parse } from 'url';
import request from 'request';
import date from 'date-and-time';
import { LocalStorage } from "node-localstorage";
const localStorage = new LocalStorage('./scratch');
const user = localStorage.getItem("user")

const device_class = class DeviceClass {
    constructor() {
        this.device_id = null
        this.name = null
        this.telp = null
        this.api_key = null
        this.webhook = null
        this.expired_at = null
        this.device_status = "PENDING"
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
        const device = await Device.findAll({
            where: {
                user_id: user.id
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
            attributes: ['device_id', 'name', 'telp', 'api_key', 'webhook', 'expired_at']
        })

        return device
    }

    async storeDevice() {
        const is_exist_device = await this.isExistDevice()
        if (is_exist_device) {
            return false
        }
        
        await Device.create({
            device_id: "DEVICE"+Math.floor(Math.random() * 101)+100,
            name: this.name,
            telp: this.telp,
            user_id: user.id,
            device_status: this.device_status
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
        const device = await Device.findOne({
            where: {
                telp: this.telp
            }
        })

        if (device === null) {
            return false
        }

        return true
    }

    async isActiveDevice() {
        const device = await Device.findOne({
            where: {
                api_key: this.api_key
            }
        })

        if (!device) {
            return false
        }

        if (device.device_status !== "ACTIVE") {
            return false
        }

        return device
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
              telp: "6289636286462@s.whatsapp.net",
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

    setBeforeExpiredAt() {
        const expired_at = date.addDays(this.expired_at, -30);
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

        return true
    }

    async activateDevice() {this.setExpiredAt()

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
        const get_device = await this.getDevice()
        this.expired_at = get_device.expired_at
        
        this.setBeforeExpiredAt()

        var update = {
            expired_at: this.expired_at,
            device_status: "NON ACTIVE"
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