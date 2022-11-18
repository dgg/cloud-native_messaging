# Cloud-Native Messaging
A broad comparison of MQTT to NATS for messaging (with a little bit of Redis pub-sub) from the goggles of a NodeJS developer doing simple messaging.

## Installation

We expect node to be installed for examples to be ran.<br/>
We recommend [NVM](https://github.com/nvm-sh/nvm) to install and handle NodeJS versions.

If you have it installed, run the following command in the root of the repo:
```bash
$ nvm use
```

Once the righ version of node is ensured, install dependencies:

```bash
$ npm ci
```

## Running examples

Examples are runnable just as node scripts. For example, for running PUBSUB samples for _MQTT_:

```bash
$ node src/pub_sub/mqtt/subscriber.mjs  

$ node src/pub_sub/mqtt/publisher.mjs 
```
