import React, {useEffect, useState} from 'react'
import axios from "axios";
import {taskApi, todolistPI, UpdatedTaskType} from "../api/todolist-api";
import {text} from "stream/consumers";

export default {
    title: 'API'
}
// const settings={
//     withCredentials:true,
//     headers:{
//         "API-KEY":"26fb8af1-3e7d-4c3b-ab20-99c24ecae36c"
//     }
// }

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        // axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists',settings)
        todolistPI.getTodolists()
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>("")

    const createTodoHandler=()=>{
            todolistPI.createTodolist(title)
                .then((res) => {
                    setState(`made --- ${res.data.data.item.title}`)
                    setTitle('')
                })
    }

    return <div>
        {JSON.stringify(state)}
        <div>
            <input value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}}/>
            <button onClick={createTodoHandler}>create todolist</button>
        </div>
    </div>
}
export const DeleteTodolist = () => {

    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    // useEffect(() => {
        // axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`,settings)
    //     todolistPI.deleteTodolist(todolistId)
    //         .then((res) => {
    //             setState(res.data)
    //         })
    // }, [])
    const deleteTodoHandler=()=>{
        todolistPI.deleteTodolist(todolistId)
            .then((res) => {
                setState(res.data)
                setTodolistId('')
            })
    }
    return <div>
        <>
            {JSON.stringify(state)}
            <div>
                <input value={todolistId} onChange={(e)=>{setTodolistId(e.currentTarget.value)}}/>
                <button onClick={deleteTodoHandler}>delete todolist</button>
            </div>
        </>


    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>()
    const [title, setTitle] = useState<string>("")
    const [todolistId, setTodolistId] = useState<string>("")
    useEffect(() => {
        todolistPI.getTodolists()
            .then((res) => {
                setState(res.data)
            })
    }, [])
    const updateTodoHandler=()=>{
        todolistPI.updateTodolistTitle(todolistId, title)
            .then((res) => {
                setState(res.data)
                setTitle('')
                setTodolistId('')
            })
    }

    return <div>
        {JSON.stringify(state)}
        <div>
            <input value={todolistId} onChange={(e)=>{setTodolistId(e.currentTarget.value)}}/>
            <input value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}}/>
            <button onClick={updateTodoHandler}>update title todolist</button>
        </div>
    </div>
}


export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId="76cbfcb9-8747-4639-bf31-b0f6a37b1079"
        taskApi.getTasks(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId="76cbfcb9-8747-4639-bf31-b0f6a37b1079"
        taskApi.createTask(todolistId,"NEW task")
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId="76cbfcb9-8747-4639-bf31-b0f6a37b1079"
        const taskId='da122bbf-32d8-4ea1-bc81-6072edf650f5'
        const updatedTask:UpdatedTaskType={
            title:"NEWWWWW TASK",
            completed:false,
            deadline:"2023-03-02T18:58:50.937",
            description:"sdadsasdasd,",
            priority:1,
            startDate:"2023-03-02T18:58:50.937",
            status:0
        }
        taskApi.updateTaskTitle(todolistId,taskId,updatedTask)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId="76cbfcb9-8747-4639-bf31-b0f6a37b1079"
        const taskId='da122bbf-32d8-4ea1-bc81-6072edf650f5'
        taskApi.deleteTask(todolistId,taskId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
