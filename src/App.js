import { useEffect, useState } from "react";
import { layera } from "layera";
import EmployeeFormDialog from "./dialogs/EmployeeFormDialog";
import BeforeAfterDialog from "./dialogs/BeforeAfterDialog";
import EmployeeTable from "./components/EmployeeTable";
import Footer from "./components/Footer";
import { employeeService } from "./services/employeeService";
import "./layera-theme.css";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // ✅ Loading — also fires on the very first fetch, not just
    // create/update/delete. Refresh the page and you'll see it.
    const overlay = layera.loading("Loading employees...");
    employeeService.list().then((data) => {
      setEmployees(data);
      setLoadingList(false);
      overlay.close();
    });
  }, []);

  // ✅ Open Dialog / ✅ Close Dialog / ✅ Return Value (result())
  async function handleAdd() {
    const created = await layera.open(EmployeeFormDialog).result();
    if (!created) return; // user cancelled — dialog closed with no value

    // ✅ Loading while saving
    const overlay = layera.loading("Adding employee...");
    try {
      const saved = await employeeService.create(created);
      setEmployees((prev) => [...prev, saved]);
      layera.toast.success(`${saved.name} added to the directory`);
    } catch (err) {
      layera.toast.error("Couldn't add employee. Try again.");
    } finally {
      overlay.close();
    }
  }

  async function handleEdit(employee) {
    const updated = await layera
      .open(EmployeeFormDialog, { employee })
      .result();
    if (!updated) return;

    setBusyId(employee.id);
    const overlay = layera.loading(`Saving ${employee.name}...`);
    try {
      const saved = await employeeService.update(employee.id, updated);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === employee.id ? saved : emp))
      );
      layera.toast.success("Changes saved");
    } catch (err) {
      layera.toast.error("Couldn't save changes. Try again.");
    } finally {
      overlay.close();
      setBusyId(null);
    }
  }

  // ✅ Confirm
  async function handleDelete(employee) {
    const ok = await layera.confirm({
      title: "Delete employee?",
      message: `${employee.name} will be removed from the directory. This can't be undone.`,
      confirmText: "Delete",
      cancelText: "Keep",
      danger: true,
    });
    if (!ok) return;

    setBusyId(employee.id);
    const overlay = layera.loading("Deleting...");
    try {
      await employeeService.remove(employee.id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
      layera.toast.success(`${employee.name} deleted`);
    } catch (err) {
      layera.toast.error("Couldn't delete employee.");
    } finally {
      overlay.close();
      setBusyId(null);
    }
  }

  // ✅ Prompt — quick action to relabel a department, tucked in the toolbar
  async function handleQuickNote() {
    const note = await layera.prompt({
      title: "Add a directory note",
      message: "This is a plain layera.prompt() call — shown as an alert once submitted.",
      placeholder: "e.g. Freeze headcount until Q3",
    });
    if (note) {
      // ✅ Alert
      await layera.alert({
        title: "Note saved",
        message: `"${note}" — noted. (Not persisted in this demo.)`,
      });
    }
  }

  // ✅ Meta: this comparison dialog is itself opened through Layera
  function handleCompare() {
    layera.open(BeforeAfterDialog);
  }

  const filtered = employees.filter((emp) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="wordmark">
          <span className="layer layer--1" />
          <span className="layer layer--2" />
          <span className="layer layer--3" />
          <div className="wordmark__text">
            <strong>Employee Directory</strong>
            <span>Layera interaction test bed</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn--ghost" onClick={handleCompare}>
            Before / After
          </button>
          <button className="btn btn--accent" onClick={handleAdd}>
            + Add Employee
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <input
            className="search"
            placeholder="Search by name, role or department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn--ghost" onClick={handleQuickNote}>
            Add directory note
          </button>
        </div>

        {loadingList ? (
          <p className="loading-hint">Loading employees…</p>
        ) : (
          <EmployeeTable
            employees={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            busyId={busyId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}