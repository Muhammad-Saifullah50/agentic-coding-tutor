export function detectLanguage(code: string): string {
  const trimmed = code.trim();

  // --- Python ---
  if (
    /def\s+\w+\s*\(/.test(code) ||                 // def function()
    /class\s+\w+(\([\w, ]+\))?:/.test(code) ||     // class Something:
    /import\s+\w+/.test(code) ||                   // import x
    /print\(.+\)/.test(code)                       // print()
  ) {
    return "python";
  }

  // --- JavaScript / TypeScript ---
  if (
    /function\s+\w+\s*\(/.test(code) ||                 // function x()
    /\w+\s*=\s*\(/.test(code) ||                        // const x = ()
    /console\.log/.test(code) ||                        // console.log
    /export\s+(default\s+)?(function|class|const|let)/.test(code)
  ) {
    return "javascript";
  }

  // --- HTML ---
  if (
    /<([A-Za-z]+)(\s+[^>]+)?>/.test(code) &&            // <div>
    /<\/([A-Za-z]+)>/.test(code)                        // </div>
  ) {
    return "html";
  }

  // --- CSS ---
  if (
    /[a-zA-Z0-9\-\_]+\s*\{[^}]*\}/.test(code) &&        // .class { }
    /:[^;]+;/.test(code)                                // property: value;
  ) {
    return "css";
  }

  // --- JSON ---
  if (
    /^\s*\{[\s\S]*\}\s*$/.test(code) &&                 // { ... }
    /"[A-Za-z0-9_]+":/.test(code)                       // "key":
  ) {
    return "json";
  }

  // --- SQL ---
  if (
    /\bSELECT\b/i.test(code) ||
    /\bINSERT\b/i.test(code) ||
    /\bUPDATE\b/i.test(code) ||
    /\bDELETE\b/i.test(code)
  ) {
    return "sql";
  }

  // --- Java ---
  if (
    /public\s+class\s+\w+/.test(code) ||
    /System\.out\.println/.test(code)
  ) {
    return "java";
  }

  // --- C / C++ ---
  if (
    /#include\s+</.test(code) ||
    /\bint\s+main\s*\(/.test(code)
  ) {
    return "cpp";
  }

  // --- Default fallback ---
  return "plaintext";
}
