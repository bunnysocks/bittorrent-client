import fs from "fs";
import bencode from "bencode";

const data = fs.readFileSync("[CuaP] One Piece - 0001-0050 [1080p][HEVC 10bits].torrent");
const decoded = bencode.decode(data);

console.log(decoded);