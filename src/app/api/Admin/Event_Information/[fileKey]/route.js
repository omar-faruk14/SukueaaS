import { NextResponse } from "next/server";

const fetchImageChunks = async (fileKey, startByte, endByte) => {
  const kintoneImageURL = `https://emi-lab-osaka.cybozu.com/k/v1/file.json?fileKey=${fileKey}`;
  const headers = {
    "X-Cybozu-API-Token": "JO3jb3FJbac3Isi73n43HyTTkMvFGHedTx9PbDty",
    Range: `bytes=${startByte}-${endByte}`,
  };

  const response = await fetch(kintoneImageURL, { headers });
  const imageChunk = await response.arrayBuffer();

  return imageChunk;
};

export async function GET(request, { params }) {
  const fileKey = params.fileKey;
  const chunkSize = 1024 * 1024; // 1MB chunk size
  let startByte = 0;
  let endByte = chunkSize - 1;
  let imageChunks = [];

  try {
    while (true) {
      const chunk = await fetchImageChunks(fileKey, startByte, endByte);
      imageChunks.push(chunk);

      if (chunk.byteLength < chunkSize) {
        break;
      }

      startByte += chunkSize;
      endByte += chunkSize;
    }

    // Concatenate all image chunks into a single Uint8Array
    const imageArray = new Uint8Array(
      imageChunks.reduce((acc, chunk) => [...acc, ...new Uint8Array(chunk)], [])
    );

    return new NextResponse(imageArray, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch image",
        specificError: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
