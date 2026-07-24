let idCounter = 4;

export const nextEmployeeId = () => idCounter++;

export const seedEmployees = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Engineer",
    department: "Engineering",
    email: "john.doe@company.com",
  },
  {
    id: 2,
    name: "Alice Fernandes",
    role: "HR Business Partner",
    department: "People",
    email: "alice.fernandes@company.com",
  },
  {
    id: 3,
    name: "Bob Robert ",
    role: "Engineering Manager",
    department: "Engineering",
    email: "bob.robert @company.com",
  },
];
