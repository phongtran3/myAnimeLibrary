const popularAnimeQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
            romaji
            english
        }
        coverImage {
            large
        }
        siteUrl
        }
    }
}
`;

const trendingAnimeQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
            romaji
            english
        }
        coverImage {
            large
        }
        siteUrl
        }
    }
}
`;

const popularMangaQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(format: MANGA, sort:POPULARITY_DESC) {
        id
        title {
            romaji
            english
        }
        coverImage {
            large
        }
        siteUrl
        }
    }
}
`;
const trendingMangaQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(format: MANGA,, sort: TRENDING_DESC) {
        id
        title {
            romaji
            english
        }
        coverImage {
            large
        }
        siteUrl
        }
    }
}
`;

export {
  popularAnimeQuery,
  trendingAnimeQuery,
  popularMangaQuery,
  trendingMangaQuery,
};
