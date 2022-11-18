import { connect, ErrorCode, JSONCodec } from "nats"

const client = await connect()
console.info("connected...")

const gracefulShutdown = () => {
    client.drain()
        .then(() => {
            console.info("...drained")
            process.exit(0)
        }).catch(e => {
            console.error("could not close", e)
            process.exit(1)
        })
}

const codec = JSONCodec()

const method = "greet"
const arg = { subject: "world" }
client.request(method, codec.encode(arg), { timeout: 1000 })
    .then(msg => {
        console.info("RECEIVED response", codec.decode(msg.data))
    })
    .catch(e => {
        if (e.code === ErrorCode.NoResponders) {
            console.error("OOPS", "no one cares")
        } else if (e.code === ErrorCode.Timeout) {
            console.error("OOPS", "no one was fast enough")
        } else {
            console.error("CATCHrequest", "problems with request", e)
        }
    })
    .finally(() => gracefulShutdown())
console.info("REQUESTED", { method, arg })
