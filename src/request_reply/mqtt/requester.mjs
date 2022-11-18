import { connect } from "mqtt"

const gracefulShutdown = () => {
    client.end(false, () => {
        console.info("...ended")
        process.exit(0)
    })
}
const client = connect({ protocolVersion: 5 })
    .on("connect", () => console.info("connected..."))
    .on("close", () => console.info("closing..."))
    .on("end", () => console.info("ending..."))
    .on("message", (method, payload, packet) => {
        const response = JSON.parse(payload.toString())
        // not handling correlation-data
        console.info("RECEIVED response on", { method, response }, "ignoring", packet.properties.correlationData.toString())
        gracefulShutdown()
    })

const method = "greet"
const responseTopic = `${method}/response`
// not handling timeout
client.subscribe(responseTopic, { qos: 2 })

const arg = JSON.stringify({ subject: "world" })
const correlationData = new Date().valueOf().toString()
client.publish(method, arg, {
    qos: 2,
    properties: { correlationData, responseTopic }
}, (packet) => {
    console.info("made request", { method, packet })
})

process.on("SIGINT", gracefulShutdown)
