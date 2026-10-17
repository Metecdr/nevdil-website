import sharp from "sharp";
import { addPhoto } from "../../lib/gallery-store";

async function main() {
  const color = process.argv[2];
  const image = await sharp({ create: { width: 100, height: 100, channels: 3, background: color } }).png().toBuffer();
  await addPhoto(image, `Parallel ${color}`, "image/png");
}
main().catch(() => { process.exitCode = 1; });
