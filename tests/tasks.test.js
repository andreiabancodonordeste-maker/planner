const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

test("GET /tasks returns all tasks", async () => {
  const response = await request(app).get("/tasks");

  assert.equal(response.status, 200);
  assert.equal(response.body.length, 3);
});

test("GET /tasks/:id returns a specific task", async () => {
  const response = await request(app).get("/tasks/1");

  assert.equal(response.status, 200);
  assert.equal(response.body.id, 1);
  assert.equal(response.body.title, "Revisar o artigo ACM Survey");
});

test("GET /tasks/:id returns 404 for non-existent task", async () => {
  const response = await request(app).get("/tasks/999");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "Task not found" });
});

test("PATCH /tasks/:id marks a task as completed with today's date", async () => {
  const today = formatDate(new Date());
  const response = await request(app).patch("/tasks/1");

  assert.equal(response.status, 200);
  assert.equal(response.body.id, 1);
  assert.equal(response.body.completed, true);
  assert.equal(response.body.completionDate, today);
});

test("PATCH /tasks/:id returns 404 for a non-existent task", async () => {
  const response = await request(app).patch("/tasks/999");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "Task not found" });
});

test("POST /tasks creates a new task", {skip: true}, async () => {
  const newTask = {
    title: "Elaborar os projetos de desenvolvimento da turma.",
    date: "14/10/2026"
  };

  const response = await request(app).post("/tasks").send(newTask);

  assert.equal(response.status, 201);
  assert.equal(response.body.title, newTask.title);
  assert.equal(response.body.completed, false);
  assert.equal(response.body.date, newTask.date);
  assert.equal(response.body.completionDate, null);
});  