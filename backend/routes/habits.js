// routes/habits.js
import {
  getHabits,
  getTodayHabits,
  addHabit,
  updateHabit,
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
