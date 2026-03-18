# Canva → Project Asset Selection — Implementation Plan

**Status:** Process/doc plan. No code deliverables; use when selecting assets from Canva exports (export to disk → agent selects best and places in project).

## Overview

Get the best visuals from your Canva uploads into the LBTA project folder by defining a clear export path from Canva, then using image viewing and WHAT-WE-NEED criteria to select and place the right assets. This plan does **not** assume direct API access to Canva (none exists in this workspace); it designs a repeatable workflow you can run whenever you export from Canva.

## Problem Statement

- **Canva:** You have (or will have) photos/videos in Canva. Canva does not expose a “list all my uploads” or “browse brand folder” API to this environment. The Canva Connect API exists but requires a registered app, OAuth, and **design IDs** (it exports designs, not raw uploads). There is **no Canva MCP** in this project, so the agent cannot log in or browse Canva directly.
- **Goal:** You want the agent to “see” your Canva visuals, pick the best ones per slot, and put them into the project (Desktop asset folders → project `public/`).
- **Constraint:** The agent *can* view image files **once they are on disk** (e.g. in the repo or on Desktop) using the Read tool (supports images). So the workflow must: (1) get assets from Canva onto disk, then (2) use viewing + WHAT-WE-NEED to select and place.

## Proposed Solution

Two-phase workflow:

| Phase | Who | What |
|-------|-----|------|
| **A. Export from Canva to disk** | You (or an automated Canva → folder step) | Export chosen images from Canva into a staging area: e.g. `Desktop/LBTA_Website_Assets/from-canva/` or directly into the slot subfolders (e.g. `camps/red-ball/`) with any filename. |
| **B. Select best & place in project** | Agent (or you + agent) | Read WHAT-WE-NEED per slot, view candidate images in that slot’s folder (or a single “from-canva” folder), pick the best per slot, and copy into the project with the correct filename (e.g. `public/images/camps/red-ball.webp`). |

No direct Canva access is required for Phase B. Phase A can be manual (export from Canva UI) or partly automated later (e.g. Canva Connect API if you create an app and have design IDs, or Zapier/n8n if you use a “new upload” trigger).

---

## What the Agent Can Do Today (Without Canva Access)

1. **View images on disk**  
   If you put images in a path the agent can read (e.g. `Desktop/LBTA_Website_Assets/` or inside the repo), the agent can open them (Read tool with image path) and describe content, composition, and fit.

2. **Match to slots using WHAT-WE-NEED**  
   Each slot has a WHAT-WE-NEED.txt (subject, age, activity, size). The agent can compare what it sees in an image to that spec and score fit (e.g. “red-ball: kids 4–8, red ball visible, small court” → good fit).

3. **Select best per slot**  
   If a folder has multiple candidates for one slot (e.g. several red-ball options), the agent can view each, compare to WHAT-WE-NEED, and recommend or choose the best one.

4. **Place into project**  
   Once the best file per slot is chosen, the agent can copy it to the correct path in the project (e.g. `public/images/camps/red-ball.webp`) and optionally rename to the exact filename in WHAT-WE-NEED.

So: **the agent can do “get better visual, select the best ones, and put them into the project folder” as long as the images are first exported from Canva into a location the agent can read** (e.g. Desktop asset folders or repo).

---

## Implementation Steps

### Phase 1: Export path (you + optional automation)

- [ ] **1.1** Create a single “staging” folder for Canva exports (optional but useful):  
  `Desktop/LBTA_Website_Assets/from-canva/`  
  So you can export many images from Canva here without worrying about slot names at first.

- [ ] **1.2** Document the export process for yourself (or team):  
  - In Canva: select the images you want to consider.  
  - Export at the sizes we need (see SPECS-EVERY-SLOT.txt or each WHAT-WE-NEED: 1920×1080 heroes, 800×600 cards, 800×800 squares, etc.).  
  - Save into `from-canva/` or directly into the slot subfolders (e.g. `camps/red-ball/`) with any name (we’ll pick and rename in Phase 2).

- [ ] **1.3** (Optional, later) If you use Canva Connect API: register an app, get design IDs for designs that use your uploads, and add a small script or n8n flow to export those designs to `from-canva/`. This plan does not depend on it.

### Phase 2: Selection and placement (agent-driven)

- [ ] **2.1** Add a short “asset selection” runbook in the repo (e.g. `docs/asset-selection-from-canva.md`) that tells the agent:  
  - Where to find candidates: `Desktop/LBTA_Website_Assets/from-canva/` and/or slot subfolders.  
  - How to run selection: for each slot, read the corresponding WHAT-WE-NEED, list image files in the candidate folder(s), open each image (Read), score fit, choose best, copy to project with the filename from WHAT-WE-NEED.

- [ ] **2.2** Implement one “selection round” manually with the agent:  
  - You export a batch from Canva into `from-canva/` (or into slot folders).  
  - You ask the agent: “Using WHAT-WE-NEED, view the images in [path], pick the best for each slot we have assets for, and copy them into the project with the correct names.”  
  - Agent uses Read (images) + WHAT-WE-NEED to select and then copies files into `public/images/...` or `public/photos/` as per SPECS.

- [ ] **2.3** (Optional) Add a small Node or shell script that:  
  - Takes a path (e.g. `from-canva/`).  
  - Lists image files and groups them by inferred slot (e.g. by filename hint or by folder if you export into slot folders).  
  - Outputs a mapping file (e.g. `suggested-mapping.json`) for the agent to use or for you to confirm.  
  This is a convenience; the agent can do selection without it by reading and comparing.

### Phase 3: Repeatability and criteria

- [ ] **3.1** Capture “selection criteria” in one place (e.g. in `docs/asset-selection-from-canva.md` or in `plans/what-shots-work-best.md`):  
  - Prefer real LBTA players/courts; no stock.  
  - Match age/activity in WHAT-WE-NEED (e.g. red-ball = 4–8, red ball visible).  
  - Prefer good light, clear subject, on-brand (calm, confident).  
  - Prefer correct aspect ratio / size so we don’t crop badly.

- [ ] **3.2** After first successful run, add a short “Compound” note: what worked (e.g. “export from Canva to from-canva, then ask agent to select and place”), so future sessions can repeat the same workflow.

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `Desktop/LBTA_Website_Assets/from-canva/` | Create (folder) | Staging folder for Canva exports. |
| `docs/asset-selection-from-canva.md` | Create | Runbook: where candidates live, how agent selects and places, criteria. |
| `plans/canva-to-project-asset-plan.md` | Create | This plan. |
| Optional: `scripts/suggest-asset-mapping.js` or `.sh` | Create | List images in from-canva, suggest slot mapping; not required for first run. |

No changes to Canva or to project code are required for the selection/placement step; only file system reads and copies.

---

## Success Criteria

- [ ] You have a clear, documented way to get images from Canva onto disk (export into `from-canva/` or into slot folders).
- [ ] Agent can view those images (Read tool), compare to WHAT-WE-NEED, and choose the best per slot.
- [ ] Agent can copy selected images into the project with correct filenames and paths (e.g. `public/images/camps/red-ball.webp`).
- [ ] Process is repeatable: when you add more Canva exports, you can run “select best and place” again.

---

## What We Don’t Have (and Don’t Assume)

- **No Canva API in this workspace**  
  Canva Connect API exists but is for apps with OAuth and design IDs; there is no Canva MCP or preconfigured Canva integration here, so the agent cannot list or browse your Canva uploads directly.

- **No “precise pixel” inspection**  
  The agent can view images and describe content and composition; it does not run image analysis (e.g. resolution, sharpness) unless we add a script that uses something like `sharp` or ImageMagick. That can be a later improvement.

---

## Next Step (Concrete)

1. Create `Desktop/LBTA_Website_Assets/from-canva/` (optional).
2. Add `docs/asset-selection-from-canva.md` with the runbook (where to export, how to ask the agent to select and place).
3. You export a first batch from Canva into `from-canva/` (or into slot folders).
4. You ask: “View the images in Desktop/LBTA_Website_Assets/from-canva (or camps/red-ball, etc.), pick the best for each slot using WHAT-WE-NEED, and copy them into the project with the correct names.”

Then the agent will use this plan and the runbook to do the selection and placement without needing access to Canva itself.
