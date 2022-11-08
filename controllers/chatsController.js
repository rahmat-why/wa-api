import { join } from 'node:path'
import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import csv from 'csv-parser'
import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'
import response from './../response.js'
import { Schedule, ScheduleReceiver } from '../models/ApiModel.js'
import chat_class from '../class/ChatClass.js'

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

const showSchedule = async (req, res) => {
    const ChatClass = new chat_class()
    const schedules = await ChatClass.showSchedule()

    return res.send(schedules)
}

const showDetailSchedule = async (req, res) => {
    const { schedule_id } = req.params
    const ChatClass = new chat_class()
    const detailSchedule = await ChatClass.showDetailSchedule(schedule_id)

    return res.send(detailSchedule)
}

const storeSchedule = async (req, res) => {
    const csvFilePath = join(process.cwd(), req.file.path)
    const results = []
    createReadStream(csvFilePath).pipe(csv())
      .on('data', (data) => {
        results.push(data)
    }).on('end', async () => {
        const ChatClass = new chat_class()
        const scheduleReceivers = await ChatClass.storeScheduleReceiver(results)
        const schedule = await ChatClass.storeSchedule({
            title: req.body.title,
            create_form: req.body.create_form,
            folder_id: req.body.folder_id,
            total_receiver: scheduleReceivers.length,
        })
          
        return res.send(schedules)
    })
}

export { getList, send, sendBulk, showSchedule, showDetailSchedule, storeSchedule }
