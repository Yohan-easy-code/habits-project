// habits.helper.js
import { readFile, writeFile } from "node:fs/promises";

const fileURL = new URL("./database.json", import.meta.url);

const todayLocal = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Récupère toutes les habitudes
export async function getHabits() {
  const data = await readFile(fileURL, "utf8");
  const parsed = JSON.parse(data);
  return parsed.habits;
}

// Parcourt toutes les habitudes et ajoute isDoneToday (via .map)
export async function getTodayHabits() {
  const habits = await getHabits();
  const today = todayLocal();
  return habits.map((habit) => ({
    ...habit,
    isDoneToday: habit.daysDone?.[today] === true,
  }));
}

// Ajoute une nouvelle habitude
export async function addHabit(title) {
  const json = await readFile(fileURL, "utf8");
  const db = JSON.parse(json);

  const newHabit = {
    id: db.habits.length ? db.habits.at(-1).id + 1 : 1,
    title,
    daysDone: {},
  };

  db.habits.push(newHabit);
  await writeFile(fileURL, JSON.stringify(db, null, 2), "utf8");
  return newHabit;
}

// Met à jour la date du jour dans daysDone pour l’habitude (done: boolean)
export async function updateHabit(id, done) {
  const json = await readFile(fileURL, "utf8");
  const db = JSON.parse(json);

  const idx = db.habits.findIndex((h) => h.id === Number(id));
  if (idx === -1) {
    const e = new Error(`Habitude ${id} introuvable`);
    e.code = "NOT_FOUND";
    throw e;
  }

  const today = todayLocal();
  db.habits[idx].daysDone[today] = Boolean(done);

  await writeFile(fileURL, JSON.stringify(db, null, 2), "utf8");
  return db.habits[idx];
}
