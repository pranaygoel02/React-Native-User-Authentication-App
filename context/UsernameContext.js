import React, { useContext, useState} from 'react'

const UsernameContext = React.createContext({});


export function  UsernameProvider ({children}){
    const [username, setUsername] = useState(false)
    const value = {username, setUsername}
    return(
        <UsernameContext.Provider value={value}>
            {children}
        </UsernameContext.Provider>
    )
}



export function useUsername(){
    return(useContext(UsernameContext))
}
