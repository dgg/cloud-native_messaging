import { connect, StringCodec } from "nats"

const client = await connect()
console.info("connected...")

const codec = StringCodec()

const subject = "ping"
const payload = "PING"
client.publish(subject, codec.encode(payload))
console.info("PUBLISHED to", { subject, payload })

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

gracefulShutdown()
