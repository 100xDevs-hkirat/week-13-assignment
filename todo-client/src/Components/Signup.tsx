import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    function onClickHandler() {

        axios.post('http://localhost:3000/user/signup', {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            localStorage.setItem('token', response.data.message);
            navigate('/todos');
        }).catch((e) => {
            alert(e.response.data.message);
        })

    }
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
                <h2 >Signup</h2>
                <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />

                <span>Already signed up? <a href='/login'>Login</a></span>
                <button onClick={onClickHandler}>Signup</button>
            </div>
        </div>
    );
}