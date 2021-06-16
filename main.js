import { serve } from "https://deno.land/std@0.98.0/http/server.ts";

const handlers = [
  "/opt/logger.js",
  "/opt/queue.js",
  "/opt/integration.js"
  ]

const handlerModulesMap = async (handlers = []) => {
  console.log("loading handler modules");
  console.log(handlers);

  return handlers.map(handlerModule => {
    try {

      console.log("start loading handler module " + handlerModule);

      const module = await import(handlerModule);

      if (module.handle) {

        console.log("OK: load handler " + handlerModule);

        return module;

      } else {
        console.log("cant load handler module " + handlerModule);
        console.log("cant find 'export async handle(event, context)' function in provided module " + handlerModule);
      }

    } catch (e) {
      console.log(e);
    }

    return undefined;

  }).filter(module => module !== undefined);

}

import("/opt/logger.js").then(m => {

  m.handle({
    "event": "TEST"
  }, {
    "handlerName": m.name
  });
  
});


const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: message });
}

console.log(await handlerModulesMap());