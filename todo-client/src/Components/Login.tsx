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

        <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
                <h2 >Login</h2>
                <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <span>New here? <Link to='/signup'>Signup</Link></span>
                <button onClick={onClickHandler}>Login</button>
            </div>
        </div>
    );
}
