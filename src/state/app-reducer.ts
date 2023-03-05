export type isLoadingType = "idle" | "loading" | "successfully" | "failed"

const InitialAppState = {
    isLoading: "idle" as isLoadingType,
    isError: null as string | null
}
export type InitialAppStateType = typeof InitialAppState

export const appReducer = (state: InitialAppStateType = InitialAppState, action: ActionAppType): InitialAppStateType => {
    switch (action.type) {
        case "APP/CHANGE-IS-LOADING": {
            return {...state, isLoading: action.value}
        }
        case "APP/CHANGE-APP-ERROR":{
            return {...state,isError:action.error }
        }
        default:
            return state
    }
}

export const changeIsLoadingAC = (value: isLoadingType) => {
    return {
        type: "APP/CHANGE-IS-LOADING", value
    } as const
}
export const changeAppErrorAC = (error: null | string) => {
    return {
        type: "APP/CHANGE-APP-ERROR", error
    } as const
}


export type ActionAppType = ReturnType<typeof changeIsLoadingAC> | ReturnType<typeof changeAppErrorAC>
