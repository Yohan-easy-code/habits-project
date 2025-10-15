// /api/habits-api.js
export const BASE_URL = "http://localhost:3000";

export const getHabitsToday = () =>
  fetch("http://localhost:3000/habits/today").then((r) => {
    if (!r.ok) throw new Error("Failed to load today habits");
    return r.json();
  });

export const getAllHabits = () =>
  fetch("http://localhost:3000/habits").then((r) => {
    if (!r.ok) throw new Error("Failed to load all habits");
    return r.json();
  });

export const updateHabitDone = (id, done) =>
  fetch(`${BASE_URL}/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done }),
  }).then((r) => {
    if (!r.ok) throw new Error("Failed to update habit");
    return r.json();
  });

export const addHabit = (title) =>
  fetch(`${BASE_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  }).then((r) => {
    if (!r.ok) throw new Error("Failed to create habit");
    return r.json();
  });
