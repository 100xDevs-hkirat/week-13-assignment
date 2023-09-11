import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import PageNotFound from "./Components/PageNotFound";
import Todos from "./Components/Todos";
import InitUser from "./Components/InitUser";

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

export default App;