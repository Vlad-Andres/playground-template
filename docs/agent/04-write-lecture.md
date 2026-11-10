# Write a lecture

Write source-grounded content in this order:

1. Add concepts before using a `concepts` block.
2. State objectives and the source's intended outcomes.
3. Explain ideas in short `prose` or `info` blocks; split long Markdown rather than hiding
   several claims in one paragraph.
4. Use `formula`, `steps`, `table`, `timeline`, `figure`, `code`, `quiz`, `recall`, `practice`,
   and `exercises` only when the source supports that representation. See the block references.
5. Add a widget only if the manifest contains a matching type and the interaction teaches a
   concept present in the source. Never create a React component from course material.

Preserve terminology, units, caveats, and attribution. Do not silently correct a source claim;
mark a conflict or uncertainty in an `info` block. Keep Markdown links to `http(s)`, relative
paths, or anchors. Do not write raw HTML.

Done means the lecture is complete, concise, traceable, and represented entirely by JSON.
