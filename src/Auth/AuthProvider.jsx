import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null)

    const authContext = useMemo(() => ({
        authUser,
        setAuthUser,
    }),[authUser]);

    return(
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuthContext = () => useContext(AuthContext);