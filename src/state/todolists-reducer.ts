import {FilterValuesType} from '../App';
import {todolistAPI, TodolistDomainType, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {changeAppErrorAC, changeIsLoadingAC, isLoadingType} from "./app-reducer";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}
export type fetchTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | fetchTodolistsActionType
    | ReturnType<typeof changeEntityStatusAC>

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case'SET-TODOLISTS': {
            return action.todolists.map(el => ({
                ...el,
                filter: 'all',
                entityStatus: "idle"
            }))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case"CHANGE-ENTITY-STATUS":{
            return state.map(el=>el.id===action.todolistId ?{...el, entityStatus:action.entityStatus}:el)
        }

        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export const setTodolistsAC = (todolists: TodolistType[]) => {
    return {
        type: "SET-TODOLISTS", todolists
    } as const
}
export const changeEntityStatusAC = (todolistId: string,entityStatus: isLoadingType) => {
    return {
        type: "CHANGE-ENTITY-STATUS", todolistId, entityStatus
    } as const
}


export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(changeIsLoadingAC("loading"))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(changeIsLoadingAC("successfully"))
            dispatch(setTodolistsAC(res.data))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(changeIsLoadingAC("loading"))
    dispatch(changeEntityStatusAC(todolistId,"loading"))
    todolistAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(changeIsLoadingAC("successfully"))
        })
}

export const createTodolistTC = (newTitle: string) => (dispatch: Dispatch) => {
    dispatch(changeIsLoadingAC("loading"))
    todolistAPI.createTodolist(newTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(changeIsLoadingAC("successfully"))
            } else {
                if (res.data.messages.length) {
                    dispatch(changeAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(changeAppErrorAC("Some error occurred"))
                }
                dispatch(changeIsLoadingAC("failed"))
            }
        })
}
export const updateTodolistTitleTC = (todolistId: string, newTitle: string) => (dispatch: Dispatch) => {
    todolistAPI.updateTodolistTitle(todolistId, newTitle)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistId, newTitle))
        })
}
