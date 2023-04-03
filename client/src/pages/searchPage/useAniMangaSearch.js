import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import axios from "axios";

export default function useAniMangaSearch({ queryParam, pageNumber }) {
  const [loading, setLoading] = useState(true);
  const [hasNextPage, sethasNextPage] = useState(false);
  const [aniManga, setAniManga] = useState([]);

  const variables = {
    page: pageNumber,
    perPage: 50,
    genre_in: paramGenres,
  };

  useEffect(() => {
    setLoading(true);
  });
}
