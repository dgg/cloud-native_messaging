const { default: Redis } = require("ioredis")

const client = new Redis()
client.publish("ping", "PING").then(n => console.info(n))

client.publish("one.two.three", "123")
    .then(() => client.publish("ONE/TWO/THREE", "123"))
    .then(() => client.publish("uno.dos.tres", "123"))
    .then(() => client.quit())
