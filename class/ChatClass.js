import { URL, parse } from 'url';
import request from 'request';
import ConfigClass from './../class/ConfigClass.js'

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
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFobWF0IiwicGFzc3dvcmQiOiJSYWhtYXQiLCJpYXQiOjE2NzA4MDY5NTl9.7_mKvfdHWQCm5VwC5hEKMw7BHZU3GKsaCD6mXcmyv9s',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.response)
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }
}

export default chat_class