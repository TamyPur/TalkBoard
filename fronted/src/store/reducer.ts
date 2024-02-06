import { UserAction, UserState } from "../type"
import { TUser } from "../interfaces/user";
import * as actionTypes from "./actionTypes"

const u: TUser= {
  _id: 1,
  name: "",
  email: "",
  password: "",
  address: "",
  occupation: "",
  phoneNumber: "",
  profilePicture: undefined,
  active: false
}

const initialState: UserState = {
    currentUser: u
}


const reducer = (
    state: UserState = initialState,
    action: UserAction
  ): UserState => {
    switch (action.type) {
      case actionTypes.UPDATE_USER:
        const newUser: TUser = action.user
        return {
          ...state,
          currentUser: newUser
        };
    }
    return state;
  };



export default reducer