const { channel } = require("diagnostics_channel");
const {default: Redis} = require("ioredis")

const client = new Redis()
.on("message", (channel, message) => {
    console.info("RECEIVED message on", {
        channel,
        message
    })
})
.on("pmessage", (pattern, channel, message) => {
    console.info("RECEIVED p-message on", {
        pattern,
        channel,
        message
    })
})

;(async ()=> {
    let count = await client.subscribe("ping")
    console.info("SUBSCRIBED to", count, "channels")
    
    count = await client.psubscribe("one.two.three")
    console.info("SUBSCRIBED to", count, "channels")

    await client.psubscribe("ONE/*/THREE")
    await client.psubscribe("uno.*")

})();

const gracefulShutdown = () => {
    client.quit(() => {
        console.info("...quitted")
        process.exit(0)
    })
}

process.on("SIGINT", gracefulShutdown)
