import { connect } from "mqtt"

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

const client = connect({ protocolVersion: 5 })
    .on("connect", () => console.info("connected..."))
    .on("close", () => console.info("closing..."))
    .on("end", () => console.info("ending..."))
    .on("message", (method, payload, packet) => {
        const arg = JSON.parse(payload)
        const { responseTopic, correlationData } = packet.properties

        console.info("RECEIVED request", {
            method,
            arg,
            correlationData: correlationData.toString()
        })
        const { subject } = arg
        greet(subject)
            .then(greeting => {
                const response = { greeting }
                client.publish(
                    responseTopic,
                    JSON.stringify(response),
                    { qos: 2, properties: { correlationData } },
                    packet => {
                        console.info("responded to", method, "with", response)
                    })
            })
    })

const gracefulShutdown = () => {
    client.end(false, () => {
        console.info("...ended")
        process.exit(0)
    })
}

const method = "greet"
client.subscribe(method, { qos: 2 })

process.on("SIGINT", gracefulShutdown)
