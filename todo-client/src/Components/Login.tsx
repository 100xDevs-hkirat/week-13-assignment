import { useState } from "react";
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function onClickHandler(){
        async () => { 
            axios.post('http://localhost:3000/user/login',{
                username,
                password
            },{
                headers:{
                    'Content-Type':'application/json'
                }
            }).then((response)=>{
                localStorage.setItem('token', response.data.message);
            })
        }
    }
    return (
        
        <div style={{display:"flex",justifyContent:"center"}}>
            <div>
            <h2 >Login</h2>
            <input type="text" placeholder='Username' onChange={(e)=>setUsername(e.target.value)} />
            <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
            <span>New here? <a href='/signup'>Signup</a></span>
            <button onClick={onClickHandler}>Login</button>
            </div>
        </div>
    );
}
