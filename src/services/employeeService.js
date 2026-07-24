import { seedEmployees, nextEmployeeId } from "../data/seedEmployees";

// In-memory "database" so the demo behaves like a real backend without
// needing one. Every method returns a Promise and has artificial latency
// so Layera's loading() overlay has something real to cover.
let employees = [...seedEmployees];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const employeeService = {
  async list() {
    await delay(400);
    return [...employees];
  },

  async create(payload) {
    await delay(600);
    const created = { id: nextEmployeeId(), ...payload };
    employees = [...employees, created];
    return created;
  },

  async update(id, payload) {
    await delay(600);
    employees = employees.map((emp) =>
      emp.id === id ? { ...emp, ...payload } : emp
    );
    return employees.find((emp) => emp.id === id);
  },

  async remove(id) {
    await delay(500);
    employees = employees.filter((emp) => emp.id !== id);
    return true;
  },
};
