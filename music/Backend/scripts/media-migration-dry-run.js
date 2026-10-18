require("../src/config/config");
const mongoose = require("mongoose");
const musicModel = require("../src/models/music.model");

async function main() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("Set MONGO_URI before running the media migration dry run.");
    await mongoose.connect(mongoUri);
    try {
        const tracks = await musicModel.find({}, "title musicKey coverImageKey").lean();
        const assets = [];
        for (const track of tracks) {
            for (const [kind, key] of [["audio", track.musicKey], ["cover", track.coverImageKey]]) {
                if (!key || key.startsWith("imagekit:")) continue;
                assets.push({
                    trackId: String(track._id),
                    title: track.title,
                    kind,
                    sourceS3Key: key,
                    destinationFolder: kind === "audio" ? "/tunease/audio" : "/tunease/covers",
                    status: "pending-migration",
                });
            }
        }
        const keyCounts = new Map();
        for (const asset of assets) keyCounts.set(asset.sourceS3Key, (keyCounts.get(asset.sourceS3Key) || 0) + 1);
        const report = {
            generatedAt: new Date().toISOString(),
            mode: "dry-run; no media or database values were changed",
            tracksScanned: tracks.length,
            assetsToReview: assets.length,
            uniqueS3Objects: keyCounts.size,
            duplicateReferences: assets.filter((asset) => keyCounts.get(asset.sourceS3Key) > 1).length,
            assets,
            notes: [
                "This report does not contact S3 or ImageKit and does not confirm that source objects exist.",
                "ImageKit file IDs and delivery paths are assigned only after an approved migration run.",
                "Do not switch database reads or delete S3 objects until migrated assets are verified.",
            ],
        };
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } finally {
        await mongoose.disconnect();
    }
}

main().catch((error) => {
    console.error(`Media migration dry run failed: ${error.message}`);
    process.exitCode = 1;
});
