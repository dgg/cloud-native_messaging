import { connect, StringCodec, JSONCodec } from "nats"

const client = await connect()
console.info("connected...")

const codec = StringCodec()

const subject = "ping"
const payload = "PING"
client.publish(subject, codec.encode(payload))
console.info("PUBLISHED to", { subject, payload })

const json = JSONCodec()
client.publish("one.two.three", json.encode({ value: 123 }))
client.publish("ONE.TWO.THREE", json.encode({ value: "123" }))
client.publish("uno.dos.tres", json.encode({ value: 123.5 }))

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
