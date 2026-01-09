import dgram from 'dgram'
import {Buffer} from 'buffer'
import {URL} from 'node:url'

const Uint8ArrayDecoder = (content) => {
    const decoder = new TextDecoder('utf-8')
    return decoder.decode(content)
}



export const getPeers = (torrent, callback) => {
    const socket = dgram.createSocket('udp4')
    const rawURL = Uint8ArrayDecoder(torrent.announce)
    // console.log(rawURL)
    const announceUrl = new URL(rawURL)
    console.log(announceUrl)
    const message = Buffer.from('Hello', 'utf-8')

    sendUDP(socket, message, announceUrl, callback)

    socket.on('message', response => {})
}

const sendUDP = (socket, message, announceUrl, callback) => {
    socket.send(message, 0, message.length, announceUrl.port, announceUrl.hostname, callback)
}