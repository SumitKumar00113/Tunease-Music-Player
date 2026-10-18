const config = require("../config/config");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");
const { Blob } = require("buffer");

const IMAGEKIT_PREFIX = "imagekit:";
let s3Client;

function imageKitConfig() {
    const { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = config;
    const missing = [];
    if (!IMAGEKIT_PRIVATE_KEY) missing.push("IMAGEKIT_PRIVATE_KEY");
    if (!IMAGEKIT_URL_ENDPOINT) missing.push("IMAGEKIT_URL_ENDPOINT");
    if (missing.length) {
        throw new Error(`ImageKit is not configured. Set ${missing.join(" and ")} in the music backend environment.`);
    }
    return { privateKey: IMAGEKIT_PRIVATE_KEY, urlEndpoint: IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "") };
}

function parseStoredAsset(value) {
    if (typeof value !== "string" || !value.startsWith(IMAGEKIT_PREFIX)) return null;
    try {
        return JSON.parse(value.slice(IMAGEKIT_PREFIX.length));
    } catch {
        return null;
    }
}

function serializeAsset(file) {
    return `${IMAGEKIT_PREFIX}${JSON.stringify({ fileId: file.fileId, filePath: file.filePath })}`;
}

async function uploadFile(file, mediaType) {
    const { privateKey } = imageKitConfig();
    const extension = file.originalname.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
    const fileName = `${require("crypto").randomUUID()}.${extension}`;
    const form = new FormData();
    form.set("file", new Blob([file.buffer], { type: file.mimetype }), fileName);
    form.set("fileName", fileName);
    form.set("folder", `/tunease/${mediaType}`);
    form.set("useUniqueFileName", "true");
    form.set("isPrivateFile", "true");
    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
        body: form,
    });
    if (!response.ok) throw new Error(`ImageKit upload failed with status ${response.status}.`);
    const uploaded = await response.json();
    if (!uploaded.fileId || !uploaded.filePath) throw new Error("ImageKit upload response did not include the file identifier and path.");
    return serializeAsset(uploaded);
}

async function getPreSignerUrl(storedAsset) {
    const parsed = parseStoredAsset(storedAsset);
    if (!parsed) {
        // Keep existing S3 records playable while records are migrated in a controlled process.
        if (!config.AWS_REGION || !config.AWS_ACCESS_KEY_ID || !config.AWS_SECRET_ACCESS_KEY) {
            throw new Error("Legacy S3 media needs AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY until migration is complete.");
        }
        s3Client ||= new S3Client({
            region: config.AWS_REGION,
            credentials: { accessKeyId: config.AWS_ACCESS_KEY_ID, secretAccessKey: config.AWS_SECRET_ACCESS_KEY },
        });
        return getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: "amzn-s3-tunease-bucket",
            Key: storedAsset,
        }), { expiresIn: 3600 });
    }
    if (!parsed.filePath) throw new Error("Stored ImageKit media path is missing.");
    const { privateKey, urlEndpoint } = imageKitConfig();
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const unsignedPath = parsed.filePath.replace(/^\//, "") + expiry;
    const signature = crypto.createHmac("sha1", privateKey).update(unsignedPath).digest("hex").toLowerCase();
    return `${urlEndpoint}/${parsed.filePath.replace(/^\//, "")}?ik-t=${expiry}&ik-s=${signature}`;
}

async function deleteFile(storedAsset) {
    const parsed = parseStoredAsset(storedAsset);
    if (!parsed) return false;
    if (!parsed.fileId) throw new Error("Stored ImageKit file ID is missing.");
    const { privateKey } = imageKitConfig();
    const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(parsed.fileId)}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
    });
    if (!response.ok) throw new Error(`ImageKit deletion failed with status ${response.status}.`);
    return true;
}

module.exports = { uploadFile, getPreSignerUrl, deleteFile, parseStoredAsset };
