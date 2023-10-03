const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get("/", async (req, res, next) => {
  const title = req.query.title;

  if (!title) {
    return res.status(400).json({ error: 'Title parameter is required' });
  }
  const GENIUS_API_BASE_URL = 'https://api.genius.com';
  const GENIUS_API_KEY = 'v7rJuQZVqa5n-G4KC1Swb6xP0t2t0v_btd4Gq8TKPxYRNPo5iOUK_aDmwilQJzh9'; // Replace with your Genius API key

  async function fetchSongData(title) {
    try {
      const searchResponse = await axios.get(`${GENIUS_API_BASE_URL}/search`, {
        params: {
          q: title
        },
        headers: {
          Authorization: `Bearer ${GENIUS_API_KEY}`
        }
      });
      
      if (searchResponse.data.response.hits.length === 0) {
        return res.status(500).json({ error: 'Error fetching lyrics' });
      }

      const songs = searchResponse.data.response.hits.map(hit => {
        const { full_title, artist_names, song_art_image_url, url } = hit.result;
        return { full_title, artist_names, song_art_image_url, url };
      });
      res.json(songs);
    } catch (error) {
      console.log(error);
    }
  }
  fetchSongData(title);

});

module.exports = router;