const config = require("../config/config");

const searchSpotifyTracks = async (req, res) => {
    const accessToken = config.SPOTIFY_ACCESS_TOKEN;
    if (!accessToken) {
        return res.status(503).json({
            message: "Spotify search is not configured. Add SPOTIFY_ACCESS_TOKEN to the music backend environment.",
        });
    }

    const query = String(req.query.q || "popular music").trim().slice(0, 120) || "popular music";

    try {
        const spotifyResponse = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (spotifyResponse.status === 401) {
            return res.status(502).json({ message: "Spotify access token is expired or invalid. Update SPOTIFY_ACCESS_TOKEN on the music backend." });
        }
        if (spotifyResponse.status === 429) {
            return res.status(503).json({ message: "Spotify search is temporarily rate limited. Please try again shortly." });
        }
        if (!spotifyResponse.ok) {
            return res.status(502).json({ message: "Spotify search could not be completed." });
        }

        const data = await spotifyResponse.json();
        const tracks = (data.tracks?.items || []).map((track) => ({
            id: track.id,
            title: track.name,
            artist: (track.artists || []).map((artist) => artist.name).join(", "),
            cover: track.album?.images?.[0]?.url || "",
            spotifyUrl: track.external_urls?.spotify || "",
        }));

        return res.status(200).json({ tracks });
    } catch (error) {
        console.error("Spotify search failed:", error.message);
        return res.status(502).json({ message: "Spotify search is temporarily unavailable." });
    }
};

module.exports = { searchSpotifyTracks };
