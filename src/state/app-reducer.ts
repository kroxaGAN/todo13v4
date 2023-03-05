
export type isLoadingType = "idle" | "loading" | "successfully" | "failed"

const InitialAppState={
    isLoading:"idle" as isLoadingType
}
export type InitialAppStateType=typeof InitialAppState

export const appReducer=(state:InitialAppStateType=InitialAppState, action:ActionAppType):InitialAppStateType=>{
    switch (action.type){
        case "APP/CHANGE-IS-LOADING":{
            return {...state,isLoading:action.value}
        }
        default: return state
    }
}

export const changeIsLoadingAC=(value:isLoadingType)=>{
    return{
        type:"APP/CHANGE-IS-LOADING",value
    }as const
}



export type ActionAppType=ReturnType<typeof changeIsLoadingAC>
