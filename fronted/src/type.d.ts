import { TUser } from "./interfaces/user"

type UserState = {
    currentUser: TUser
    // isAdmin: boolean
  }

  type UserAction = {
    type: string
    user: TUser
    // isAdmin: boolean
  }
  
  type DispatchType = (args: UserAction) => UserAction
  