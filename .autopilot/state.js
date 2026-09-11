window.STATE =
{
  "slug": "bambuk-finland-foundation-homepage",
  "dir": "2026-09-11-bambuk-finland-foundation-homepage--wip",
  "title": "Bambuk Finland — perusta, globaali UI ja etusivu",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T1",
  "briefFile": "2026-09-11-brief.md",
  "memoryFile": "AGENTS.md",
  "skillDir": "/Users/roman/.agents/skills/autopilot",
  "startedAt": "2026-09-11T02:03:54+03:00",
  "updatedAt": "2026-09-11T06:57:49+03:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-11T02:03:54+03:00", "finishedAt": "2026-09-11T02:06:40+03:00" },
    { "id": "manifest", "status": "done", "startedAt": "2026-09-11T02:06:40+03:00", "finishedAt": "2026-09-11T02:08:27+03:00" },
    { "id": "briefing", "status": "skipped", "startedAt": "2026-09-11T02:08:27+03:00", "finishedAt": "2026-09-11T02:09:23+03:00", "note": "вопросов не потребовалось — неизвестные бизнес-данные явно направлены в placeholders" },
    { "id": "spec", "status": "done", "startedAt": "2026-09-11T02:09:23+03:00", "finishedAt": "2026-09-11T02:16:36+03:00" },
    { "id": "plan", "status": "done", "startedAt": "2026-09-11T02:16:36+03:00", "finishedAt": "2026-09-11T02:19:08+03:00", "note": "3 таска, ярус T1" },
    { "id": "build", "status": "active", "startedAt": "2026-09-11T02:19:08+03:00", "note": "0 из 3 тасков готовы" },
    { "id": "review", "status": "active", "startedAt": "2026-09-11T06:46:30+03:00", "note": "проверяется таск 01" },
    { "id": "final", "status": "pending" }
  ],
  "requirements": {
    "total": 47,
    "done": 0,
    "inTicket": 35,
    "inSpec": 0,
    "placeholder": 4,
    "deferred": 8,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Runnable foundation and missing-input register",
      "requirements": ["R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09", "R10", "R21", "R22", "R23", "R24", "R25", "R28", "R34", "R35", "R36", "R43", "R44", "R45", "R46", "R47"],
      "blockedBy": [],
      "wave": 1,
      "zone": ["project configuration", "app/", "data/", "lib/", "styles/", "docs/implementation-inputs.md"],
      "status": "review",
      "startedAt": "2026-09-11T02:19:57+03:00",
      "retries": 1,
      "repairs": 1,
      "repairFindings": [
        "Remove or neutralize unsourced Finnish offering/coverage promise in app/fi/page.tsx",
        "Add nullable manufacturer legal name to the typed config boundary",
        "Make contact hours participate in release readiness as documented",
        "Render the required featured-product pending state with quote action on /fi"
      ],
      "handoffs": 0
    },
    {
      "id": "02",
      "title": "Reusable global UI and accessible navigation",
      "requirements": ["R10", "R11", "R12", "R13", "R17", "R18", "R37", "R38", "R40", "R43", "R46", "R47"],
      "blockedBy": ["01"],
      "wave": 2,
      "zone": ["components/", "shared layout composition", "global component tests"],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    },
    {
      "id": "03",
      "title": "Concise Finnish homepage and visual QA",
      "requirements": ["R02", "R05", "R06", "R11", "R13", "R14", "R15", "R16", "R17", "R18", "R23", "R24", "R25", "R27", "R28", "R31", "R35", "R36", "R37", "R38", "R39", "R40", "R41", "R42", "R43", "R46", "R47"],
      "blockedBy": ["02"],
      "wave": 3,
      "zone": ["/fi homepage", "homepage content", "local homepage imagery", "homepage QA"],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "coverage": {
    "findings": 1,
    "resolved": ["Added Breadcrumbs boundary and acceptance; strengthened exact Finnish wording, independent commercial state, content QA, and per-stage checks"],
    "recheck": "PASS"
  },
  "concerns": [
    "lib/seo.ts: keep URL joining behind the createPageMetadata interface",
    "tests/seo.test.ts: assert all contracted metadata fields with structurally valid SiteConfig fixtures",
    "tests/site-config.test.ts: prove a fully supplied production configuration becomes ready",
    "tests/content-registries.test.ts: exercise getPublishedProducts and observable route behavior",
    "styles/globals.css: consume the single font token instead of duplicating fallback stack"
  ],
  "reviewers": { "manifestSpec": "/root/review_manifest_spec", "craft": "/root/review_craft" },
  "blind": null
}
