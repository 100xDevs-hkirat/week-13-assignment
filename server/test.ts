interface Todo {
    title: string,
    description: string,
    id: number,
    done: boolean
}

type UpdateTodoInput = Partial<Todo>

function updateTodo(id:number, newProp: UpdateTodoInput){

}

updateTodo(1,{});
function swap<T,U>(a:T, b:U):[U,T]{
    return [b,a];
}
const swap2 = <T>(a:T,b:T):[T,T]=>{
    return [b,a];
}
const ans = swap2(1,2);
console.log(ans);

