'use strict'

import dgram from 'dgram'
import {Buffer} from 'buffer'
import {URL} from 'node:url'
import crypto from 'crypto'
import { infoHash, size } from './torrent-parser.js'
import { genId } from './util.js'

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

const buildAnnounceReq = (connId, torrent, port=6881) => {
    const buffer = Buffer.allocUnsafe(98)
    //connection id
    connId.copy(buffer, 0)
    //action (announce - 1)
    buffer.writeUint32BE(1, 8)
    //transaction id
    crypto.randomBytes(4).copy(buffer, 12)
    //info Hash
    infoHash(torrent).copy(buffer, 16)
    //peer Id
    genId().copy(buffer, 36)
    //downloaded
    Buffer.alloc(8).copy(buffer, 56)
    //left 
    size(torrent).copy(buffer, 64)
    //uploaded
    Buffer.alloc(8).copy(buffer, 72)
    //event
    buffer.writeUInt32BE(0, 80)
    //ip addr
    buffer.writeUInt32BE(0, 84)
    //key
    crypto.randomBytes(4).copy(buffer, 88)
    //num_want
    buffer.writeUInt32BE(-1, 92)
    //port
    buffer.writeUInt16BE(port, 96)
    
    return buffer
}

const parseAnnounceResp = (resp) => {
    const group = (iterable, size) => {
        let groups = []
        for(let i=0; i<iterable.length; i+=size) {
            groups.push(iterable.slice(i, i+size))
        }
        return groups
    }

    return {
        action: resp.readUInt32BE(0),
        transactionId: resp.readUInt32BE(4),
        leechers: resp.readUInt32BE(8),
        seeders: resp.readUInt32BE(12),
        peers: group(resp.slice(20), 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUInt16BE(4)
            }
        })
    }
}