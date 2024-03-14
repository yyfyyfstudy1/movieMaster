import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Action types
const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';
const USER_SET_CURRENT = 'USER_SET_CURRENT'; // 新增
const USER_LOGOUT = 'USER_LOGOUT';

// 登录action creator（基于邮箱和密码）
export const loginUser = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userCredential.user });
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: error.message });
    throw error; // 抛出错误，让.catch()可以捕获
  }
};

// 设置当前用户action creator（用于onAuthStateChanged监听器）
export const setCurrentUser = (user) => ({
  type: USER_SET_CURRENT,
  payload: user,
});

// 登出action creator
export const logoutUser = () => (dispatch) => {
  const auth = getAuth();
  signOut(auth).then(() => {
    dispatch({ type: USER_LOGOUT });
  }).catch((error) => {
    console.error("Logout Error:", error);
  });
};

// 监听用户状态变化
export const observeAuthState = () => (dispatch) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 使用 setCurrentUser 而不是 loginUser，因为这里不涉及基于邮箱和密码的认证
      dispatch(setCurrentUser(user));
    } else {
      dispatch({ type: USER_LOGOUT });
    }
  });
};
