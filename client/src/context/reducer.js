import { CLEAR_ALERT, DISPLAY_ALERT } from "./actions"

const reducer = (state, action) => {
    if(action.type === DISPLAY_ALERT) {
        return{...state, showAlert:true, alertType:'danger', alertText:'Please enter all fields!'}
    }
    
    if(action.type === CLEAR_ALERT) {
        return {...alert, showAlert:false, alertType:'', alertText:''}
    }
        throw new Error(`no such action : ${action.type}`)
}

export default reducer