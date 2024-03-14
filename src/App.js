import 'swiper/swiper.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './App.scss';

import { BrowserRouter, Route } from 'react-router-dom';

import Header from './components/header/Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import Routes from './config/Routes';

function App() {
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
