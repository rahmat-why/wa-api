import { join } from 'node:path'
import { createReadStream } from 'node:fs'
import csv from 'csv-parser'
import { getSession, getChatList, isExists, sendMessage, formatPhone } from './../whatsapp.js'
import response from './../response.js'
import ChatClass from '../class/ChatClass.js'
import DeviceClass from '../class/DeviceClass.js'
import AuthClass from '../class/AuthClass.js'

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
    const {title, create_form, folder_id} = req.body
    if(!req.file) {
      return response(res, 422, false, "Template required!", {})
    }

    var authorization = req.headers["authorization"].split(" ")
    const token = authorization[1]
    
    // validate req body pada route
    // validate schedule time minimum 10 mnt from now
    // jika terdapat error, kirim response error beserta message & data yang penyebab nya

    var schedule_id = "SCH"+Math.floor(Math.random() * 1000)
    const schedule = await new ChatClass()
      .setToken(token)
      .setScheduleId(schedule_id)
      .setTitle(title)
      .setCreateForm(create_form)
      .setFolderId(folder_id)
      .setToken(token)
      .storeSchedule()

    const csvFilePath = join(process.cwd(), req.file.path)
    const results = []
    const receiverIds = []
    const errors = []

    createReadStream(csvFilePath).pipe(csv())
      .on('data', (data) => {
        var url_type = ["image", "document"]
        var text_type = ["text"]
        if(!data.type || !data.device_id || !data.telp || !data.schedule_at || data.type == "" || data.device_id == "" || data.telp == "" || data.schedule_at == ""){
          errors.push(data);
        }else if(url_type.includes(data.type) && data.url == ""){
          errors.push(data);
        }else if(text_type.includes(data.type) && data.text == ""){
          errors.push(data);
        }else{
          results.push(data)
        }
      })
      .on('end', async () => {
        if(errors.length > 0) {
          return response(res, 422, false, "File must same with template!", {})
        }

        for (const result of results) {
            const formatted_telp = new AuthClass()
              .normalizeTelp(result.telp)

            const validWhatsappNumber = await new DeviceClass()
              .setTelp(formatted_telp)
              .isValidWhatsappNumber()

            const isActiveDevice = await new DeviceClass()
              .setDeviceId(result.device_id)
              .isActiveDevice()

            // if (!validWhatsappNumber || !isActiveDevice) {
            //   continue
            // } 

            try {
              const newReceiver = await new ChatClass()
                .setScheduleId(schedule_id)
                .setCategory(result.type)
                .setDeviceId(result.device_id)
                .setTelp(formatted_telp)
                .setScheduleAt(result.schedule_time)
                .setMessage(result)
                .storeScheduleReceiver()

              receiverIds.push(newReceiver._id)
              
            } catch (err) {
              await new ChatClass().clearInsertedDocs(schedule._id, receiverIds)
              return response(res, 422, false, err.message, {})
            }
        }
        const updatedSchedule = await new ChatClass()
            .setScheduleId(schedule._id)
            .updateSchedule({ totalReceiver: receiverIds.length })
     
        return response(res, 200, true, 'Schedule created successfully!.', updatedSchedule)
    })
    .on('error', (err) => {
      return response(res, 422, false, err.message, {})
    })
}

const showContact = async (req, res) => {
    try {
      const contacts = await new ChatClass().setFolderId(req.params.folder_id).showContact()
      return res.send(contacts)
    } catch (err) {
      return res.status(403).send({ message: err.message })
    }
}

const storeContact = async (req, res) => {
  const {folder_id} = req.body
  if(!req.file) {
    return response(res, 422, false, "Template required!", {})
  }

  const csvFilePath = join(process.cwd(), req.file.path)
  const results = []
  const contacts = []
  const errors = [];

  createReadStream(csvFilePath).pipe(csv())
    .on('data', (data) => {
      if(!data.telp || !data.name || data.telp == null || data.name == null){
        errors.push(data);
      }else{
        results.push(data)
      }
    })
    .on('end', async () => {
      if(errors.length > 0) {
        return response(res, 422, false, "File must contain telp & name!", {})
      }

      try {
        for (const result of results) {
          const formatted_telp = new AuthClass()
            .normalizeTelp(result.telp)

          const validWhatsappNumber = await new DeviceClass()
            .setTelp(formatted_telp)
            .isValidWhatsappNumber()
          
          if (!validWhatsappNumber) {
            continue
          } 

          var contact = new ChatClass()
            .setTelp(formatted_telp)
            .setName(result.name)
            .setProfilePicture(result.profile_picture)
            .setFolderId(folder_id)
          
          const is_exist_contact = await contact.getContact()
          if (is_exist_contact) {
            if (!is_exist_contact.folder_ids.includes(contact.folder_id)) {
              var contact = await contact.addContactFolder()
            }else {
              var contact = is_exist_contact
            }
          }else{
            var contact = await contact.storeContact()
          }
          contacts.push(contact)
        }

        return response(res, 200, true, 'Contact imported successfully!', contacts)

      } catch (err) {
        return response(res, 422, false, err.message, {})
      }
    })
    .on('error', (err) => {
      return response(res, 422, false, err.message, {})
    })
}

export { getList, send, sendBulk, showSchedule, showDetailSchedule, storeSchedule, showContact, storeContact }
