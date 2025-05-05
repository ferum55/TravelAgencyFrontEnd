import {createContext,useContext,useState,ReactNode} from 'react';
import {Role} from '../constants/AccessByRole'

interface User{
    username:string;
    role: Role;
}

interface AuthContextType{
    user: User| null;
    login: (user:User)=>void;
    logout:()=>void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}: {children:ReactNode}) => {
    const [user, setUser]=useState<User|null>(()=>{
        const raw=localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    const login = (user:User) => {
        localStorage.setItem('user',JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
      };
      

      return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
      
};

export const useAuth = () =>
{
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('AuthProvider is missing');
    return ctx;
}

