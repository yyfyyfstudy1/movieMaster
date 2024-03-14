import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark', // 黑色背景
        primary: {
            main: '#ff0000', // 红色按钮
        },
    },
});

export default theme;
