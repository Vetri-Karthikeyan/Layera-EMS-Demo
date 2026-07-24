const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "async",
  "await", "import", "export", "from", "default", "new", "this",
  "true", "false", "null", "undefined", "useState",
]);

// Tokenizes JS into { type, value } pairs. Deliberately simple — this is
// for readable demo code blocks, not a real parser. Order matters: try
// comments and strings first so keywords inside them don't get matched.
const TOKEN_PATTERN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\b)|([A-Za-z_$][\w$]*)|([{}()[\];,.<>=+\-!:])/gm;

function tokenize(code) {
  const tokens = [];
  let lastIndex = 0;
  let match;
  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(code))) {
    if (match.index > lastIndex) {
      tokens.push({ type: "plain", value: code.slice(lastIndex, match.index) });
    }
    const [full, comment, string, number, word, punct] = match;
    if (comment) tokens.push({ type: "comment", value: comment });
    else if (string) tokens.push({ type: "string", value: string });
    else if (number) tokens.push({ type: "number", value: number });
    else if (word) tokens.push({ type: KEYWORDS.has(word) ? "keyword" : "plain", value: word });
    else if (punct) tokens.push({ type: "punct", value: punct });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < code.length) {
    tokens.push({ type: "plain", value: code.slice(lastIndex) });
  }
  return tokens;
}

export default function CodeBlock({ code, highlightLines = [] }) {
  const lines = code.replace(/^\n/, "").trimEnd().split("\n");

  return (
    <pre className="code-block">
      <code>
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              "code-line" + (highlightLines.includes(i + 1) ? " code-line--marked" : "")
            }
          >
            {tokenize(line).map((tok, j) => (
              <span key={j} className={`tok-${tok.type}`}>
                {tok.value}
              </span>
            ))}
            {line.length === 0 && "\u00A0"}
          </div>
        ))}
      </code>
    </pre>
  );
}
