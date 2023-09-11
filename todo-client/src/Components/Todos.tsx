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
            console.log("Todo added!")
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
        <div >

            <div className="flex justify-between ">
                {userData.username ? (<>
                    <p className="text-green-600 text-2xl font-bold ">Welcome {userData.username}!</p>
                    <button className="justify-content:center bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700" onClick={() => {
                        localStorage.setItem('token', "")
                        navigate('/login');
                    }}>Logout</button>
                </>) : <></>}

            </div>
            <form className="container mx-auto w-80 bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-16">
                <div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Title
                        </label>
                        <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Description
                        </label>
                        <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="container mx-auto">
                        <button className=" bg-green-600 text-white font-bold py-2 px-4 ml-16 rounded hover:bg-green-700" onClick={addTodo}>Add Todo</button>
                    </div>
                </div>
                <h1 className="text-green-600 text-2xl font-bold mt-8">All Todos</h1>
                {todoList && todoList?.map((todo) =>

                    <div key={todo.id}>
                        <div className="mt-4">
                        <p className=" text-gray-700 text-md font-bold mb-2">{todo.title}</p>
                        <p className="block text-gray-700 text-md font-bold mb-2">{todo.description}</p>
                        <button className="justify-content:center bg-gray-400  text-white px-1 rounded hover:bg-gray-700" onClick={() => deleteTodo({ todo })}>Delete</button>
                        </div>
                    </div>
                )}
            </form>
        </div>);
}