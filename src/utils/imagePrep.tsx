const RGBAtoRGBCache: { [key: string]: [number, number, number]} = {};
const MacCache: { [key: string]: number } = {};

export default async function prepImage(
  url: string,
  size: number,
): Promise<number[][]> {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await new Promise<ArrayBuffer>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(blob);
  });
  const imageBitmap = await createImageBitmap(new Blob([arrayBuffer]));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  context!.drawImage(imageBitmap, 0, 0, size, size);
  const blurAmount = 2;
  context!.filter = `blur(${blurAmount}px)`;
  context!.drawImage(canvas, 0, 0, size, size);
  const imageData = context!.getImageData(0, 0, size, size);
  const macbethData = imageToMacbeth(imageData, size);
  return macbethData;
}

function imageToMacbeth(imageData: ImageData, size: number): number[][] {
  const macbethColors = [
    [115, 82, 68],
    [194, 150, 130],
    [98, 122, 157],
    [87, 108, 67],
    [133, 128, 177],
    [103, 189, 170],
    [214, 126, 44],
    [80, 91, 166],
    [193, 90, 99],
    [94, 60, 108],
    [157, 188, 64],
    [224, 163, 46],
    [56, 61, 150],
    [70, 148, 73],
    [175, 54, 60],
    [231, 199, 31],
    [187, 86, 149],
    [8, 133, 161],
    [243, 243, 242],
    [200, 200, 200],
    [160, 160, 160],
    [122, 122, 121],
    [85, 85, 85],
    [52, 52, 52],
  ];
  const { width, data } = imageData;
  const macbethData: number[][] = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const pixelIndex = (x + y * width) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const rgb: [number, number, number]= [r, g, b];
      const key = `${rgb[0]}-${rgb[1]}-${rgb[2]}`;
      if (MacCache[key]) {
        row.push(MacCache[key]);
        continue;
      }
      const maxAlpha = 255;
      const alpha = data[pixelIndex + 3] / maxAlpha;
      const convertedRGB = convertRGBAToRGB(rgb, alpha);

      let minDistance = Number.MAX_VALUE;
      let bestMatch = 0;
      for (let j = 0; j < macbethColors.length; j++) {
        const [mr, mg, mb] = macbethColors[j];
        const distance = Math.sqrt(
          (convertedRGB[0] - mr) ** 2 +
            (convertedRGB[1] - mg) ** 2 +
            (convertedRGB[2] - mb) ** 2,
        );
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = j;
        }
      }
      row.push(bestMatch);
      MacCache[key] = bestMatch;
    }
    macbethData.push(row);
  }
  return macbethData;
}

function convertRGBAToRGB(rgb: number[], alpha: number): [number, number, number]{
  const key = `${rgb[0]}-${rgb[1]}-${rgb[2]}-${alpha}`;
  if (key in RGBAtoRGBCache) {
    return RGBAtoRGBCache[key];
  }
  const [r, g, b] = rgb;
  const final: [number, number, number]= [
    Math.round(r * alpha),
    Math.round(g * alpha),
    Math.round(b * alpha),
  ];
  RGBAtoRGBCache[key] = final;
  return final;
}