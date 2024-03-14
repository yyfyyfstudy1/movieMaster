// userReducer.js
const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
const USER_SET_CURRENT = 'USER_SET_CURRENT'; // 新增
const USER_LOGOUT = 'USER_LOGOUT';

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
    case USER_SET_CURRENT: // 处理用户登录或状态变化
      return { ...state, loading: false, currentUser: action.payload, error: null };
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGOUT:
      return { ...state, currentUser: null };
    default:
      return state;
  }
};
