import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import axios from 'axios';
import NavBar from '../../components/NavBar'

export default function ListPage() {
  const [user, setUser] = useState(null);
  const { userName, list } = useParams();
  const token = useSelector((state) => state.token);

  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      //console.log(res);
      setUser(res);
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
    console.log(err);
    }) 
  }
  useEffect(() => {
    getUser();
    console.log(user)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }
  const {firstName, lastName, animes, mangas, picturePath } = user.data;
  const progress = [];
  if (list === 'animelist'){
    for(let i = 0; i < animes.length; i++){
      if(animes[i].userStatus === 'WATCHING')
        progress.push(animes[i])
    }
  }else{
    for(let i = 0; i < mangas.length; i++){
      if(mangas[i].userStatus === 'READING')
        progress.push(mangas[i])
    }
  }

  console.log(user)

  return (
    <>
      <NavBar />
      <h1>List Page</h1>
    </>
  )
}
