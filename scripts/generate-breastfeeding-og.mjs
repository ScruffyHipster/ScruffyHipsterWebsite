import { readFile, writeFile } from "node:fs/promises";
import { deflateSync, inflateSync } from "node:zlib";
import { join } from "node:path";

const font = makeFont();
const rootDir = new URL("../", import.meta.url).pathname;
const assetsDir = join(rootDir, "public", "assets");
const screenshot = decodePng(
  await readFile(join(assetsDir, "breastfeedingScreenShots", "1.png"))
);
const width = 1200;
const height = 630;
const pixels = new Uint8Array(width * height * 4);

paintBackground();
drawCircle(1030, 190, 315, [255, 255, 255, 68]);
drawCircle(122, 92, 54, [23, 25, 28, 255]);
drawCircle(122, 92, 34, [255, 70, 80, 255]);
drawRoundedRect(812, -55, 350, 725, 50, [23, 25, 28, 255]);
drawScaledImage(screenshot, 830, -35, 314, 680, 34);
drawRoundedRect(776, 474, 330, 84, 42, [255, 70, 80, 255]);

drawText("A NEWBORN", 74, 238, 9, [23, 25, 28, 255]);
drawText("FEED TIMER.", 74, 329, 9, [23, 25, 28, 255]);
drawText("IPHONE + APPLE WATCH", 78, 492, 4, [50, 73, 82, 255]);
drawText("BUILT FOR THE FIRST WEEKS.", 78, 536, 4, [50, 73, 82, 255]);
drawText("ONE TAP TO START", 798, 505, 3, [23, 25, 28, 255]);

const outputPath = join(assetsDir, "breastfeeding-tracker-og.png");
await writeFile(outputPath, encodePng(width, height, pixels));
console.log(`Generated ${outputPath}`);

function paintBackground() {
  for (let y = 0; y < height; y += 1) {
    const t = y / (height - 1);
    const red = Math.round(184 + (229 - 184) * t);
    const green = Math.round(222 + (246 - 222) * t);
    const blue = Math.round(237 + (250 - 237) * t);
    for (let x = 0; x < width; x += 1) {
      setPixel(x, y, [red, green, blue, 255]);
    }
  }
}

function drawScaledImage(image, targetX, targetY, targetWidth, targetHeight, radius) {
  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      if (!insideRoundedRect(x, y, targetWidth, targetHeight, radius)) continue;
      const sourceX = Math.min(image.width - 1, Math.floor((x / targetWidth) * image.width));
      const sourceY = Math.min(image.height - 1, Math.floor((y / targetHeight) * image.height));
      const sourceOffset = (sourceY * image.width + sourceX) * 4;
      setPixel(targetX + x, targetY + y, [
        image.pixels[sourceOffset],
        image.pixels[sourceOffset + 1],
        image.pixels[sourceOffset + 2],
        image.pixels[sourceOffset + 3]
      ]);
    }
  }
}

function drawRoundedRect(x, y, rectWidth, rectHeight, radius, color) {
  for (let row = 0; row < rectHeight; row += 1) {
    for (let column = 0; column < rectWidth; column += 1) {
      if (insideRoundedRect(column, row, rectWidth, rectHeight, radius)) {
        setPixel(x + column, y + row, color);
      }
    }
  }
}

function insideRoundedRect(x, y, rectWidth, rectHeight, radius) {
  const nearestX = Math.max(radius, Math.min(rectWidth - radius - 1, x));
  const nearestY = Math.max(radius, Math.min(rectHeight - radius - 1, y));
  const deltaX = x - nearestX;
  const deltaY = y - nearestY;
  return deltaX * deltaX + deltaY * deltaY <= radius * radius;
}

function drawCircle(centerX, centerY, radius, color) {
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      if (x * x + y * y <= radius * radius) {
        setPixel(centerX + x, centerY + y, color);
      }
    }
  }
}

function drawText(value, x, y, scale, color) {
  let cursor = x;
  for (const character of value) {
    const glyph = font[character] || font[" "];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let column = 0; column < glyph[row].length; column += 1) {
        if (glyph[row][column] !== "1") continue;
        for (let offsetY = 0; offsetY < scale; offsetY += 1) {
          for (let offsetX = 0; offsetX < scale; offsetX += 1) {
            setPixel(cursor + column * scale + offsetX, y + row * scale + offsetY, color);
          }
        }
      }
    }
    cursor += 6 * scale;
  }
}

function setPixel(x, y, color) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const offset = (y * width + x) * 4;
  const alpha = color[3] / 255;
  pixels[offset] = Math.round(color[0] * alpha + pixels[offset] * (1 - alpha));
  pixels[offset + 1] = Math.round(color[1] * alpha + pixels[offset + 1] * (1 - alpha));
  pixels[offset + 2] = Math.round(color[2] * alpha + pixels[offset + 2] * (1 - alpha));
  pixels[offset + 3] = 255;
}

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8);
  if (!signature.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error("Source is not a PNG.");
  }

  let offset = 8;
  let imageWidth;
  let imageHeight;
  let bitDepth;
  let colorType;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      imageWidth = data.readUInt32BE(0);
      imageHeight = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += length + 12;
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG format: bit depth ${bitDepth}, color type ${colorType}.`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const rowLength = imageWidth * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const decoded = new Uint8Array(imageWidth * imageHeight * 4);
  let rawOffset = 0;
  let previous = new Uint8Array(rowLength);

  for (let y = 0; y < imageHeight; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    const scanline = raw.subarray(rawOffset, rawOffset + rowLength);
    rawOffset += rowLength;
    const current = new Uint8Array(rowLength);

    for (let x = 0; x < rowLength; x += 1) {
      const left = x >= channels ? current[x - channels] : 0;
      const up = previous[x] || 0;
      const upLeft = x >= channels ? previous[x - channels] : 0;
      const value = scanline[x];
      current[x] =
        filter === 0
          ? value
          : filter === 1
            ? (value + left) & 255
            : filter === 2
              ? (value + up) & 255
              : filter === 3
                ? (value + Math.floor((left + up) / 2)) & 255
                : filter === 4
                  ? (value + paeth(left, up, upLeft)) & 255
                  : invalidFilter(filter);
    }

    for (let x = 0; x < imageWidth; x += 1) {
      const sourceOffset = x * channels;
      const targetOffset = (y * imageWidth + x) * 4;
      decoded[targetOffset] = current[sourceOffset];
      decoded[targetOffset + 1] = current[sourceOffset + 1];
      decoded[targetOffset + 2] = current[sourceOffset + 2];
      decoded[targetOffset + 3] = channels === 4 ? current[sourceOffset + 3] : 255;
    }
    previous = current;
  }

  return { width: imageWidth, height: imageHeight, pixels: decoded };
}

function invalidFilter(filter) {
  throw new Error(`Unsupported PNG filter ${filter}.`);
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const distanceLeft = Math.abs(estimate - left);
  const distanceUp = Math.abs(estimate - up);
  const distanceUpLeft = Math.abs(estimate - upLeft);
  if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) return left;
  if (distanceUp <= distanceUpLeft) return up;
  return upLeft;
}

function encodePng(imageWidth, imageHeight, rgba) {
  const rowLength = imageWidth * 4;
  const raw = Buffer.alloc((rowLength + 1) * imageHeight);
  for (let y = 0; y < imageHeight; y += 1) {
    const rowOffset = y * (rowLength + 1);
    raw[rowOffset] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * rowLength, rowLength).copy(raw, rowOffset + 1);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(imageWidth, 0);
  ihdr.writeUInt32BE(imageHeight, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeFont() {
  return {
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "00110", "00110"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"]
  };
}
