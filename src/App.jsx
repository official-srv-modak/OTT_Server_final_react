import React from 'react'
import Home from './pages/Home/Home'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import Movie from './pages/Movie/Movie'
import Profiles from './pages/Profiles/Profile'
import Search from './pages/Search/Search'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/player/:id' element={<Player />}/>
        <Route path="/movies" element={<Movie />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  )
}

export default App
