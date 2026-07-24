# Layera Test — Employee Directory

A small Employee Management System built to exercise every current
[Layera](https://github.com/Vetri-Karthikeyan/Layera) primitive against a
realistic CRUD flow: add, edit, delete, search — the kind of screen every
internal tool eventually needs.

## Run it

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## What it demonstrates

| Feature | Where |
|---|---|
| ✅ Open dialog | `layera.open(EmployeeFormDialog)` in `handleAdd` / `handleEdit` |
| ✅ Close dialog | `close()` / `close(value)` inside `EmployeeFormDialog` |
| ✅ Return value (`result()`) | `await layera.open(...).result()` — the dialog resolves with the form data, or `undefined` on cancel |
| ✅ Confirm | `layera.confirm({ danger: true })` before delete |
| ✅ Alert | `layera.alert(...)` after a directory note is submitted |
| ✅ Prompt | `layera.prompt(...)` for the "Add directory note" toolbar action |
| ✅ Toast | `layera.toast.success` / `.error` on every create/update/delete |
| ✅ Loading | `layera.loading("...")` wraps every mock API call in `employeeService` |
| ✅ Multiple overlays | Prompt → Alert chain stacks two overlays; a loading overlay can appear while a toast from a previous action is still visible |
| ✅ ESC close | Built into `ConfirmDialog`/`PromptDialog`; wired manually in the custom `EmployeeFormDialog` |
| ✅ Backdrop click | Same — native in the built-ins, added explicitly to `EmployeeFormDialog` |
| ✅ Keyboard shortcuts | Enter submits the form / prompt, Escape cancels |
| 🆕 Before/After comparison | "Before / After" button in the header opens a `layera.open(BeforeAfterDialog)` panel — real code, side by side, for the exact Edit flow this app uses |

The one component, two jobs pattern is in `EmployeeFormDialog.jsx`: it's
opened with no props for "Add" and with `{ employee }` for "Edit" — the
component doesn't know or care which, Layera just passes different props.

`employeeService.js` is an in-memory mock with artificial latency
(400–600ms) so the loading overlay has something real to cover instead of
resolving instantly.

## Structure

```
src/
  App.js                          — all Layera call sites live here
  dialogs/EmployeeFormDialog.jsx  — shared Add/Edit dialog
  components/EmployeeTable.jsx    — list + empty state
  services/employeeService.js     — mock async CRUD
  data/seedEmployees.js           — starting data
  layera-theme.css                — styling (Layera ships unstyled-by-default
                                     built-ins; this only themes the app shell
                                     and the custom dialog)
```
