export const AUDIO_LIMIT = 20 * 1024 * 1024;
export const COVER_LIMIT = 5 * 1024 * 1024;

interface TypeValidator {
  mime: string[];
  magic: (b: Buffer) => boolean;
}

const AUDIO_TYPES: Record<string, TypeValidator> = {
  mp3: {
    mime: ["audio/mpeg", "audio/mp3", "application/octet-stream"],
    magic: (b) =>
      b.length >= 3 &&
      (b.subarray(0, 3).toString() === "ID3" ||
        (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)),
  },
  wav: {
    mime: [
      "audio/wav",
      "audio/x-wav",
      "audio/wave",
      "application/octet-stream",
    ],
    magic: (b) =>
      b.length >= 12 &&
      b.subarray(0, 4).toString() === "RIFF" &&
      b.subarray(8, 12).toString() === "WAVE",
  },
  flac: {
    mime: ["audio/flac", "audio/x-flac", "application/octet-stream"],
    magic: (b) => b.length >= 4 && b.subarray(0, 4).toString() === "fLaC",
  },
};

const IMAGE_TYPES: Record<string, TypeValidator> = {
  jpg: {
    mime: ["image/jpeg", "application/octet-stream"],
    magic: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  jpeg: {
    mime: ["image/jpeg", "application/octet-stream"],
    magic: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  png: {
    mime: ["image/png", "application/octet-stream"],
    magic: (b) =>
      b.length >= 8 &&
      b
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  webp: {
    mime: ["image/webp", "application/octet-stream"],
    magic: (b) =>
      b.length >= 12 &&
      b.subarray(0, 4).toString() === "RIFF" &&
      b.subarray(8, 12).toString() === "WEBP",
  },
};

export interface UploadedFileLike {
  originalname?: string;
  mimetype: string;
  buffer: Buffer;
  size?: number;
}

export function validateMediaFile(
  file: UploadedFileLike | undefined | null,
  kind: "audio" | "cover"
): string | null {
  if (!file || !Buffer.isBuffer(file.buffer))
    return "A valid uploaded file is required.";

  const maxSize = kind === "audio" ? AUDIO_LIMIT : COVER_LIMIT;
  if ((file.size ?? file.buffer.length) > maxSize) {
    return `${kind === "audio" ? "Audio" : "Cover image"} exceeds the ${
      kind === "audio" ? "20 MiB" : "5 MiB"
    } limit.`;
  }

  const extension = String(file.originalname || "")
    .split(".")
    .pop()
    ?.toLowerCase() || "";
  const type = (kind === "audio" ? AUDIO_TYPES : IMAGE_TYPES)[extension];
  if (!type) {
    return kind === "audio"
      ? "Audio must be MP3, WAV, or FLAC."
      : "Cover image must be JPG, PNG, or WebP.";
  }

  if (!type.mime.includes(file.mimetype) || !type.magic(file.buffer)) {
    return "The uploaded file content does not match its file type.";
  }

  return null;
}

module.exports = { AUDIO_LIMIT, COVER_LIMIT, validateMediaFile };
