import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Todos from "./Components/Todos";
import PageNotFound from "./Components/PageNotFound";
import axios from 'axios';
import { useEffect, useState } from "react";

function App() {
  return (
    <>
      <InitUser />
      <Routes>

        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export function InitUser() {
  const [userData, setUserData] = useState(""); // Initialize with an empty object
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    // Perform the Axios request when the component mounts
    fetchUsername();
  }, []);

  const fetchUsername = async () => {
    const response = await axios.get('http://localhost:3000/user/me', {
      headers: {
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    if (response.data.username) {
      // If user data is available, set it in state
      setUserData(response.data.username);
    }
    setIsLoading(false); // Request completed, stop loading
  }

  function onClickHandler() {
    localStorage.setItem('token', '');
    // Clear user data when logging out
    setUserData("");
    navigate('/login');
  }

  if (isLoading) {
    return <p>Loading</p>; // Show loading indicator while waiting for data
  }

  return (
    <div>
      {userData ? (
        <>
          <h1>Welcome {userData}!</h1>
          <button onClick={onClickHandler}>Logout</button>
        </>
      ) : null}
    </div>
  );
}
export default App;