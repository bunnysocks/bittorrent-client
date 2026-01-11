'use strict'

import fs from "fs";
import bencode from "bencode";
import {getPeers} from "./tracker.js";

const data = fs.readFileSync("[CuaP] One Piece - 0001-0050 [1080p][HEVC 10bits].torrent");
const torrent = bencode.decode(data);

getPeers(torrent, peers => {
    console.log(`List of Peers ${peers}`)
})