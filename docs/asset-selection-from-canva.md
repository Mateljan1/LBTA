# Asset selection from Canva exports

Use this when you have exported images from Canva and want the agent to pick the best per slot and copy them into the project.

## 1. Export from Canva to disk

- Export your chosen images from Canva at the sizes in **SPECS-EVERY-SLOT.txt** (or per **WHAT-WE-NEED.txt** in each slot folder).
- Save them into one of:
  - **Staging (simplest):** `Desktop/LBTA_Website_Assets/from-canva/`  
    You can use any filenames; the agent will match by viewing and WHAT-WE-NEED.
  - **Slot folders:** e.g. `Desktop/LBTA_Website_Assets/camps/red-ball/`, `hero/book-hero/`, etc.  
    Put one or more candidates in the folder for that slot; the agent will pick the best and use the filename from WHAT-WE-NEED.

## 2. Ask the agent to select and place

Use a prompt like:

- “View the images in `Desktop/LBTA_Website_Assets/from-canva/`, match them to our slots using the WHAT-WE-NEED files, pick the best image for each slot we have, and copy them into the project with the correct filenames (see SPECS-EVERY-SLOT or WHAT-WE-NEED).”
- Or, if you used slot folders: “In each subfolder of `Desktop/LBTA_Website_Assets/camps/` (and hero, conversion, etc.) that has images, pick the best image and copy it into the project with the filename from that folder’s WHAT-WE-NEED.txt.”

The agent will:

1. List image files in the path you give.
2. For each slot, read the corresponding WHAT-WE-NEED (subject, age, activity, size).
3. Open each candidate image (Read tool), compare to the spec, and choose the best fit.
4. Copy the chosen file to the correct project path (e.g. `public/images/camps/red-ball.webp`) with the exact filename from WHAT-WE-NEED.

## 3. Selection criteria (what “best” means)

- **Subject match:** Who and what are in the frame (e.g. red ball = kids 4–8, red ball visible; book-hero = inviting courts, golden hour).
- **Real LBTA:** Prefer real players, coaches, and courts; no stock.
- **Composition and light:** Clear subject, good light, on-brand (calm, confident).
- **Size/aspect:** Prefer images already exported at or near the size in WHAT-WE-NEED to avoid bad cropping.

## 4. Project paths (reference)

| Slot type      | Example filename      | Project path                    |
|----------------|------------------------|----------------------------------|
| Hero           | book-hero.webp        | public/images/hero/             |
| Program card   | red-ball.webp         | public/images/camps/            |
| Conversion     | adult-trial-why-image | public/images/ or hero/         |
| Philosophy     | movement.webp         | public/images/philosophy/       |
| Gallery        | court-setting.webp    | public/photos/                  |

Exact paths and filenames are in **SPECS-EVERY-SLOT.txt** and each **WHAT-WE-NEED.txt**.

## 5. Repeatability

Each time you export a new batch from Canva into `from-canva/` or into slot folders, run the same “select and place” request. The agent will only overwrite or add files for slots you have candidates for.
