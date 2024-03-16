import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage 方法
import { storage } from '../api/firebaseConfig'; // 假设你的 Firebase 配置
import '../components/hero-slide/hero-slide.scss';
import bg from '../assets/footer-bg.jpg';
import logoImage from '../assets/tmovie.png'
import { updateProfile } from 'firebase/auth';
import MyHeatmap from '../components/activity-grid/ActivityGrid'
import Tooltip from '@uiw/react-tooltip';
import HeatMap from '@uiw/react-heat-map';

const UserProfile = () => {
    const currentUser = useSelector((state) => state.user.currentUser); // 获取当前用户信息
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    // 假设这个数组是你根据某种方式获取的用户活动数据
    const userActivities = {
        "2024-03-01": 1,
        "2024-03-02": 2,
        "2024-03-03": 6,
        "2024-03-04": 0,
        // 以此类推...
    };

    const value = [
        { date: '2016/01/11', count: 2 },
        ...[...Array(17)].map((_, idx) => ({ date: `2016/01/${idx + 10}`, count: idx, })),
        ...[...Array(17)].map((_, idx) => ({ date: `2016/02/${idx + 10}`, count: idx, })),
        { date: '2016/04/12', count: 2 },
        { date: '2016/05/01', count: 5 },
        { date: '2016/05/02', count: 5 },
        { date: '2016/05/03', count: 1 },
        { date: '2016/05/04', count: 11 },
        { date: '2016/05/08', count: 32 },
    ];

    useEffect(() => {
        if (currentUser) {
            setUserName(currentUser.displayName || '');
            setUserEmail(currentUser.email || '');
            setAvatarUrl(currentUser.photoURL || '/path/to/default/avatar'); // 提供默认头像路径
        }
    }, [currentUser]);

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        const avatarRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(avatarRef, file);
        const url = await getDownloadURL(avatarRef);
        setAvatarUrl(url);
        // 更新用户头像 URL 的逻辑
        await updateProfile(currentUser, {
            photoURL: url
        });
    };

    const handleUpdateProfile = () => {
        // 在这里添加更新用户资料的逻辑
        console.log('Updating user profile...');
    };
    const [range, setRange] = useState(5)
    return (
        <div
            className={`hero-slide__item`}
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="hero-slide__item__content container">

                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        multiple
                        type="file"
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Avatar src={avatarUrl} sx={{ width: 100, height: 100, mb: 2, cursor: 'pointer' }} />
                    </label>
                    <Typography variant="h6">{userName}</Typography>
                    <TextField
                        label="Email"
                        value={userEmail}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    {/* <Button variant="contained" onClick={handleUpdateProfile}>Update Profile</Button> */}
                    
                    <HeatMap
                        value={value}
                        width={600}
                        style={{margin:40, color: 'white', '--rhm-rect-active': 'red',transform: 'scale(1.5)'  }}
                        startDate={new Date('2016/01/01')}
                        // endDate={new Date('2016/06/01')}
                        // monthLabels={}
                        weekLabels={['Sun', '', 'Tue', '', 'Thu', '', 'Sat']}
                        space = {4}
                        legendRender={() => null} // 这里设置为返回null，不渲染图例
                        rectProps={{
                            rx: 2
                          }}
                        panelColors={{
                            0: '#ffebee', // 很浅的红色
                            2: '#ffcdd2', // 较浅的红色
                            4: '#ef9a9a', // 中等浅红色
                            10: '#e57373', // 鲜艳的红色
                            20: '#ef5350', // 较深的红色
                            30: '#c62828', // 深红色
                          }}
                          
                          
                        rectRender={(props, data) => {
                            // if (!data.count) return <rect {...props} />;
                            const tooltipContent = `Date: ${data.date}, Count: ${data.count || 0}`;
                            return (
                                <Tooltip placement="top" content={tooltipContent}>
                                    <rect {...props} />
                                </Tooltip>
                            );
                        }}
                    />
                </Box>

            </div>
        </div>
    );
};

export default UserProfile;
