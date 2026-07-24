// Every snippet here is the real, working shape of what this app does —
// simplified slightly for readability (removed setBusyId, error handling
// noise), but not fictional. Each entry maps to one Layera primitive and
// is used by the "Before / After" dialog's tabs.

export const primitives = [
  {
    key: "open",
    label: "Open / Close",
    title: "layera.open() — Edit Employee",
    note:
      "One await. The dialog resolves with the form's value, or undefined if it was cancelled — no state to reset, nothing to forget.",
    before: `
function EmployeeList() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  function startEdit(employee) {
    setEditingEmployee(employee);
    setIsEditOpen(true);
  }

  async function handleSave(updated) {
    await employeeService.update(editingEmployee.id, updated);
    setIsEditOpen(false);
    setEditingEmployee(null);
  }

  return (
    <>
      <button onClick={() => startEdit(employee)}>Edit</button>

      {isEditOpen && editingEmployee && (
        <EmployeeFormDialog
          employee={editingEmployee}
          onCancel={() => {
            setIsEditOpen(false);
            setEditingEmployee(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
`.trim(),
    after: `
async function handleEdit(employee) {
  const updated = await layera
    .open(EmployeeFormDialog, { employee })
    .result();

  if (!updated) return; // cancelled
  await employeeService.update(employee.id, updated);
}
`.trim(),
  },

  {
    key: "confirm",
    label: "Confirm",
    title: "layera.confirm() — Delete Employee",
    note:
      "No modal component to build, no open/close state — confirm() is a function call that returns a boolean.",
    before: `
function EmployeeRow({ employee }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  async function handleConfirmedDelete() {
    setIsConfirmOpen(false);
    await employeeService.remove(employee.id);
  }

  return (
    <>
      <button onClick={() => setIsConfirmOpen(true)}>Delete</button>

      {isConfirmOpen && (
        <ConfirmModal
          title="Delete employee?"
          message={\`\${employee.name} will be removed.\`}
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmedDelete}
        />
      )}
    </>
  );
}
`.trim(),
    after: `
async function handleDelete(employee) {
  const ok = await layera.confirm({
    title: "Delete employee?",
    message: \`\${employee.name} will be removed from the directory.\`,
    confirmText: "Delete",
    danger: true,
  });

  if (!ok) return;
  await employeeService.remove(employee.id);
}
`.trim(),
  },

  {
    key: "prompt",
    label: "Prompt",
    title: "layera.prompt() — Directory note",
    note:
      "prompt() is confirm()'s cousin — same idea, but it resolves with typed text instead of a boolean.",
    before: `
function Toolbar() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  function handleSubmit(text) {
    setIsPromptOpen(false);
    if (text) showNoteSavedAlert(text);
  }

  return (
    <>
      <button onClick={() => setIsPromptOpen(true)}>
        Add directory note
      </button>

      {isPromptOpen && (
        <PromptModal
          title="Add a directory note"
          onCancel={() => setIsPromptOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
`.trim(),
    after: `
async function handleQuickNote() {
  const note = await layera.prompt({
    title: "Add a directory note",
    placeholder: "e.g. Freeze headcount until Q3",
  });

  if (note) await layera.alert({ message: \`"\${note}" — noted.\` });
}
`.trim(),
  },

  {
    key: "alert",
    label: "Alert",
    title: "layera.alert() — Note saved",
    note:
      "Chained straight off the prompt — two overlays back to back, no extra state connecting them.",
    before: `
function Toolbar() {
  const [alertMessage, setAlertMessage] = useState(null);

  function handleNoteSubmit(text) {
    setAlertMessage(\`"\${text}" — noted.\`);
  }

  return (
    <>
      {/* ...prompt modal calls handleNoteSubmit... */}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
}
`.trim(),
    after: `
if (note) {
  await layera.alert({
    title: "Note saved",
    message: \`"\${note}" — noted. (Not persisted in this demo.)\`,
  });
}
`.trim(),
  },

  {
    key: "toast",
    label: "Toast",
    title: "layera.toast — Success / error feedback",
    note:
      "No toast container to mount, no id bookkeeping to dismiss it later — it manages its own lifecycle.",
    before: `
function EmployeeList() {
  const [toast, setToast] = useState(null);

  async function handleDelete(employee) {
    try {
      await employeeService.remove(employee.id);
      setToast({ type: "success", text: \`\${employee.name} deleted\` });
    } catch {
      setToast({ type: "error", text: "Couldn't delete employee." });
    }
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      {/* ...rows... */}
      {toast && <ToastBanner {...toast} />}
    </>
  );
}
`.trim(),
    after: `
async function handleDelete(employee) {
  try {
    await employeeService.remove(employee.id);
    layera.toast.success(\`\${employee.name} deleted\`);
  } catch {
    layera.toast.error("Couldn't delete employee.");
  }
}
`.trim(),
  },

  {
    key: "loading",
    label: "Loading",
    title: "layera.loading() — Wrapping the mock API calls",
    note:
      "loading() returns a handle with its own .close() — no isSaving state, no risk of it getting stuck true if a request throws.",
    before: `
function EmployeeRow({ employee }) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleDelete() {
    setIsSaving(true);
    await employeeService.remove(employee.id);
    setIsSaving(false);
  }

  return (
    <>
      <button onClick={handleDelete} disabled={isSaving}>
        {isSaving ? "Deleting…" : "Delete"}
      </button>
      {isSaving && <GlobalSpinnerOverlay />}
    </>
  );
}
`.trim(),
    after: `
async function handleDelete(employee) {
  const overlay = layera.loading("Deleting...");
  await employeeService.remove(employee.id);
  overlay.close();
}
`.trim(),
  },
];
