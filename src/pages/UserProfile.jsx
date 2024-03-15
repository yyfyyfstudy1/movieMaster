import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage 方法
import { storage } from '../api/firebaseConfig'; // 假设你的 Firebase 配置
import '../components/hero-slide/hero-slide.scss';
import bg from '../assets/footer-bg.jpg';
import logoImage from '../assets/tmovie.png'
import {updateProfile} from 'firebase/auth';
import ActivityGrid from '../components/activity-grid/ActivityGrid'

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
                    <Button variant="contained" onClick={handleUpdateProfile}>Update Profile</Button>

                    <ActivityGrid  />
                </Box>

            </div>
        </div>
    );
};

export default UserProfile;
