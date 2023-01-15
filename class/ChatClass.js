import { URL, parse } from 'url';
import { randomBytes } from 'crypto'
import request from 'request';
import { Schedules, ScheduleReceivers, Contacts } from '../models/MongoDBModel.js';
import mime from 'mime-types'
import AuthClass from './AuthClass.js'
import ConfigClass from './../class/ConfigClass.js'

const chat_class = class ChatClass {
    constructor() {
        this.user_id = null,
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
        this.total_receiver = null,
        this.name = null,
        this.profile_picture = null,
        this.token = null
    }

    setUserId(user_id) { 
        this.user_id = user_id; 
        return this 
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

    setMessage(doc /* object */) {
        this.message = { receiver: doc.telp }

        if (doc.type === "text") {
          this.message.message = {
            text: doc.text
          }
        } else if (doc.type === "image") {
          this.message.message = {
            image: {
              url: doc.url
            },
            caption: doc.text
          }
        } else if (doc.type === "document") {
          const extension = this.getExtension(doc.url)

          this.message.message = {
            document: {
              url: doc.url
            },
            mimetype: mime.lookup(extension),
            fileName: doc.text
          }
        } else {
          throw new Error('Unknown Type: ' + doc.type)
        }
        this.message = JSON.stringify(this.message)

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

    setName(name) {
        this.name = name
        return this
    }

    setProfilePicture(profile_picture) {
        this.profile_picture = profile_picture
        return this
    }

    setToken(token) {
        this.token = token
        return this
    }

    async formatWebhookChat() {
        try {
            var message = this.message
            if("sessionId" in message.key) {
                var response = {
                    key:{
                        id: message.key.id,
                        sessionId: this.sessionId,
                        telp: message.key.telp,
                        name: message.key.name,
                        message: message.key.message,
                        fromMe: false
                    }
                }
            }else if (message.message.extendedTextMessage != null) {
                var response = {
                    key:{
                        id: message.key.id,
                        sessionId: this.sessionId,
                        telp: message.key.remoteJid,
                        name: message.pushName,
                        message: message.message.extendedTextMessage.text,
                        fromMe: message.key.fromMe
                    }
                }
            }else if("conversation" in message.message){
                var response = {
                    key:{
                        id: message.key.id,
                        sessionId: this.sessionId,
                        telp: message.key.remoteJid,
                        name: message.pushName,
                        message: message.message.conversation,
                        fromMe: message.key.fromMe
                    }
                }
            }else{
                var response = message;
            }
        
            return response
        } catch {
            console.log('0')
            return 0
        }
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
                    message: message.message.extendedTextMessage.text,
                    fromMe: message.key.fromMe
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
                    message: message.message.conversation,
                    fromMe: message.key.fromMe
                }
            }
        }else{
            var response = message;
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
            let notification_error = 
                await new ConfigClass()
                .setErrorMessage(err.message)
                .notificationError()
                
            return err.message
        }

        return true
    }

    async storeLog() {
        // var token_dev = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFobWF0IiwicGFzc3dvcmQiOiJSYWhtYXQiLCJpYXQiOjE2NzA4MDY5NTl9.7_mKvfdHWQCm5VwC5hEKMw7BHZU3GKsaCD6mXcmyv9s'
        // var token_prod = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzNCIsInBhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNjY4NTA2MDAzfQ.sFkDtqjJQP7cTJa0IJR66Nu0tCV4vIrru6Bqm6iCEH8'
        
        var options = {
            'method': 'POST',
            'url': 'https://newsweather.angel-ping.my.id/create',
            'headers': {
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzNCIsInBhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNjY4NTA2MDAzfQ.sFkDtqjJQP7cTJa0IJR66Nu0tCV4vIrru6Bqm6iCEH8',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.response)
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }

    async showSchedule() {
        const schedules = await Schedules.find()
        return schedules
    }

    async showDetailSchedule(schedule_id) {
        try {
            const detailSchedule = await ScheduleReceivers.find({ 
              scheduleId: mongoose.Types.ObjectId(schedule_id) 
            }) 
            
            return detailSchedule
        } catch(err) {
            return err.message
        }
    }

    async storeScheduleReceiver() {
        const { schedule_id, category, device_id, telp, schedule_at, message } = this

        const scheduleReceivers = await new ScheduleReceivers({
          scheduleId: schedule_id,
          category,
          deviceId: device_id,
          telp,
          scheduleTime: schedule_at,
          message
        })
        .save()

        return scheduleReceivers
    }

    async storeSchedule() {
        const verify_token = 
            await new AuthClass()
            .verifyToken(this.token)

        const schedule = await new Schedules({
          scheduleId: this.schedule_id,
          title: this.title,
          createFrom: this.create_form,
          folderId: this.folder_id,
          totalReceiver: this.total_receiver,
          userId: verify_token.id
        })
        .save()

        return schedule
    }

    async updateSchedule(fields /* object */) {
        const schedule = await Schedules.findOneAndUpdate(
          { _id: this.schedule_id }, { $set: fields }, { new: true }
        )

        return schedule
    }

    async clearInsertedDocs(scheduleId, receiverIds) {
        await Schedules.deleteOne({ _id: scheduleId })
        await ScheduleReceivers.deleteMany({ _id: { $in: receiverIds }})
    }

    getExtension(url) {
        return url.split(/[#?]/)[0].split('.').pop().trim()
    }

    async showContact() {
        const contacts = await Contacts.find({ folder_contact_id: { $in: this.folder_id }})
        return contacts
    }  

    async getContact() {
        const contact = await Contacts.findOne({ telp: this.telp })
        return contact
    }

    async storeContact() {
        const contact = await new Contacts({
            contact_id: `CNT${randomBytes(3).toString('hex')}`,
            user_id: this.user_id,
            telp: this.telp,
            name: this.name,
            profile_picture: this.profile_picture,
            folder_contact_id: [this.folder_id]
        })
        .save()

        return contact
    }

    async addContactFolder() {
        const contact = await Contacts.findOneAndUpdate(
          { telp: this.telp },
          { $push: { folder_contact_id: this.folder_id }},
          { new: true }
        )

        return contact
    }
}

export default chat_class