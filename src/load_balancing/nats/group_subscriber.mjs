import { connect,  StringCodec } from "nats"

const client = await connect({name: "name"})
console.info("connected...")

const subject = "ping"
const ping = client.subscribe(subject, {queue: "THE_QUEUE"})
console.info("SUBSCRIBED to", ping.getSubject())

const messageHandler = async (subscription, codec) => {
    const subscribedTo = subscription.getSubject()
    
    for await (const message of subscription) {
        const payload = codec.decode(message.data)
        const {subject} = message
        console.info("RECEIVED message on", subject, `[${subscribedTo}]`, payload)
    }
    console.info("SUB closed", subscribedTo)
}

messageHandler(ping, StringCodec())

const gracefulShutdown = () => {
    client.drain().then(() => {
        console.info("...drained")
        process.exit(0)
    }).catch(e => {
        console.error("could not drain", e)
        process.exit(1)
    })
}

process.on("SIGINT", gracefulShutdown)
