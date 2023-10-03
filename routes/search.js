const express = require("express");
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/", async (req, res, next) => {
  const title = req.query.title;

  if (!title) {
    return res.status(400).json({ error: 'Song title is missing' });
  }

  const GENIUS_API_BASE_URL = 'https://api.genius.com';
  const GENIUS_API_KEY = 'v7rJuQZVqa5n-G4KC1Swb6xP0t2t0v_btd4Gq8TKPxYRNPo5iOUK_aDmwilQJzh9'; // Replace with your Genius API key

  const fetchSongLyrics = async (title) => {
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
        throw new Error('Song not found');
      }

      const songUrl = searchResponse.data.response.hits[0].result.url;

      // Extract lyrics
      const className = '#lyrics-root';
      const response = await axios.get(songUrl);
      const html = response.data;
      const $ = cheerio.load(html);
      const lyricsContainer = $(`${className}`);
      const songLyrics = lyricsContainer
        .html()
        .replace(/<br>/g, '\n')
        .replace(/<[^>]*>/g, '')
        // .replace(/^.*(?=\[)/, '')
        .replace(/^.*(?=)Lyrics/g, '')
        .replace(/You might also like/g, '\n')
        .replace(/\d*Embed$/, '')
        .replace(/\bSee.*(?=)\d\b/g, '');
      // .text()
      // .replace(/([a-z])([A-Z])/g, '$1\n$2')
      // .replace(/\[(.*?)\]\s*([A-Za-z']+)/g, '\n\n[$1]\n$2')
      // .replace(/\b([^A-Z\s]\w*[^A-Z\s])([A-Z]\w*)\b/g, '$1\n$2')
      // .replace(/^\n\n/, '');

      const songTitle = searchResponse.data.response.hits[0].result.title;
      const songArtist = searchResponse.data.response.hits[0].result.primary_artist.name;
      const songAlbum = searchResponse.data.response.hits[0].result.song_art_image_url;

      const resultsJson = { title: songTitle, artist: songArtist, album: songAlbum, url: songUrl, lyrics: songLyrics };
      return resultsJson;
    } catch (error) {
      throw new Error('Error fetching lyrics');
    }
  };

  try {
    const resultsJson = await fetchSongLyrics(title);
    res.json(resultsJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
