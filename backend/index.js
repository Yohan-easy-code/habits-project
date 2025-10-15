import cors from "@fastify/cors";
import Fastify from "fastify";
import process from "process";
import { habitsRoute } from "./routes/habits.js";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

// Test si le serveur fonctionne
fastify.get("/", async () => {
  return { hello: "world" };
});

fastify.register(habitsRoute, { prefix: "/habits" });

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
