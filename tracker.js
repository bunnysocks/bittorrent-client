import dgram from 'dgram'
import {Buffer} from 'buffer'
import {URL} from 'node:url'
import crypto from 'crypto'

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

    udpSend(socket, message, announceUrl, callback)

    socket.on('message', response => {
        if(respType(response) == 'connect') {
            const connResp = parseConnResp(response)
            const announceReq = buildAnnounceReq(connResp.connectionId)
            udpSend(socket, announceReq, announceUrl)
        } else if(respType(response) == 'announce') {
            const announceResp = parseAnnounceResp(response)
            callback(announceResp.peers)
        }
    })
}

const udpSend = (socket, message, announceUrl, callback) => {
    socket.send(message, 0, message.length, announceUrl.port, announceUrl.hostname, callback)
}

const buildconnectionReq = () => {
    const buffer = Buffer.alloc(16)

    //connection Id
    buffer.writeUInt32BE(0x417, 0)
    buffer.writeUint32BE(0x27101980, 4)
    //action
    buffer.writeUint32BE(0, 8)
    //transaction id
    crypto.randomBytes(4).copy(buffer, 12)

    return buffer
}

const parseConnResp = (resp) => {
    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        connectionId: resp.slice(8)
    }
}

const buildAnnounceReq = () => {

}

const parseAnnounceResp = () => {

}