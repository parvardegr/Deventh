import { serve } from "https://deno.land/std@0.98.0/http/server.ts";

import { message } from "./depts.js"

const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: message });
}