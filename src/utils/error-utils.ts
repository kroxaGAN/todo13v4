import {changeAppErrorAC, changeIsLoadingAC} from "../state/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";


export const handleServerAppError =<T>(dispatch:Dispatch,data:ResponseType<T>)=>{
    if (data.messages.length) {
        dispatch(changeAppErrorAC(data.messages[0]))
    } else {
        dispatch(changeAppErrorAC("Some error occurred"))
    }
    dispatch(changeIsLoadingAC("failed"))
}
export const handleServerNetvorkError =(dispatch:Dispatch,error:{message:string})=>{
    dispatch(changeAppErrorAC(error.message))
    dispatch(changeIsLoadingAC("failed"))
}
