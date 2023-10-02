import { useEffect } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { userState } from '../store/atoms/user';
import { useNavigate } from 'react-router-dom';

export default function InitUser() {
    const setUserData = useSetRecoilState(userState);
    const navigate = useNavigate();
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user/me', {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (response.data.username) {
                setUserData({    
                    username: response.data.username
                })
                navigate("/todos");
            }
            else {
                setUserData({
                   
                    username: null
                })
                // navigate("/login");
            }
        }
        catch {
            setUserData({
                username: null
            })
            navigate("/login");

        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    return <></>

}