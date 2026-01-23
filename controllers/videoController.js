const axios = require("axios");
const favoriteRepository = require("../repositories/favoriteRepository");

class VideoController {
  async showPage(req, res) {
    const userId = req.session.user.id;
    const q = (req.query.q || "").trim();

    const favorites = await favoriteRepository.getByUserId(userId);

    let results = [];
    let error = null;

    if (q) {
      try {
        const { YOUTUBE_API_KEY } = require("../config/youtube");
        const key = YOUTUBE_API_KEY;
        if (!key) throw new Error("Missing YOUTUBE_API_KEY");

        const url = "https://www.googleapis.com/youtube/v3/search";
        const { data } = await axios.get(url, {
          params: {
            part: "snippet",
            type: "video",
            maxResults: 8,
            q,
            key,
          },
        });

        results = (data.items || []).map((item) => ({
          videoId: item.id && item.id.videoId,
          title: item.snippet && item.snippet.title,
          thumbnailUrl:
            (item.snippet &&
              item.snippet.thumbnails &&
              item.snippet.thumbnails.medium &&
              item.snippet.thumbnails.medium.url) ||
            "",
          channelTitle: item.snippet && item.snippet.channelTitle,
        }));
      } catch (e) {
        console.log("YOUTUBE ERROR:", e.response?.data || e.message);
        error = e.response?.data?.error?.message || e.message;
      }
    }

    return res.render("videos", { q, results, favorites, error });
  }

  async saveFavorite(req, res) {
    const userId = req.session.user.id;
    const { videoId, title, thumbnailUrl } = req.body;

    try {
      await favoriteRepository.add({ userId, videoId, title, thumbnailUrl });
    } catch (e) {
      // Ignore duplicates (UNIQUE constraint userId+videoId)
    }

    const back = req.body.back || "/videos";
    return res.redirect(back);
  }

  async deleteFavorite(req, res) {
    const userId = req.session.user.id;
    const { id } = req.body;

    await favoriteRepository.removeById({ userId, id });

    const back = req.body.back || "/videos";
    return res.redirect(back);
  }
}

module.exports = new VideoController();
