const DEPT_COLOR = {
  Engineering: "var(--dept-eng)",
  People: "var(--dept-people)",
  Finance: "var(--dept-finance)",
  Sales: "var(--dept-sales)",
  Design: "var(--dept-design)",
};

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EmployeeTable({ employees, onEdit, onDelete, busyId }) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__mark wordmark" aria-hidden="true">
          <span className="layer layer--1" />
          <span className="layer layer--2" />
          <span className="layer layer--3" />
        </div>
        <h3>No one in the directory yet</h3>
        <p>Add your first employee to see Layera's dialogs in action.</p>
      </div>
    );
  }

  return (
    <div className="employee-table" role="table" aria-label="Employees">
      <div className="employee-row employee-row--head" role="row">
        <span role="columnheader">Employee</span>
        <span role="columnheader">Department</span>
        <span role="columnheader">Email</span>
        <span role="columnheader" className="align-right">
          Actions
        </span>
      </div>

      {employees.map((emp) => (
        <div className="employee-row" role="row" key={emp.id}>
          <span className="employee-identity" role="cell">
            <span className="avatar" style={{ background: DEPT_COLOR[emp.department] }}>
              {initials(emp.name)}
            </span>
            <span>
              <span className="employee-name">{emp.name}</span>
              <span className="employee-role">{emp.role}</span>
            </span>
          </span>

          <span role="cell">
            <span
              className="dept-tag"
              style={{ borderColor: DEPT_COLOR[emp.department], color: DEPT_COLOR[emp.department] }}
            >
              {emp.department}
            </span>
          </span>

          <span className="employee-email" role="cell">
            {emp.email || "—"}
          </span>

          <span className="employee-actions" role="cell">
            <button
              className="icon-btn"
              onClick={() => onEdit(emp)}
              disabled={busyId === emp.id}
              aria-label={`Edit ${emp.name}`}
            >
              Edit
            </button>
            <button
              className="icon-btn icon-btn--danger"
              onClick={() => onDelete(emp)}
              disabled={busyId === emp.id}
              aria-label={`Delete ${emp.name}`}
            >
              {busyId === emp.id ? "…" : "Delete"}
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
