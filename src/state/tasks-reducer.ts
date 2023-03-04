import {AddTodolistActionType, fetchTodolistsActionType, RemoveTodolistActionType} from './todolists-reducer';
import {TasksStateType} from '../App';
import {Dispatch} from "redux";
import {taskApi, TaskType, UpdatedTaskType} from "../api/todolist-api";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = ReturnType <typeof addTaskAC>

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    isDone: boolean
}

export type ChangeTaskTitleActionType =ReturnType<typeof changeTaskTitleAC>
export type setTasksActionType = ReturnType<typeof setTasksAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | fetchTodolistsActionType
    | setTasksActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET_TASKS':{
            return {...state,
            [action.todolistId]:action.tasks
            }
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(el => {
                copyState[el.id] = []
            })
            return copyState
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            return {...stateCopy,
            [action.todolistId]:[action.newTask, ...stateCopy[action.todolistId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            // let todolistTasks = state[action.todolistId];
            // // найдём нужную таску:
            // let newTasksArray = todolistTasks
            //     .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            //
            // state[action.todolistId] = newTasksArray;
            // return ({...state});
            return {...state,[action.todolistId]:state[action.todolistId].map(el=>el.id===action.task.id ?{...el, title:action.task.title}:el)}
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (newTask: TaskType, todolistId: string)=> {
    return {type: 'ADD-TASK', newTask, todolistId} as const
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', isDone, todolistId, taskId}
}
export const changeTaskTitleAC = (todolistId: string, task:TaskType) => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, task} as const
}

export const setTasksAC = (todolistId: string, tasks:TaskType[]) => {
    return {
        type: 'SET_TASKS', todolistId,tasks
    } as const
}

export const setTaskTC=(todolistId:string)=>(dispatch:Dispatch)=>{
    taskApi.getTasks(todolistId)
        .then((res)=>{
            dispatch(setTasksAC(todolistId, res.data.items))
        })
}
export const removeTaskTC=(todolistId:string,taskId:string)=>(dispatch:Dispatch)=>{
    taskApi.deleteTask(todolistId,taskId)
        .then((res)=>{
            dispatch(removeTaskAC(taskId,todolistId))
        })
}
export const addTaskTC=(todolistId:string,newTitle:string)=>(dispatch:Dispatch)=>{
    taskApi.createTask(todolistId,newTitle)
        .then((res)=>{
            dispatch(addTaskAC(res.data.data.item,todolistId))
        })
}
export const updateTaskTitleTC=(todolistId:string, taskId:string,title:string)=>(dispatch:Dispatch, getState:()=>AppRootStateType)=>{
    // const state=getState()
    // const allTasks=state.tasks
    // const tasks:TaskType[]=allTasks[todolistId]
    // const task=tasks.find(el=>el.id===taskId)
    // console.log(task)
    const task=getState().tasks[todolistId].find(el=>el.id===taskId)
    debugger
    if (task){
        const updatedTask:UpdatedTaskType={
            title:title,
            status:task.status,
            description:task.description,
            deadline:task.deadline,
            startDate:task.startDate,
            priority:task.priority,
            completed:task.status===0
        }
        taskApi.updateTask(todolistId,taskId,updatedTask)
            .then((res)=>{
                dispatch(changeTaskTitleAC(todolistId, res.data.data.item))
            })
    }

}

