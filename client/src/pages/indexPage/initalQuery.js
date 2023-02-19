const popularAnimeQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
            romaji
            english
        }
        genres
        coverImage {
            large
        }
        siteUrl
        format
        status
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
        genres
        coverImage {
            large
        }
        siteUrl
        format
        status
        }
    }
}
`;

const popularMangaQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(type: MANGA, sort:POPULARITY_DESC) {
        id
        title {
            romaji
            english
        }
        genres
        coverImage {
            large
        }
        siteUrl
        status
        }
    }
}
`;
const trendingMangaQuery = `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    media(type: MANGA,, sort: TRENDING_DESC) {
        id
        title {
            romaji
            english
        }
        genres
        coverImage {
            large
        }
        siteUrl
        status
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
