// routes/habits.js
import {
  getHabits,
  getTodayHabits,
  addHabit,
  updateHabit,
  deleteHabit,
} from "../habits.helper.js";

export async function habitsRoute(fastify) {
  // /habits
  fastify.get("/", async () => {
    return await getHabits();
  });

  // /habits/today
  fastify.get("/today", async () => {
    return await getTodayHabits();
  });

  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params ?? {};
    try {
      const removed = await deleteHabit(id); // ← passe l'id et await
      reply.code(200);
      return removed; // ou reply.code(204) et return null
    } catch (err) {
      if (err.code === "NOT_FOUND") {
        reply.code(404);
        return { error: err.message };
      }
      request.log.error(err);
      reply.code(500);
      return { error: "Erreur interne." };
    }
  });

  // /habits  (POST)
  fastify.post("/", async (request, reply) => {
    const { title } = request.body ?? {};
    if (!title || typeof title !== "string") {
      reply.code(400);
      return { error: "Le champ 'title' est requis et doit être une chaîne." };
    }
    const created = await addHabit(title.trim());
    reply.code(201);
    return created;
  });

  // /habits/:id  (PATCH)
  fastify.patch("/:id", async (request, reply) => {
    const { id } = request.params ?? {};
    const { done } = request.body ?? {};

    // Spécification : si 'done' n'est pas présent, retourner 404
    if (typeof done === "undefined") {
      reply.code(404);
      return { error: "Le champ 'done' est requis (true/false)." };
    }

    try {
      const updated = await updateHabit(id, done);
      return updated;
    } catch (err) {
      if (err.code === "NOT_FOUND") {
        reply.code(404);
        return { error: err.message };
      }
      reply.code(500);
      return { error: "Erreur interne." };
    }
  });
}
