import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'
import response from './../response.js'
import ChatClass from './../class/ChatClass.js'

const getList = (req, res) => {
    return response(res, 200, true, '', getChatList(res.locals.sessionId))
}

const send = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const receiver = formatPhone(req.body.receiver)
    const { message } = req.body

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        await sendMessage(session, receiver, message, 0)

        response(res, 200, true, 'The message has been successfully sent.')
    } catch {
        response(res, 500, false, 'Failed to send the message.')
    }
}

const sendBulk = async (req, res) => {
    const session = getSession(res.locals.sessionId)
    const errors = []

    for (const [key, data] of req.body.entries()) {
        let { receiver, message, delay } = data

        if (!receiver || !message) {
            errors.push(key)

            continue
        }

        if (!delay || isNaN(delay)) {
            delay = 1000
        }

        receiver = formatPhone(receiver)

        try {
            const exists = await isExists(session, receiver)

            if (!exists) {
                errors.push(key)

                continue
            }

            await sendMessage(session, receiver, message, delay)
        } catch {
            errors.push(key)
        }
    }

    if (errors.length === 0) {
        return response(res, 200, true, 'All messages has been successfully sent.')
    }

    const isAllFailed = errors.length === req.body.length

    response(
        res,
        isAllFailed ? 500 : 200,
        !isAllFailed,
        isAllFailed ? 'Failed to send all messages.' : 'Some messages has been successfully sent.',
        { errors }
    )
}

const checkNumber = async (req, res) => {
    const session = getSession(process.env.SESSION_ID)
    const receiver = formatPhone(req.body.receiver)

    try {
        const exists = await isExists(session, receiver)

        if (!exists) {
            return response(res, 400, false, 'The receiver number is not exists.')
        }

        return response(res, 200, true, 'Success! receiver number is exists.')
    } catch {
        response(res, 500, false, 'Failed to check number')
    }

}

const formattedResponse = async (req, res) => {
    const body = req.body

    try {
        if(body.content.message) {
            if(body.content.message.key.sessionId) {
                var sessionId = body.content.message.key.sessionId.split("@")[0]
                var message = body.content.message
                var formatted_response = 
                    await new ChatClass()
                    .setSessionId(sessionId)
                    .setMessage(body.content.message)
                    .formatWebhookChat()

            }else if(body.content.message.key.remoteJid){
                var sessionId = body.content.message.key.remoteJid.split("@")[0]
                var message = body.content.message
                var formatted_response = 
                    await new ChatClass()
                    .setSessionId(sessionId)
                    .setMessage(body.content.message)
                    .formatWebhookChat()

            }

            formatted_response.key.timestamp = body.content.timestamp
        }

        return response(res, 200, true, 'success.', formatted_response)
    } catch (err) {
        return response(res, 500, false, err.message)
      }
}

export { getList, send, sendBulk, checkNumber, formattedResponse }
