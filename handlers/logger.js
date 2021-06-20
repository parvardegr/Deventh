
async function handle(event, context) {
    console.log("recive at "+ event.timestamp);
    console.log(event);
    console.log(context);
}

const name = "logger";

export {
    name, handle
}