import React, { useContext, useState} from 'react'

const AuthContext = React.createContext({});


export function  AuthProvider ({children}){
    const [signedIn, setSignedIn] = useState(false)
    const value = {signedIn, setSignedIn}
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}



export function useAuth(){
    return(useContext(AuthContext))
}
