import { connect } from "mqtt"

const client = connect()
    .on("connect", () => console.info("connected..."))
    .on("close", () => console.info("closing..."))
    .on("end", () => console.info("ending..."))
    .on("message", (t, payload, packet) => {
        console.info("RECEIVED message on", {
            topic: t,
            payload: payload.toString(),
            packet
        })
    })

const gracefulShutdown = () => {
    client.end(false, () => {
        console.info("...ended")
        process.exit(0)
    })
}

const topic = "ping"
client.subscribe(topic, (packet) => {
    console.info("SUBSCRIBED to", topic, packet)
})

client.subscribe("one/two/three")
client.subscribe("ONE/TWO/+")
client.subscribe("uno/#")

process.on("SIGINT", gracefulShutdown)
