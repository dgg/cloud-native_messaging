import { connect, JSONCodec } from "nats"
import { setTimeout } from "timers"

const client = await connect()
console.info("connected...")

const greet = (subject) => {
    switch (subject) {
        case "WORLD":
            return new Promise((resolve) => {
                setTimeout(resolve, 2000)
            })
        default:
            return Promise.resolve(`hello, ${subject}`)
    }
}

const greetHandler = async (subscription) => {
    const codec = JSONCodec()
    const method = subscription.getSubject()
    console.info("Listening to", method, "requests")

    for await (const request of subscription) {
        const arg = codec.decode(request.data)

        const greeting = await greet(arg.subject)
        const response = { greeting }
        request.respond(codec.encode(response))

        console.info("RESPONDED to", method, "with", response)
    }
    console.info("REQUEST drained", method)
}

const method = "greet"
const greetSub = client.subscribe(method)
greetHandler(greetSub)

const gracefulShutdown = () => {
    client.drain()
        .then(() => {
            console.info("...drained")
            process.exit(0)
        }).catch(e => {
            console.error("could not drain", e)
            process.exit(1)
        })
}

process.on("SIGINT", gracefulShutdown)
