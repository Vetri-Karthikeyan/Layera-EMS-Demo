import { useState } from "react";
import { useOverlayController } from "layera";
import CodeBlock from "../components/CodeBlock";
import { primitives } from "../data/codeSamples";


export default function BeforeAfterDialog() {
  const { close } = useOverlayController();
  const [activeKey, setActiveKey] = useState(primitives[0].key);
  const [view, setView] = useState("after");

  const active = primitives.find((p) => p.key === activeKey);
  const code = view === "before" ? active.before : active.after;

  return (
    <div
      className="layera-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="compare-card layera-card--stacked">
        <div className="compare-card__header">
          <div>
            <div className="layera-card__eyebrow">Six primitives, real code</div>
            <h2 className="layera-card__title">What each Layera call replaces</h2>
          </div>
          <button className="btn btn--ghost" onClick={() => close()}>
            Close
          </button>
        </div>

        <div className="compare-tabs" role="tablist" aria-label="Choose a primitive">
          {primitives.map((p) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={activeKey === p.key}
              className={"compare-tab" + (activeKey === p.key ? " compare-tab--active" : "")}
              onClick={() => setActiveKey(p.key)}
            >
              {p.label}
            </button> 
          ))}
        </div>

        <p className="compare-title">{active.title}</p>

        <div className="compare-subtabs" role="tablist" aria-label="Before or after">
          {["before", "after"].map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={"compare-subtab" + (view === v ? " compare-subtab--active" : "")}
              onClick={() => setView(v)}
            >
              {v === "before" ? "Before Layera" : "After Layera"}
            </button>
          ))}
        </div>

        <CodeBlock code={code} />

        <p className="compare-note">{active.note}</p>
      </div>
    </div>
  );
}
