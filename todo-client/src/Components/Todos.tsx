import { useEffect, useState } from "react";
import axios from "axios";

interface Todo{
    id:number,
    title:string,
    description:string,
    complete?:boolean
}
type todoArray = Todo[];

export default function Todos() {
    const [todoList, setTodoList] = useState<todoArray>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    useEffect(() => {
        const fetchTodos = async () => {
            const response = await axios.get('http://localhost:3000/todo/todos', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            setTodoList(response.data.todoList);
        }
        fetchTodos()
    },[]);

    const addTodo =() => {
        async () => {
            const response = await axios.post('http://localhost:3000/todo/todos', {
                title,
                description
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + localStorage.getItem('token')
                }
            });
            const data = response.data;
            const newTodos = [];
            for(let i=0;todoList.length;i++){
                newTodos.push(todoList[i]);
            }
            newTodos.push(data);
            setTodoList(newTodos);
        }
    }
   

    return (
        todoList.map((todo) =>
            <div key={todo.id}>
                <h1>{todo.title}</h1>
                <h2>{todo.description}</h2>
                
            </div>));
}


