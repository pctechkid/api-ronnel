const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res, next) => {
    try {
        async function fetchAnimeData() {
            const search = req.query.search;
            if (!search) {
                return res.status(404).json({
                    error: 'Search parameter is missing'
                });
            }
            const result = (await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(search)}`)).data;
            const title = result.data[0].title || 'None';
            const title_english = result.data[0].title_english || 'None';
            const type = result.data[0].type || 'None';
            const episodes = result.data[0].episodes || 'None';
            const status = result.data[0].status || 'None';
            const aired = result.data[0].aired.string || 'None';

            // For premiered
            const season = result.data[0].season || 'None';
            const capitalizedSeason = season ? season.charAt(0).toUpperCase() + season.slice(1) : 'None';
            const premiered = `${capitalizedSeason !== 'None' ? capitalizedSeason : 'None'} ${result.data[0].year || 'None'}`;


            const broadcast = result.data[0].broadcast.string || 'None';
            const studio = result.data[0].studios[0]?.name || 'None';

            // For genres
            const numGenres = result.data[0].genres ? result.data[0].genres.length : 0;
            let concatenatedGenres = numGenres > 0 ? '' : 'None';

            for (let i = 0; i < numGenres; i++) {
                concatenatedGenres += result.data[0].genres[i].name;
                if (i < numGenres - 1) {
                    concatenatedGenres += ', ';
                }
            }


            const theme = result.data[0].themes[0]?.name || 'None';
            const rating = result.data[0].rating || 'None';
            const image_url = result.data[0].images.jpg?.large_image_url || 'None';

            let synopsis = result.data[0].synopsis || 'None';
            synopsis = synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '');

            const json = {
                title: title,
                title_english: title_english,
                type: type,
                episodes: episodes,
                status: status,
                aired: aired,
                premiered: premiered,
                broadcast: broadcast,
                studio: studio,
                genres: concatenatedGenres,
                theme: theme,
                rating: rating,
                image: image_url,
                synopsis: synopsis
            }
            res.json(json);

        }
        fetchAnimeData();
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;