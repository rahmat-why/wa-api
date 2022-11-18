import { join } from 'node:path'
import { createReadStream } from 'node:fs'
import csv from 'csv-parser'
import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'
import response from './../response.js'
import ChatClass from '../class/ChatClass.js'
import DeviceClass from '../class/DeviceClass.js'

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
    const schedules = await new ChatClass().showSchedule()

    return response(res, 200, true, 'Schedule found!.', schedules)
}

const showDetailSchedule = async (req, res) => {
    const { schedule_id } = req.params
    const detailSchedule = await new ChatClass().showDetailSchedule(schedule_id)

    return response(res, 200, true, 'Detail schedule found!.', detailSchedule)
}

const storeSchedule = async (req, res) => {
    const schedule = await new ChatClass()
        .setTitle(req.body.title)
        .setCreateForm(req.body.create_form)
        .setFolderId(req.body.folder_id)
        .storeSchedule()

    const csvFilePath = join(process.cwd(), req.file.path)
    const results = []
    const receiverIds = []

    createReadStream(csvFilePath).pipe(csv())
      .on('data', (data) => {
        results.push(data)
      })
      .on('end', async () => {
        for (const result of results) {
            const validWhatsappNumber = await new DeviceClass()
                .setTelp(result.telp)
                .isValidWhatsappNumber()

            if (!validWhatsappNumber) {
                continue
            } 
            try {
                const newReceiver = await new ChatClass()
                  .setScheduleId(schedule._id)
                  .setCategory(result.type)
                  .setDeviceId(result.device_id)
                  .setTelp(result.telp)
                  .setScheduleAt(result.schedule_time)
                  .setMessage(result)
                  .storeScheduleReceiver()

                receiverIds.push(newReceiver._id)
              
            } catch (err) {
                await new ChatClass().clearInsertedDocs(schedule._id, receiverIds)
                return res.status(403).send({ message: err.message })
            }
        }
        const updatedSchedule = await new ChatClass()
            .setScheduleId(schedule._id)
            .updateSchedule({ totalReceiver: receiverIds.length })
     
        return response(res, 200, true, 'Schedule created successfully!.', updatedSchedule)
    })
}

export { getList, send, sendBulk, showSchedule, showDetailSchedule, storeSchedule }
