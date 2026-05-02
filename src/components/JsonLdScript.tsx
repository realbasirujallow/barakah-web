/**
 * JsonLdScript — single source of truth for embedding JSON-LD schema.org
 * markup into Next.js pages.
 *
 * 2026-05-02 audit M-5: prior to this helper, JSON-LD blocks scattered
 * `dangerouslySetInnerHTML` across ~90 page files with inconsistent
 * escaping. The dangerous pattern was code that called
 * `JSON.stringify(schema)` without replacing `</` — if a future schema
 * field ever held an attacker-controlled value (e.g. a user-submitted
 * blog title), the unescaped `</script>` sequence would let arbitrary
 * markup break out of the JSON-LD block and execute as HTML.
 *
 * This helper ALWAYS does the `</` → `<\/` replacement so the closing-
 * script-tag-breakout vector is impossible regardless of payload. New
 * pages should use this component rather than reaching for
 * `dangerouslySetInnerHTML` directly. Existing pages will be migrated
 * in a follow-up sweep.
 *
 * Usage:
 *   <JsonLdScript schema={{ "@context": "https://schema.org", ... }} />
 */

import React from "react";

interface JsonLdScriptProps {
  // We accept anything JSON-serializable. Schema.org JSON-LD payloads
  // can mix arrays, nested objects, primitives, and `@context` /
  // `@type` directives — a strict TypeScript shape would be more
  // restrictive than the spec.
  schema: Record<string, unknown> | unknown[];
  // Optional id — useful if a page emits multiple schemas and wants
  // to disambiguate them in DevTools or for Google's Rich Results test.
  id?: string;
}

/**
 * Escape any sequence that could end the surrounding <script> tag.
 * Replacing `</` is sufficient — JSON has no other character that
 * matches an HTML token boundary inside a script element.
 */
function safeStringify(value: unknown): string {
  return JSON.stringify(value).replace(/<\//g, "<\\/");
}

export function JsonLdScript({ schema, id }: JsonLdScriptProps) {
  return (
    // The dangerouslySetInnerHTML usage below is safe: safeStringify
    // escapes `</` so a stray "</script>" payload cannot break out
    // of the JSON-LD block. This is the ONLY blessed location in
    // the codebase for embedding JSON-LD — future SEO pages should
    // import this component instead of reaching for
    // dangerouslySetInnerHTML directly.
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: safeStringify(schema) }}
    />
  );
}

export default JsonLdScript;
