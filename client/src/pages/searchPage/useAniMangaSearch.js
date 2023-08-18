import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";

const formatMapping = {
  "TV Show": "TV",
  "TV Short": "TV_SHORT",
  "One Shot": "ONE_SHOT",
  "Light Novel": "NOVEL",
};

const sortMapping = {
  trending: "TRENDING_DESC",
  Popularity: "POPULARITY_DESC",
  "Average Score": "SCORE_DESC",
  Trending: "TRENDING_DESC",
  Favorites: "FAVOURITES_DESC",
  "Date Added": "ID_DESC",
};

export default function useAniMangaSearch(pageNumber, setPageNumber) {
  const params = useParams();
  const location = useLocation();
  const [lastLocation, setLastLocation] = useState({
    search: location.search,
    pathname: location.pathname,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [hasNextPage, sethasNextPage] = useState(false);
  const [aniMangas, setAniMangas] = useState([]);
  const [isAdult, setIsAdult] = useState(false);

  const tempFormat =
    formatMapping[searchParams.get("format")] || searchParams.get("format");
  const sort =
    sortMapping[params.sort || searchParams.get("sort")] || "POPULARITY_DESC";

  const queryParam = {
    search: searchParams.get("search") || "",
    format: tempFormat || "",
    status: searchParams.get("status") || "",
    genres: searchParams.getAll("genres"),
    sort: sort || "",
    type: params.media ? params.media.toUpperCase() : "",
  };

  const fetchData = useCallback(async () => {
    const { search, format, status, genres, sort, type } = queryParam;
    if (genres.includes("Hentai")) setIsAdult(true);
    const variables = {
      page:
        location.search !== lastLocation.search ||
        location.pathname !== lastLocation.pathname
          ? 1
          : pageNumber,
      perPage: 50,
      genre_in: queryParam.genres,
    };
    const query = `
      query ($page: Int, $perPage: Int, ${
        genres[0] !== "" && genres.length > 0 ? `$genre_in: [String]` : ""
      }) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
          }
          media(
            ${
              genres[0] !== "" && genres.length > 0 ? `genre_in: $genre_in` : ""
            }
            type: ${type}
            sort: ${sort}
            ${search ? `search: "${search.toUpperCase()}"` : ""}
            ${format ? `format: ${format.toUpperCase()}` : ""}
            ${status ? `status: ${status.toUpperCase()}` : ""}
          ) {
              id
              title {
                romaji
                english
              }
              genres
              coverImage {
                extraLarge
                large
              }
              isAdult
              siteUrl
              format
              status
              averageScore
              duration
              episodes
            }
        }
      }
    `;
    try {
      const response = await axios.post("https://graphql.anilist.co", {
        query,
        variables,
      });
      const newAniMangas = response.data.data.Page.media;
      if (
        location.search !== lastLocation.search ||
        location.pathname !== lastLocation.pathname
      ) {
        setAniMangas(newAniMangas);
        setLastLocation({
          search: location.search,
          pathname: location.pathname,
        });
      } else {
        setAniMangas((prevAniMangas) => {
          const merged = [...prevAniMangas, ...newAniMangas];
          return merged.filter(
            (obj, index, self) =>
              index === self.findIndex((el) => el.id === obj.id)
          );
        });
      }
      sethasNextPage(response.data.data.Page.pageInfo.hasNextPage);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [queryParam, pageNumber]);

  useEffect(() => {
    //Set loading when url changes
    if (
      location.search !== lastLocation.search ||
      location.pathname !== lastLocation.pathname
    ) {
      setIsAdult(false);
      setLoading(true);
    }
    fetchData();
  }, [pageNumber, location.search, location.pathname]);

  return { loading, aniMangas, hasNextPage, isAdult, queryParam };
}
