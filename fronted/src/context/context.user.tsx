import React from "react";
import { TUser } from "../interfaces/user";
import axios from "axios";
import Cookies from 'js-cookie';

export type UserContextType = {
    currentUser: TUser;
    update: () => void;
    getCurrentUser: () => TUser;
};

interface Props {
    children: React.ReactNode;
  }


export const UserContext = React.createContext<UserContextType | null>(null);

const UserProvider: React.FC<Props> = ({ children }) => {

    const [currentUser, setCurrentUser] = React.useState<TUser>({
        _id:null,
        name: "",
        email: ""
    });

    const update = () => {
        const apiUri = 'http://localhost:3000';
        const token = Cookies.get('JwtToken');
        axios.get(`${apiUri}/user/getCurrentUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(res => setCurrentUser(res.data))
            .catch(err => alert(err))
    }

    const getCurrentUser = () => {
        return currentUser;

    }
    return <UserContext.Provider value={{ currentUser, update, getCurrentUser }}>{children}</UserContext.Provider>;
}
export default UserProvider;