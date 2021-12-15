/**
 * Create By Zahwa Zein.
 * Contact Me on t.me/zhwzein
 * Follow https://github.com/zhwzein
**/

const {
	default: makeWASocket,
	DisconnectReason,
	useSingleFileAuthState
} = require('@adiwajshing/baileys-md');

const { state, saveState } = useSingleFileAuthState('./nesya.json');
const { color, mylogs } = require('./lib/color');
const pino = require('pino');
const fs = require('fs');
const chalk = require('chalk');

async function start() {
	const client = makeWASocket({
		printQRInTerminal: true,
		logger: pino({ level: 'silent' }),
		browser: ['NS Multi Device', 'Chrome', '3.0'],
		auth: state
	})
    console.log(color('Connected....'))
	client.ev.on('messages.upsert', async m => {
		if (!m.messages) return
        const mek = m.messages[0]
		require('./index')(client, mek)
	})

	client.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			console.log('Connection closed, Try to restart...')
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log(mylogs('connection logged out...'))
		}
	})

	client.ev.on('creds.update', () => saveState)
	//
	//
	return client
}

start()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.cyan(`UPDATE ${__filename}`))
	delete require.cache[file]
	require(file)
})
