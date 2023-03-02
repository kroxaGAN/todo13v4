import React from 'react'
import axios from "axios";


// const settings={
//     withCredentials:true,
//     headers:{
//         "API-KEY":"26fb8af1-3e7d-4c3b-ab20-99c24ecae36c"
//     }
// }

export const instance=axios.create({
    baseURL:'https://social-network.samuraijs.com/api/1.1/',
    withCredentials:true,
    headers:{
        "API-KEY":"26fb8af1-3e7d-4c3b-ab20-99c24ecae36c"
    }
})


export const todolistPI={
    getTodolists(){
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(newTitle:string){
        return instance.post<ResponseType<{item:   TodolistType}>>('todo-lists',{title:newTitle})
    },
    deleteTodolist(todolistId:string){
       return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId:string,newTitle:string){
       return  instance.put<ResponseType<{item:   TodolistType}>>(`todo-lists/${todolistId}`,{title:newTitle})
    }

}
export const taskApi={
    getTasks(todolistId:string){
        return instance.get<ResponseGetTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId:string, newTitle:string){
      return instance.post<ResponseTasksType<{items:TaskType}>>(`todo-lists/${todolistId}/tasks`,{title:newTitle})
    },
    updateTaskTitle(todolistId:string, taskId:string,updatedTask:UpdatedTaskType){
        return instance.put<ResponseTasksType<{items:TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`,updatedTask)
    },
    deleteTask(todolistId:string, taskId:string){
        return instance.delete<ResponseTasksType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export type TaskType={
    addedDate:string
    deadline:string
    description:string
    id:string
    order:number
    priority:number
    startDate:string
    status:number
    title:string
    todoListId:string
}
export type UpdatedTaskType={
    title:string
    description:string
    completed:boolean
    status:number
    priority:number
    startDate:string
    deadline:string
}

type ResponseGetTasksType={
    items:TaskType[]
    totalCount:number
    error:string
}

export type ResponseTasksType<T={}>={
    resultCode: string
    messages: string[]
    fieldsErrors:[]
    data: T
}

export type TodolistType={
    "id": string,
    "title": string,
    "addedDate": string,
    "order": number
}

type ResponseType<T={}>={
    resultCode: number
    messages: string[]
    fieldsErrors:string[]
    data: T
}
