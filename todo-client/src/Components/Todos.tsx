import { useState } from "react";
import axios from "axios";

export default function Todos() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [complete, setComplete] = useState(false);

    function createHandler() {
        () => {
            axios.post('http://localhost:3000/todo/createTodo', {
                title,
                description
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + localStorage.getItem('token')
                }
            })
        }
    }
    function deleteHandler() {
        axios.delete('http://localhost:3000/todo/deleteTodo/:todoId', {
            headers: {
                "content-type": "application/json",
                "token": "Bearer " + localStorage.getItem('token')
            }
        }).then((response) => {

        });
    }
    function updateHandler() {
        axios.put('http://localhost:3000/todo/updateTodo', {
            title,
            description
        }, {
            headers: {
                "content-type": "application/json",
                "token": "Bearer " + localStorage.getItem('token')
            }
        }).then((response) => {

        });
    }
    return (<>
        <h2>Welcome</h2>
        <h2>Todo List</h2>
        <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
        <button onClick={createHandler}>Add todo</button>
        <button onClick={deleteHandler}>Delete todo</button>
        <button onClick={updateHandler}>Update todo</button>
    </>);
}