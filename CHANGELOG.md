# ToolNest — Changelog

Tracks changes to ToolNest's public registry, schemas, and developer-facing surface.
Follows [Semantic Versioning](https://semver.org/). For `toolnest-core` library changes specifically, see its own [CHANGELOG.md](https://github.com/saiftiwana/toolnest-core/blob/main/CHANGELOG.md).

## [1.0.0] - 2026-08-28 — Phase 9: Developer Ecosystem

### Added
- **Batch 1 — AI Discovery:** `/tools.json` (full 99-tool registry: inputs, outputs, privacy model, related tools), `/categories.json` (12 categories), `llms.txt` updated to link both.
- **Batch 2 — Open-Source Core:** [`toolnest-core`](https://github.com/saiftiwana/toolnest-core) — standalone MIT-licensed npm package with 18 deterministic utility functions (finance, percentage, area/unit conversion, color, date, text, stats, grades), 44 unit tests, runnable examples.
- **Batch 3 — AI Tool-Calling & Recipes:** `/tool-calling.json` (structured function-calling schemas for all 18 `toolnest-core` functions — not a hosted API, executed via the npm/CDN package), `/recipes.json` (3 documented multi-tool workflows: Student Academic, Property Investment, Freelancer Finance).
- **Batch 4 — Developer Docs & Playground:** `/developers.html` — installation guide (npm + CDN), live interactive playground (calls the real `toolnest-core` functions via CDN), full schema/registry reference, error format, versioning policy, privacy/rate-limit statement, attribution guidance. This changelog.

### Notes
- No backend was added at any point in Phase 9 — every file above is static, and every "tool call" executes deterministic code client-side or in the developer's own environment.
- No paid services, AI hosting, or usage limits were introduced, per the Phase 9 free-only requirement.
