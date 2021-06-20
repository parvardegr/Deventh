import { serve } from "https://deno.land/std@0.98.0/http/server.ts";

const handlers = [
  "./handlers/logger.js",
  "/opt/queue.js",
  "/opt/integration.js"
  ]

const handlerModulesList = async (handlers = []) => {
  console.log("Loading handler modules\n");
  console.log(handlers);

  return handlers.map(async (handlerModule) => {
    try {

      console.log("Start loading handler module " + handlerModule);

      const module = await import(handlerModule);

      console.log(handlerModule + " loaded ");
      console.log(module);

      if (module.handle) {

        console.log("OK: load handler " + handlerModule);
        
        return module;

      } else {
        console.log("FAILED: cant load handler module " + handlerModule);
        console.log("`async function handle(event, context)` does not exists or `export` in module " + handlerModule);
      }

    } catch (e) {
      console.log(e);
    }

  });

}

import("./handlers/logger.js").then(m => {

  m.handle({
    "event": "TEST",
    "timestamp": new Date()
  }, {
    "handlerName": m.name
  });
  
});


let loadedModules = [];

handlerModulesList(handlers).then(list => {
  Promise.all(list).then(handlers => {  
    loadedModules = handlers.filter(handlerModule => handlerModule !== undefined);
  });
});

const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {

  if(req.method === "POST") {
    const body = JSON.parse(new TextDecoder().decode(await Deno.readAll(req.body)));
    await handle(body);
  }
  
  req.respond({ body: "OK" });

}

async function handle(event) {
  event.reciveAt = new Date();
  const config = {}; //per handler context contains config and ...

  loadedModules.forEach(handler => handler.handle(event, config));
}
