import { serve } from "https://deno.land/std@0.98.0/http/server.ts";

import { message } from "./depts.js"


import("/opt/depts.js").then(m => {

  console.log("dynamic loaded");
  console.log(m.message);
});


const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: message });
}