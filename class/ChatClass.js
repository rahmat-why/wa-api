import { URL, parse } from 'url';
import request from 'request';
import { Schedule, ScheduleReceiver } from '../models/ApiModel';

const chat_class = class ChatClass {
    constructor() {
        this.webhook = null,
        this.sessionId = null,
        this.message = null
    }

    setWebhook(webhook) {
        this.webhook = webhook
        return this
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId
        return this
    }

    setMessage(message) {
        this.message = message
        return this
    }

    setResponse(response) {
        this.response = response
        return this
    }

    async formatWebhookChat() {
        var message = this.message

        if (message.message.extendedTextMessage !== null && message.message.extendedTextMessage !== "") {
            var response = {
                key:{
                    id: message.key.id,
                    sessionId: this.sessionId,
                    telp: message.key.remoteJid,
                    name: message.pushName,
                    message: message.message.extendedTextMessage.text
                }
            }
        }else if(message.message.conversation !== null && message.message.conversation !== ""){
            var response = {
                key:{
                    id: message.key.id,
                    sessionId: this.sessionId,
                    telp: message.key.remoteJid,
                    name: message.pushName,
                    message: message.message.conversation
                }
            }
        }
    
        return response
    }

    async formatWebhookGroup() {
        var message = this.message
        
        if (message.message.extendedTextMessage !== null && message.message.extendedTextMessage !== "") {
            var response = {
                key:{
                    id: message.key.id,
                    groupId: message.key.remoteJid,
                    sessionId: this.sessionId,
                    telp: message.key.participant,
                    name: message.pushName,
                    message: message.message.extendedTextMessage.text
                }
            }
        }else if(message.message.conversation !== null && message.message.conversation !== ""){
            var response = {
                key:{
                    id: message.key.id,
                    groupId: message.key.remoteJid,
                    sessionId: this.sessionId,
                    telp: message.key.participant,
                    name: message.pushName,
                    message: message.message.conversation
                }
            }
        }
    
        return response
    }

    async callWebhook() {
        try {
            var options = {
                'method': 'POST',
                'url': this.webhook,
                'headers': {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.response)
            
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });
        } catch (err) {
            return err.message
        }

        return true
    }

    async showSchedule() {
        try {
            const schedules = await Schedule.findAll()

            return schedules
        } catch(err) {
            return err.message
        }
    }

    async showDetailSchedule(schedule_id) {
        try {
            const detailSchedule = await ScheduleReceiver.findAll({ where: { schedule_id } }) 
            
            return detailSchedule
        } catch(err) {
            return err.message
        }
    }

    async storeScheduleReceiver(results) {
        const scheduleReceivers = []

        results.forEach(async (result) => {
            const message = { receiver: result.telp }

            if (result.type === "text") {
                message.message = {
                    text: result.text
                }
            } else if (result.type === "image") {
                message.message = {
                    image: {
                        url: result.url
                    },
                    caption: result.text
                }
            } else if (result.type === "document") {
                message.message = {
                    document: {
                        url: result.url
                    },
                    mimetype: 'application/pdf',
                    fileName: result.text
                }
            } else {
                return console.error('Unknown Type:', result.type)
            }
            try {
                const scheduleReceiver = await ScheduleReceiver.create({
                    category: result.type,
                    device_id: result.device_id,
                    telp: result.telp,
                    schedule_at: result.schedule_time,
                    message, 
                })
                scheduleReceivers.push(scheduleReceiver)
            } catch(err) {
                console.log(err)
                scheduleReceivers.push(err.message) // send error into the response
            }
        })

        return scheduleReceivers
    }

    async storeSchedule({ title, create_form, folder_id, total_receiver }) {
        const schedule = await Schedule.create({
            title, create_form, folder_id, total_receiver
        })

        return schedule
    }
}

export default chat_class
