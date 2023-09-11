import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/user";
import { useNavigate } from "react-router-dom";

interface Todo {
    id: number,
    title: string,
    description: string,
    complete?: boolean
}
type todoArray = Todo[];

export default function Todos() {
    const userData = useRecoilValue(userState);
    const [todoList, setTodoList] = useState<todoArray>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:3001/todo/todos', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        setTodoList(response.data.todoList);
    }
    useEffect(() => {
        fetchTodos()
    }, []);

    const addTodo = async () => {
        try {
            const response = await axios.post('http://localhost:3001/todo/addTodo', {
                title,
                description
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + localStorage.getItem('token')
                }
            });
            setTitle("");
            setDescription("")
            const newTodo = response.data;
            alert("Todo added!")
            setTodoList([...todoList, newTodo]);


        } catch (err) {
            console.log(err.response.data.message)
        }

    }
    const deleteTodo = async ({ todo }: { todo: Todo }) => {
        try {
            const response = await axios.delete(`http://localhost:3001/todo/${todo.id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            });
            const newTodoList: todoArray = [];
            todoList.map((todoItr) => {
                if (todoItr.id !== todo.id) {
                    newTodoList.push(todoItr);
                }
            })
            setTodoList(newTodoList);
            alert(response.data.message)

        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <div>
            <div>
                {userData.username ? (<>Welcome {userData.username}!<br />
                    <button onClick={() => {

                        localStorage.setItem('token', "")
                        navigate('/login');
                    }}>Logout</button>
                </>) : <></>}

            </div>
            <div>
                <input type="text" value={title} placeholder="title" onChange={(e) => {
                    setTitle(e.target.value)
                }} />
                <input type="text" value={description} placeholder="description" onChange={(e) => {
                    setDescription(e.target.value)
                }} />
                <button onClick={addTodo}>Add todo</button>
            </div>
            <h1>Todo list</h1>
            {todoList && todoList?.map((todo) =>

                <div key={todo.id}>

                    <h2>{todo.title}</h2>
                    <h3>{todo.description}</h3>
                    <button onClick={() => deleteTodo({ todo })}>Delete</button>
                </div>
            )}
        </div>);
}