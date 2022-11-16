import { URL, parse } from 'url';
import mongoose from 'mongoose'
import request from 'request';
import { Schedule, ScheduleReceiver } from '../models/ScheduleModel.js';

const ChatClass = class ChatClass {
    constructor() {
        this.webhook = null,
        this.sessionId = null,
        this.category = null,
        this.schedule_id = null,
        this.device_id = null,
        this.telp = null,
        this.schedule_at = null,
        this.message = null,
        this.title = null,
        this.create_form = null,
        this.folder_id = null,
        this.total_receiver = null
    }

    setWebhook(webhook) {
        this.webhook = webhook
        return this
    }

    setSessionId(sessionId) {
        this.sessionId = sessionId
        return this
    }

    setCategory(category) {
        this.category = category
        return this
    }

    setScheduleId(schedule_id) {
        this.schedule_id = schedule_id
        return this
    }

    setDeviceId(device_id) {
        this.device_id = device_id
        return this
    }

    setTelp(telp) {
        this.telp = telp
        return this
    }

    setScheduleAt(schedule_at) {
        this.schedule_at = schedule_at
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

    setTitle(title) {
        this.title = title
        return this
    }

    setCreateForm(create_form) {
        this.create_form = create_form
        return this
    }

    setFolderId(folder_id) {
        this.folder_id = folder_id
        return this
    }

    setTotalReceiver(total_receiver) {
        this.total_receiver = total_receiver
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
        const schedules = await Schedule.find()
        return schedules
    }

    async showDetailSchedule(schedule_id) {
        try {
            const detailSchedule = await ScheduleReceiver.find({ 
              scheduleId: mongoose.Types.ObjectId(schedule_id) 
            }) 
            
            return detailSchedule
        } catch(err) {
            return err.message
        }
    }

    async storeScheduleReceiver() {
        const { schedule_id, category, device_id, telp, schedule_at, message } = this

        const scheduleReceiver = await new ScheduleReceiver({
          scheduleId: schedule_id,
          category,
          deviceId: device_id,
          telp,
          scheduleTime: schedule_at,
          message
        })
        .save()

        return scheduleReceiver
    }

    async storeSchedule() {
        const { title, create_form, folder_id, total_receiver } = this
        
        const schedule = await new Schedule({
          title,
          createFrom: create_form,
          folderId: folder_id,
          totalReceiver: total_receiver
        })
        .save()

        return schedule
    }

    async updateSchedule(fields /* object */) {
        const schedule = await Schedule.findOneAndUpdate(
          { _id: this.schedule_id }, { $set: fields }, { new: true }
        )

        return schedule
    }
}

export default ChatClass
