/**
 * Create By Zahwa Zein.
 * Contact Me on t.me/zhwzein
 * Follow https://github.com/zhwzein
**/

const { 
    downloadContentFromMessage, 
    generateWAMessageFromContent,
    proto,
} = require("@adiwajshing/baileys-md");

const fs = require('fs')
const { spawn, exec } = require("child_process")
const axios = require("axios")
const chalk = require('chalk')
const ffmpeg = require('fluent-ffmpeg')
const moment = require("moment-timezone");
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('DD/MM/YY HH:mm:ss z')

const { color } = require('./lib/color')
const { fetchJson, getBase64, kyun, createExif } = require('./lib/fetcher')
const { sleep, uploadImages, getBuffer, getGroupAdmins, getRandom } = require('./lib/functions')
const Exif = require('./lib/exif');
const exif = new Exif();

// CONFIG
publik = false
multi = true
nopref = false
apikey = "YOURAPIKEY"

module.exports = async(client, mek) => {
    try {
        const fromMe = mek.key.fromMe
        const content = JSON.stringify(mek.message)
        const from = mek.key.remoteJid
        const type = Object.keys(mek.message)[0]
        const cmd = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'documentMessage') && mek.message.documentMessage.caption ? mek.message.documentMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && mek.message.buttonsResponseMessage.selectedButtonId) ? mek.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && mek.message.templateButtonReplyMessage.selectedId ? mek.message.templateButtonReplyMessage.selectedId : (type === 'listResponseMessage' && mek.message.listResponseMessage.title) ? mek.message.listResponseMessage.title : ""
		
        if (multi) {
            var prefix = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα¦|/\\©^]/.test(cmd) ? cmd.match(/^[°zZ#$@*+,.?=''():√%¢£¥€π¤ΠΦ_&><!`™©®Δ^βα¦|/\\©^]/gi) : '.'
        } else {
            if (nopref) {
                prefix = ''
            } else {
                prefix = prefa
            }
        }

        const body = (type === 'listResponseMessage' && mek.message.listResponseMessage.title) ? mek.message.listResponseMessage.title : (type === 'buttonsResponseMessage' && mek.message.buttonsResponseMessage.selectedButtonId) ? mek.message.buttonsResponseMessage.selectedButtonId : (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ""
		const budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''

        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const isCmd = body.startsWith(prefix)
        const args = body.trim().split(/ +/).slice(1)
		const arg = budy.slice(command.length + 2, budy.length)
        const ar = args.map((v) => v.toLowerCase())
		const q = args.join(' ')

        const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net'
        const ownerNumber = ["62812XXXX@s.whatsapp.net"]
        const isGroup = from.endsWith('@g.us')
        const sender = isGroup ? (mek.key.participant ? mek.key.participant : mek.participant) : mek.key.remoteJid
        
        const fullname =  mek.pushName || "NESYA"
        const pushname = fullname.replace(/ .*/,'');

        const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const groupOwner = isGroup ? groupMetadata.owner : ''
        const groupDesc = isGroup ? groupMetadata.desc : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''

        const isOwner = ownerNumber.includes(sender)
        const isGroupAdmins = groupAdmins.includes(sender) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        
        const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'stickerMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
        const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

        // FUNCTION
        const reply = (string) => {
            client.sendMessage(from, { text: string }, { quoted: mek })
        }

        if (!publik) {
			if (!isOwner && !mek.key.fromMe) return
		}

		if (isCmd && !isGroup) {
			console.log(color('[CMD]', 'cyan'), color(moment(mek.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'orange'), color(prefix + command, 'cyan'), color(pushname, 'orange'), color(sender, 'deeppink'))
		}

		if (!command) {
			console.log(color('[MSG]', 'cyan'), color(moment(mek.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'orange'), color(cmd, 'cyan'), color(pushname, 'orange'), color(sender, 'deeppink'))
		}

        switch (command) {

            case 'motivasi': case 'dilanquote': case 'bucinquote': case 'katasenja': case 'puisi': {
                let anu = await fetchJson(`https://zenzapi.xyz/api/${command}?apikey=${apikey}`)
                let buttons = [
                    { buttonId: prefix + command, buttonText: {displayText: 'Next'}, type: 1 }
                ]
                let buttonMessage = {
                    text: anu.result.message,
                    footer: 'Random ' + command,
                    buttons: buttons,
                    headerType: 2
                }
                client.sendMessage(from, buttonMessage, { quoted: mek })
            }
            break

            case 'anime': case 'waifu': case 'husbu': case 'neko': case 'shinobu': case 'megumin':
                reply(msg.wait())
                buffer = await getBuffer(`https://zenzapi.xyz/api/random/${command}?apikey=${apikey}`) 
                client.sendMessage(from, { image: buffer, caption: 'Generate Random ' + command }, { quoted: mek })
            break
        }

    } catch (e) {
		e = String(e)
        console.log(color('[ERR]', 'red'), color(e, 'cyan'))
	}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.cyan(`UPDATE ${__filename}`))
	delete require.cache[file]
	require(file)
})
