import { connect } from "mqtt"

const SHARE = "$share"
const sharedGroup = "our_group"

const client = connect({properties: {}})
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

const sharedTopic = `${SHARE}/${sharedGroup}/ping`
client.subscribe(sharedTopic, (packet) => {
    console.info("SUBSCRIBED to", sharedTopic, packet)
})

process.on("SIGINT", gracefulShutdown)
