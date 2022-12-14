import React, {  useReducer, useContext } from "react"
import reducer from "./reducer"
import axios from "axios"

import { 
    CLEAR_ALERT, 
    DISPLAY_ALERT,
    SETUP_USER_BEGIN,
    SETUP_USER_ERROR,
    SETUP_USER_SUCCESS,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
} from "./actions"

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
    //For User
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null, 
    token: token, 
    userLocation: userLocation || '',
    showSidebar: false,
    
    //For Job
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: userLocation || '',
    jobTypeOptions: ['Full Time', 'Part Time', 'Remote', 'Internship'],
    jobType: 'Full Time',
    statusOptions: ['Interview', 'Declined', 'Pending'],
    status: 'Pending',
}

const AppContext = React.createContext()

const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
 
    //axios
    const authFetch = axios.create({
        baseURL: '/api/v1',
    })

    //request
    authFetch.interceptors.request.use(
        (config) => {
            config.headers['Authorization'] = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        }   
    )

    //response
    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            //console.log(error.response)
            if(error.response.status === 401) {
                logoutUser()
            }
            return Promise.reject(error)
        }   
    )

    const displayAlert = () => {
        dispatch({type:DISPLAY_ALERT})
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() =>{ 
            dispatch({type:CLEAR_ALERT})
            }, 3000)
    }

    const addUserToLocalStorage = ({user, token, location}) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserfromLocalStorage = ({user, token, location}) => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('location')
    }
/* Combined these two methods into setUser
    const registerUser = async (currentUser) => {
        dispatch({type: REGISTER_USER_BEGIN})
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser)
            
            const {user, token, location} = response.data
            dispatch({type: REGISTER_USER_SUCCESS, 
                      payload: {user, token, location},
            })
            addUserToLocalStorage({user, token, location})
        } catch(error) {    
            //console.log(error.response)
            dispatch({type: REGISTER_USER_ERROR, 
                      payload: {msg: error.response.data.msg}
                    })
        }
        clearAlert()
    }
    const loginUser = async (currentUser) => {
            dispatch({type: LOGIN_USER_BEGIN})
            try {
                const {data} = await axios.post('/api/v1/auth/login', currentUser)
                
                const {user, token, location} = data
                dispatch({
                    type: LOGIN_USER_SUCCESS, 
                    payload: {user, token, location},
                })
                addUserToLocalStorage({user, token, location})
            } catch(error) {    
                dispatch({
                    type: LOGIN_USER_ERROR, 
                    payload: {msg: error.response.data.msg}
                })
            }
            clearAlert()
        }
*/
        const setupUser = async ({currentUser, endPoint, alertText}) => {
            dispatch({type: SETUP_USER_BEGIN})
            try {
                const {data} = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
                
                const {user, token, location} = data
                dispatch({
                    type: SETUP_USER_SUCCESS, 
                    payload: {user, token, location, alertText},
                })
                addUserToLocalStorage({user, token, location})
            } catch(error) {  
                if(error.response.status !== 401) {  
                    dispatch({
                        type: SETUP_USER_ERROR, 
                        payload: {msg: error.response.data.msg}
                    })
                }
            clearAlert()
            }
        }

        const toggleSidebar = () => {
            dispatch({type: TOGGLE_SIDEBAR})
        }

        const logoutUser = () => {
            dispatch({type: LOGOUT_USER})
            removeUserfromLocalStorage()
        }

        const updateUser = async (currentUser) => {
            dispatch({ type: UPDATE_USER_BEGIN })
            try{
                const { data } = await authFetch.patch('/auth/updateUser', currentUser)
                
                const{user, location, token} = data

                dispatch({
                    type: UPDATE_USER_SUCCESS, 
                    payload:{user, location, token},
                    }
                )
                addUserToLocalStorage({ user, location, token})
            } catch (error) {
                dispatch({ 
                    type: UPDATE_USER_ERROR, 
                    payload:{ msg: error.response.data.msg }
                })
            }
            clearAlert()
        }

        const handleChange = ({name, value}) => {
            dispatch({
                type: HANDLE_CHANGE,
                payload: {name, value},
            })
        }

    return <AppContext.Provider value={{...state, displayAlert, setupUser, toggleSidebar, logoutUser, updateUser, handleChange}}>
        {children}
    </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext)
}

export {AppProvider, initialState, useAppContext}