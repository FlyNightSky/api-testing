const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const trackAPIUsage = require("./apiTracker.js");

const app = express();
app.use(cors());
app.use(trackAPIUsage);

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";

app.get("/get", async (req, res) => {
  try {
    const movieurl = `https://proxy.techzbots1.workers.dev/?u=https://123movies.org.mx/123movies/`;
    const moviereq = await axios.get(movieurl, {
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
    const movieres = moviereq.data;

    const $ = cheerio.load(movieres);

    const suggestionhomeMovie = [];

    const latest = [];

    const tv = [];

    const regex = /https:\/\/ww\.123movies\.org\.mx\/movie\//;

    $(".row.list-movie.g-3:first")
      .find(".col")
      .each((index, element) => {
        const name =
          $(element).find(".card.border-0.shadow img").attr("data-src") || null;
        const type = $(element).find(".card-body.item-title h2").text() || null;
        const img = $(element).find(".mlbq").text().toUpperCase() || null;
        const oldid = $(element).find(".card.border-0.shadow a").prop("href");
        const id = oldid.replace(regex, "");

        suggestionhomeMovie.push({ name, type, img, id });
      });

    $(".row.list-movie.g-3:eq(1)")
      .find(".col")
      .each((index, element) => {
        const name =
          $(element).find(".card.border-0.shadow img").attr("data-src") || null;
        const type = $(element).find(".card-body.item-title h2").text() || null;
        const img = $(element).find(".mlbq").text().toUpperCase() || null;
        const oldid = $(element).find(".card.border-0.shadow a").prop("href");
        const id = oldid.replace(regex, "");
        latest.push({ name, type, img, id });
      });

    $(".row.list-movie.g-3:eq(2)")
      .find(".col")
      .each((index, element) => {
        const name =
          $(element).find(".card.border-0.shadow img").attr("data-src") || null;
        const type = $(element).find(".card-body.item-title h2").text() || null;
        const img = $(element).find(".mlbe").text() || null;
        const oldid = $(element).find(".card.border-0.shadow a").prop("href");
        const id = oldid.replace(regex, "");

        tv.push({ name, type, img, id });
      });

    res.status(200).json({ suggestionhomeMovie, latest, tv });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = app;
