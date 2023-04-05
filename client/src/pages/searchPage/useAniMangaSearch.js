import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import axios from "axios";

export default function useAniMangaSearch(pageNumber) {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(pageNumber);

  let tempFormat;
  const paramFormat = searchParams.get("format");
  if (paramFormat === "TV Show") tempFormat = "TV";
  else if (paramFormat === "TV Short") tempFormat = "TV_SHORT";
  else tempFormat = paramFormat;

  let sort;
  if (params.sort) {
    sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC";
  } else if (searchParams.get("sort")) sort = searchParams.get("sort");
  else sort = "POPULARITY_DESC";

  const [queryParam, setQueryParam] = useState({
    search: searchParams.get("search"),
    format: tempFormat,
    status: searchParams.get("status"),
    genres: searchParams.getAll("genres"),
    sort: sort,
    type: params.media ? params.media.toUpperCase() : "",
  });

  const [loading, setLoading] = useState(true);
  const [hasNextPage, sethasNextPage] = useState(false);
  const [aniMangas, setAniMangas] = useState([]);

  const variables = {
    page: pageNumber,
    perPage: 50,
    genre_in: queryParam.genres,
  };

  useEffect(() => {
    console.log("search useEffect");
    //console.log(queryParam);
    const { search, format, status, genres, sort, type } = queryParam;
    // console.log(search);
    // console.log(format);
    // console.log(status);
    // console.log(genres);
    // console.log(sort);
    // console.log(type);
    setLoading(true);
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
                large
              }
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
    console.log(query);
    const fetchData = async () => {
      console.log("fetch data");
      await axios
        .post("https://graphql.anilist.co", { query, variables })
        .then((res) => {
          console.log(res);
          //console.log(res.data.data.Page.pageInfo.hasNextPage);
          setAniMangas((prevAniMangas) => {
            return [
              ...new Set([...prevAniMangas, ...res.data.data.Page.media]),
            ];
          });
          sethasNextPage(res.data.data.Page.pageInfo.hasNextPage);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [queryParam, pageNumber]);

  return { loading, aniMangas, hasNextPage };
}
