import {
    Device
} from './../models/ApiModel.js'
import { URL, parse } from 'url';
import request from 'request';

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

    async showDevice() {
        const device = await Device.findAll({
            where: {
                user_id: 0
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
            attributes: ['device_id', 'name', 'telp', 'api_key', 'webhook']
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
            user_id: 0,
            device_status: this.device_status
        })
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
}

export default device_class