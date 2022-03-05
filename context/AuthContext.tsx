import React, { useState } from 'react';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';

type UserType = any;
type AuthContextType = {
    isLoggedIn: boolean;
    user: UserType;
    token?: string;
    login: (token: string) => void;
    logout: () => void;
};

export const initialUserState = {
    username: undefined,
    email: undefined,
};

export const AuthContext = React.createContext<AuthContextType>({
    isLoggedIn: false,
    user: initialUserState,
    token: undefined,
    login: () => {},
    logout: () => {},
});
export type AuthType = any;
export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [user, setUser] = useState<UserType>(initialUserState);
    const router = useRouter();
    const login = (token: string) => {
        setToken(token);
        cookie.set('token', token);
    };

    const logout = () => {
        setToken(undefined);
        cookie.remove('token');
        setUser(initialUserState);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
