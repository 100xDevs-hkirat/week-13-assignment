import { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    function onClickHandler() {

        axios.post(`http://localhost:3001/user/login`, {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {

            localStorage.setItem('token', response.data.token);
            navigate('/todos')
        }).catch((e) => {
            alert(e.response.data.message);

        })
    }
    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10rem" }}>
            <div>
                <div className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
                    <h1 className="text-green-600 text-5xl font-bold ">Welcome to Todo App</h1>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <span className="text-blue-600/75 hover:text-blue-800">New here? <Link to='/signup'>Signup</Link></span> <br />
                    <button className="justify-content:center bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700" onClick={onClickHandler}>Login</button>
                </div>
            </div>
        </div>
    );
}
