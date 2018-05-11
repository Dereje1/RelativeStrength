//sets user status into store state
export function userStatusReducer(state={user:[]},action){
  switch (action.type) {
    case "GET_USER_STATUS":
      return {user: action.payload};
    default:
      return state
  }
}
