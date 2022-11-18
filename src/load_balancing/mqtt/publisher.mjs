import { connect } from "mqtt"

const client = connect()
    .on("connect", () => console.info("connected..."))
    .on("close", () => console.info("closing..."))
    .on("end", () => console.info("ending..."))

const gracefulShutdown = () => {
    client.end(false, () => {
        console.info("...ended")
        process.exit(0)
    })
}

const topic = "ping"
const message = "PING"
client.publish(topic, message, (packet) => {
    console.info("PUBLISHED to", { topic, packet })
    gracefulShutdown()
})
