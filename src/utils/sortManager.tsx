import getCCV, { ccvDistance } from "./getCCV";
import getPlaylist from "./getPlaylist";
import sendPlaylist from "./sendPlaylist";

const imageSize = 32;

export default async function sortManager(
  token: string,
  playlistId: string,
): Promise<boolean> {
  const tracks = await getPlaylist(token, playlistId);
  const tracksWithCCV = await Promise.all(
    tracks.map(async (track: { id: string; imageUrl: string }) => {
      const ccv = await getCCV(track, imageSize);
      return { label: track.id, ccv: ccv };
    }),
  );
  const sortedLoop = ccvSort(tracksWithCCV);
  sendPlaylist(token, playlistId, sortedLoop);
  return true;
}

function ccvSort(tracks: any): string[] {
  const sortedCollection = sortCCVsByDistance(tracks);
  return sortedCollection;
}

function sortCCVsByDistance(ccvCollection: any): string[] {
  const numCCVs = ccvCollection.length;
  const distanceMatrix: number[][] = [];
  for (let i = 0; i < numCCVs; i++) {
    const distances: number[] = [];
    for (let j = 0; j < numCCVs; j++) {
      if (i === j) {
        distances.push(0);
      } else {
        const distance = ccvDistance(
          ccvCollection[i].ccv,
          ccvCollection[j].ccv,
        );
        distances.push(distance);
      }
    }
    distanceMatrix.push(distances);
  }

  const tspResult = solveTSP(distanceMatrix);

  const sortedCCVs = tspResult.map((index) => ccvCollection[index].label);

  return sortedCCVs;
}

function solveTSP(distanceMatrix: number[][]): number[] {
  const numVertices = distanceMatrix.length;
  const initialSolution = [0];
  for (let i = 1; i < numVertices; i++) {
    initialSolution.push(i);
  }
  let bestSolution = initialSolution.slice();
  let bestDistance = getTotalDistance(bestSolution, distanceMatrix);
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < numVertices - 1; i++) {
      for (let j = i + 1; j < numVertices; j++) {
        const newSolution = opt2Swap(bestSolution, i, j);
        const newDistance = getTotalDistance(newSolution, distanceMatrix);
        if (newDistance < bestDistance) {
          bestSolution = newSolution;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }
  return bestSolution;
}

function opt2Swap(solution: number[], i: number, j: number): number[] {
  const newSolution = solution.slice();
  let k = i + 1;
  let l = j;
  while (k < l) {
    const temp = newSolution[k];
    newSolution[k] = newSolution[l];
    newSolution[l] = temp;
    k++;
    l--;
  }
  return newSolution;
}

function getTotalDistance(
  solution: number[],
  distanceMatrix: number[][],
): number {
  let distance = 0;
  const numVertices = solution.length;
  for (let i = 0; i < numVertices - 1; i++) {
    const from = solution[i];
    const to = solution[i + 1];
    distance += distanceMatrix[from][to];
  }
  distance += distanceMatrix[solution[numVertices - 1]][solution[0]];

  return distance;
}
