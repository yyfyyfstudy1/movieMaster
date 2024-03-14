import 'swiper/swiper.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './App.scss';

import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/header/Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { useEffect } from 'react';
import Routes from './config/Routes';

import { useDispatch } from 'react-redux';
import { auth } from './api/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { setCurrentUser, logoutUser } from './store/actions';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("用户已经登录了啊锕锕锕锕锕锕锕锕锕")
            console.log(user)
            // 使用setUser action来更新状态
            dispatch(setCurrentUser(user));
          } else {
            // 用户未登录，可以分发登出的action
            dispatch(logoutUser());
          }
        });
    
        // 清理监听器
        return () => unsubscribe();
      }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Route render={props => (
                    <>
                        <Header {...props}/>
                        <Routes/>
              
                    </>
                )}/>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
