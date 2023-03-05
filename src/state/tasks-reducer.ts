import {AddTodolistActionType, fetchTodolistsActionType, RemoveTodolistActionType} from './todolists-reducer';
import {TasksStateType} from '../App';
import {Dispatch} from "redux";
import {taskApi, TaskStatuses, TaskType, UpdatedTaskType} from "../api/todolist-api";
import {AppRootStateType} from "./store";
import {changeAppErrorAC, changeIsLoadingAC} from "./app-reducer";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = ReturnType<typeof addTaskAC>

export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>

export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
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
        case 'SET_TASKS': {
            return {
                ...state,
                [action.todolistId]: action.tasks
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
            return {...state,[action.todolistId]:state[action.todolistId].filter(el=>el.id!==action.taskId)}
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            return {
                ...stateCopy,
                [action.todolistId]: [action.newTask, ...stateCopy[action.todolistId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {...state, [action.todolistId]:state[action.todolistId].map(el=>el.id===action.taskId
                ?{...el, status:action.task.status }
                :el)}

        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.task.id ? {
                    ...el,
                    title: action.task.title
                } : el)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
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
export const addTaskAC = (newTask: TaskType, todolistId: string) => {
    return {type: 'ADD-TASK', newTask, todolistId} as const
}
export const changeTaskStatusAC = (todolistId: string,taskId: string, task:TaskType ) => {
    return {type: 'CHANGE-TASK-STATUS', todolistId, taskId, task }as const
}
export const changeTaskTitleAC = (todolistId: string, task: TaskType) => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, task} as const
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET_TASKS', todolistId, tasks
    } as const
}

export const setTaskTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(changeIsLoadingAC("loading"))
    taskApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
            dispatch(changeIsLoadingAC("successfully"))
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(changeIsLoadingAC("loading"))
    taskApi.deleteTask(todolistId, taskId)
        .then((res) => {
            console.log(res.data.resultCode)
            if (res.data.resultCode === 0){
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(changeIsLoadingAC("successfully"))
            }

        })
}
export const addTaskTC = (todolistId: string, newTitle: string) => (dispatch: Dispatch) => {
    dispatch(changeIsLoadingAC("loading"))
    taskApi.createTask(todolistId, newTitle)
        .then((res) => {
            if(res.data.resultCode===0){
                dispatch(addTaskAC(res.data.data.item, todolistId))
                dispatch(changeIsLoadingAC("successfully"))
            }
            else{
                if (res.data.messages.length){
                    dispatch(changeAppErrorAC(res.data.messages[0]))
                } else{
                    dispatch(changeAppErrorAC("Some error occurred"))
                }
                dispatch(changeIsLoadingAC("failed"))
            }

        })
}
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(el => el.id === taskId)
    if (task) {
        const updatedTask: UpdatedTaskType = {
            title: title,
            status: task.status,
            description: task.description,
            deadline: task.deadline,
            startDate: task.startDate,
            priority: task.priority,
        }
        taskApi.updateTask(todolistId, taskId, updatedTask)
            .then((res) => {
                dispatch(changeTaskTitleAC(todolistId, res.data.data.item))
            })
    }

}
export const updateTaskStatusTC = (todolistId: string, taskId: string, statusTask: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(el => el.id === taskId)
    if (task) {
        debugger
        const updatedTask: UpdatedTaskType = {
            status: statusTask,
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline
        }
        taskApi.updateTask(todolistId, taskId, updatedTask)
            .then((res) => {
                dispatch(changeTaskStatusAC(todolistId,taskId,res.data.data.item))
            })
    }
}
