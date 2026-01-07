import fs from 'fs'
import e from 'express'
const app = e()
const PORT = 3000

const readTorrent = async () => {
    try {
        return fs.readFileSync('puppy.torrent', 'utf8')
    } catch (err) {
        console.log(err)
    }
}

app.get("/", async (_,res) => {
    const data = await readTorrent()
    res.send(data)
})

app.listen(PORT, () => {
    console.log(`server is listening on http://127.0.0.1:${PORT}`)
})