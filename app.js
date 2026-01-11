'use strict'

import {getPeers} from "./tracker.js";
import { openTorrent } from "./torrent-parser.js";

const torrent = openTorrent("[CuaP] One Piece - 0001-0050 [1080p][HEVC 10bits].torrent");

getPeers(torrent, peers => {
    console.log(`List of Peers ${peers}`)
})