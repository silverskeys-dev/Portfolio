import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const modelsDir = path.join(workspaceRoot, "public", "models", "Portfolio");
const dataFile = path.join(workspaceRoot, "src", "lib", "data.ts");

/**
 * Generates MODEL_GALLERY_ITEMS in src/lib/data.ts based on files found in public/models/Portfolio.
 */
function main() {
  if (!fs.existsSync(modelsDir)) {
    throw new Error(`Folder not found: ${modelsDir}`);
  }

  const files = fs
    .readdirSync(modelsDir)
    .filter((name) => /\.(png|jpe?g|webp|avif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  const items = files.map((fileName) => {
    const baseTitle = fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const title = baseTitle || fileName;

    // Keep this a raw path; Next/URL encoding is handled at request time.
    const imageSrc = `/models/Portfolio/${fileName}`;

    return {
      imageSrc,
      imageAlt: `${title} 3D model render`,
      title,
      kind: "3D Model",
      description: "3D model render.",
      tags: ["3D", "Render"],
    };
  });

  const fileText = fs.readFileSync(dataFile, "utf8");

  const startMarker = "export const MODEL_GALLERY_ITEMS: PortfolioItem[] = [";
  const startIndex = fileText.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error("Could not find MODEL_GALLERY_ITEMS in src/lib/data.ts");
  }

  const afterStart = startIndex + startMarker.length;
  const endIndex = fileText.indexOf("];", afterStart);
  if (endIndex === -1) {
    throw new Error("Could not find end of MODEL_GALLERY_ITEMS (missing ];)");
  }

  const newBlock =
    startMarker +
    "\n" +
    items
      .map(
        (item) =>
          `  {\n` +
          `    imageSrc: ${JSON.stringify(item.imageSrc)},\n` +
          `    imageAlt: ${JSON.stringify(item.imageAlt)},\n` +
          `    title: ${JSON.stringify(item.title)},\n` +
          `    kind: "3D Model",\n` +
          `    description: "3D model render.",\n` +
          `    tags: ["3D", "Render"],\n` +
          `  },`,
      )
      .join("\n") +
    "\n];";

  const updated = fileText.slice(0, startIndex) + newBlock + fileText.slice(endIndex + 2);
  fs.writeFileSync(dataFile, updated, "utf8");

  console.log(`Synced ${items.length} images into MODEL_GALLERY_ITEMS.`);
}

main();
