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
})

client.publish("one/two/three", Buffer.from("123"), (packet) => {
    console.info("PUBLISHED to", { topic: "one...", packet })

    client.publish("ONE/TWO/THREE", Buffer.from("123"), (packet) => {
        console.info("PUBLISHED to", { topic: "ONE...", packet })

        client.publish("uno/dos/tres", Buffer.from("123"), (packet) => {
            console.info("PUBLISHED to", { topic: "uno...", packet })
            gracefulShutdown()
        })
    })
})
