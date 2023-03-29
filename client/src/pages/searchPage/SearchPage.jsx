import React from 'react'
import NavBar from '../../components/NavBar'
import { useParams, useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('genres'));
  //console.log(JSON.stringify(params));
  const sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC";
  const media = params.media;
  console.log(sort)
  console.log(media)

  return (
    <div>
       <NavBar />
       <h2>Search</h2>
    </div>
  )
}
