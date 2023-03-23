import React from 'react'
import NavBar from '../../components/NavBar'
import { useParams } from 'react-router-dom';

export default function SearchPage() {
  const params = useParams()
  const sort = params.sort === "popular" ? "POPULARITY_DESC" : "TRENDING_DESC";
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
