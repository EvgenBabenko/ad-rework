import sharp from "sharp";
import fs from "fs";
import path from "path";

// Resolve from project root
const INPUT = path.resolve("src/assets/img");
const OUTPUT = path.resolve("src/assets/img-webp");

// Supported image extensions
const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".tiff", ".gif", ".bmp"];

if (fs.existsSync(OUTPUT)) {
  fs.rmSync(OUTPUT, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT);

fs.readdirSync(INPUT).forEach((file) => {
  const inputPath = path.join(INPUT, file);
  const ext = path.extname(file).toLowerCase();

  // Skip if it's not a supported file type or not a file
  if (!fs.statSync(inputPath).isFile() || !SUPPORTED_EXTENSIONS.includes(ext)) {
    return;
  }

  const outputPath = path.join(OUTPUT, file.replace(ext, ".webp"));

  sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() =>
      console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`)
    )
    .catch((err) => console.error(`❌ Error converting ${file}:`, err));
});
