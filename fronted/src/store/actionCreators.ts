import { TUser } from "../interfaces/user"
import { DispatchType, UserAction } from "../type"
import * as actionTypes from "./actionTypes"

export function updateUser(user: TUser) {
  const action: UserAction = {
    type: actionTypes.UPDATE_USER,
    user
  }

  return simulateHttpRequest(action)
}


export function simulateHttpRequest(user: UserAction) {
  return (dispatch: DispatchType) => {
    setTimeout(() => {
      dispatch(user)
    }, 500)
  }
}