import { useEffect, useState } from "react";
import { useOverlayController } from "layera";

const DEPARTMENTS = ["Engineering", "People", "Finance", "Sales", "Design"];

const emptyForm = {
  name: "",
  role: "",
  department: DEPARTMENTS[0],
  email: "",
};

/**
 * One component, two jobs. When opened with { employee } it edits;
 * with no props it adds. Layera decides which by what's passed to
 * layera.open() — the component itself doesn't know or care.
 */
export default function EmployeeFormDialog({ employee }) {
  const { close } = useOverlayController();
  const isEdit = Boolean(employee);
  const [form, setForm] = useState(employee ? { ...employee } : emptyForm);
  const [error, setError] = useState("");

  // ✅ ESC close — Layera doesn't impose this on custom dialogs, so
  // custom overlays wire it up themselves, same as backdrop-click below.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      setError("Name and role are required.");
      return;
    }
    close(form);
  }

  return (
    <div className="layera-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) close();
    }}>
      <form className="layera-card layera-card--stacked" onSubmit={handleSubmit}>
        <div className="layera-card__eyebrow">
          {isEdit ? "Edit employee" : "New employee"}
        </div>
        <h2 className="layera-card__title">
          {isEdit ? `Update ${employee.name}` : "Add someone to the directory"}
        </h2>

        <label className="field">
          <span>Full name</span>
          <input
            autoFocus
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Martin Alexander"
          />
        </label>

        <label className="field">
          <span>Role</span>
          <input
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="e.g. Product Designer"
          />
        </label>

        <label className="field">
          <span>Department</span>
          <select
            value={form.department}
            onChange={(e) => update("department", e.target.value)}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="name@company.com"
          />
        </label>

        {error && <p className="field-error">{error}</p>}

        <div className="layera-card__actions">
          <button type="button" className="btn btn--ghost" onClick={() => close()}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {isEdit ? "Save changes" : "Add employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
