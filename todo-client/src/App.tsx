import {Route,Routes } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Todos from "./Components/Todos";
import PageNotFound from "./Components/PageNotFound";
import axios from 'axios';

function App(){
  return (
    <Routes>
     
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

function InitUser(){
  axios.get('http://localhost:3000/user/me',{
    headers:{
      'authorization':'Bearer ' + localStorage.getItem('token')
    }
  }).then((response)=>{
    
  })
}

export default App;