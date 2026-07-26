import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourcePath = path.join(root, "public/yearbook/cosmos-black-book.webp");
const crestPath = path.join(root, "public/su-crest-2026-transparent.png");
const outputPath = path.join(root, "public/yearbook/su-yearbook-cover-burgundy.webp");

const size = 1600;
const crest = await fs.readFile(crestPath);
const crestData = crest.toString("base64");

const front = {
  left: 402,
  top: 354,
  width: 844,
  height: 892
};

const spine = {
  left: 350,
  top: 354,
  width: 52,
  height: 892
};

const artwork = Buffer.from(`
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="crest-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feColorMatrix type="matrix" values="
          0 0 0 0 .025
          0 0 0 0 0
          0 0 0 0 .01
          0 0 0 .27 0"/>
        <feOffset dx="4" dy="5"/>
      </filter>
      <filter id="crest-highlight" x="-20%" y="-20%" width="140%" height="140%">
        <feColorMatrix type="matrix" values="
          0 0 0 0 .52
          0 0 0 0 .13
          0 0 0 0 .22
          0 0 0 .055 0"/>
        <feOffset dx="-2" dy="-2"/>
      </filter>
      <filter id="crest-face" x="-20%" y="-20%" width="140%" height="140%">
        <feColorMatrix type="matrix" values="
          0 0 0 0 .12
          0 0 0 0 .008
          0 0 0 0 .035
          0 0 0 .14 0"/>
      </filter>
    </defs>

    <rect x="432" y="382" width="782" height="834" rx="2" fill="none" stroke="#d1ab55" stroke-width="2" opacity=".5"/>
    <line x1="772" y1="519" x2="874" y2="519" stroke="#d1ab55" stroke-width="2" opacity=".68"/>

    <text x="823" y="495" fill="#dfc47d" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="5" text-anchor="middle">
      STREAMER UNIVERSITY
    </text>

    <image href="data:image/png;base64,${crestData}" x="637" y="602" width="372" height="372" filter="url(#crest-shadow)"/>
    <image href="data:image/png;base64,${crestData}" x="637" y="602" width="372" height="372" filter="url(#crest-highlight)"/>
    <image href="data:image/png;base64,${crestData}" x="637" y="602" width="372" height="372" filter="url(#crest-face)"/>

    <text x="823" y="1094" fill="#dfc47d" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" letter-spacing="4" text-anchor="middle">
      CLASS OF 2026
    </text>
    <text x="823" y="1138" fill="#cba856" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="5" text-anchor="middle">
      YEARBOOK · VOL. I
    </text>
  </svg>
`);

const base = await sharp(sourcePath)
  .resize(size, size, {
    fit: "fill",
    kernel: sharp.kernel.lanczos3
  })
  .sharpen({ sigma: 0.8 })
  .toBuffer();

async function colorizeRegion(region, scale, bias) {
  const gray = await sharp(base)
    .extract(region)
    .grayscale()
    .raw()
    .toBuffer();

  return sharp(gray, {
    raw: {
      width: region.width,
      height: region.height,
      channels: 1
    }
  })
    .joinChannel(gray, {
      raw: {
        width: region.width,
        height: region.height,
        channels: 1
      }
    })
    .joinChannel(gray, {
      raw: {
        width: region.width,
        height: region.height,
        channels: 1
      }
    })
    .linear(scale, bias)
    .png()
    .toBuffer();
}

const frontCover = await colorizeRegion(front, [1.48, 0.17, 0.5], [4, 0, 1]);
const spineCover = await colorizeRegion(spine, [1.08, 0.1, 0.32], [2, 0, 0]);

await sharp(base)
  .composite([
    {
      input: frontCover,
      left: front.left,
      top: front.top,
      blend: "over"
    },
    {
      input: spineCover,
      left: spine.left,
      top: spine.top,
      blend: "over"
    },
    {
      input: artwork,
      blend: "over"
    }
  ])
  .webp({ quality: 94, effort: 6 })
  .toFile(outputPath);

console.log(`Wrote ${path.relative(root, outputPath)}`);
