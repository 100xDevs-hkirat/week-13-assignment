import { useState } from "react";
import axios from 'axios';

export default function Signup(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function onClickHandler(){
        async () => { 
            axios.post('http://localhost:3000/user/signup',{
                username,
                password
            },{
                headers:{
                    'Content-Type':'application/json',
                }
            }).then((response)=>{
                localStorage.setItem('token', response.data.message);
            })
        }
    }
    return (
        <div style={{display:"flex",justifyContent:"center"}}>
            <div>
            <h2 >Signup</h2>
            <input type="text" placeholder='Username' onChange={(e)=>setUsername(e.target.value)} />
            <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
            
            <span>Already signed up? <a href='/login'>Login</a></span>
            <button onClick={onClickHandler}>Signup</button>
            </div>
        </div>
    );
}