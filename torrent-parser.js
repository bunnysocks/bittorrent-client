'use strict'
import fs from 'fs'
import bencode from 'bencode'

export const openTorrent = (filePath) => {
    return bencode.decode(fs.readFileSync(filePath))
}

export const infoHash = (torrent) => {
    console.log("infoHash")
}

export const size = (torrent) => {
    console.log("infoHash")
}