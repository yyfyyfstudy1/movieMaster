import React, { useState, useEffect } from 'react';
import { Avatar, Button, TextField, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage 方法
import { storage } from '../api/firebaseConfig'; // 假设你的 Firebase 配置
import '../components/hero-slide/hero-slide.scss';
import bg from '../assets/footer-bg.jpg';
import logoImage from '../assets/tmovie.png'
import { updateProfile } from 'firebase/auth';
import Tooltip from '@uiw/react-tooltip';
import HeatMap from '@uiw/react-heat-map';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../api/firebaseConfig';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import '../scss/heatmap.scss'
import MovieCommentsTimeline  from '../components/time-line/TimeLine'


const UserProfile = () => {
    const currentUser = useSelector((state) => state.user.currentUser); // 获取当前用户信息
    const [userName, setUserName] = useState('');
    const [uid, setUid] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([]);
    // const value = [
    //     { date: '2016/01/11', count: 2 },
    //     { date: '2016/04/12', count: 20 },
    //     { date: '2016/05/01', count: 5 },
    //     { date: '2016/05/02', count: 5 },
    //     { date: '2016/05/03', count: 1 },
    //     { date: '2016/05/04', count: 11 },
    //     { date: '2016/05/08', count: 32 },
    // ];

    useEffect(() => {
        if (currentUser) {
            setUserName(currentUser.displayName || '');
            setUserEmail(currentUser.email || '');
            setAvatarUrl(currentUser.photoURL || '/path/to/default/avatar'); // 提供默认头像路径
            // 调用函数并处理结果
            fetchCommentsAndCount(currentUser.uid).then(value => {
                console.log(value);
                setValue(value)
                // 这里你可以处理value数组，如设置状态或其他操作
            });

            const fetchData = async () => {
                const commentsData = await fetchUserComments(currentUser.uid);

                console.log(commentsData)
                setItems(commentsData);
            };

            fetchData();
        }
    }, [currentUser]);



    // 获取用户评论的函数
    const fetchUserComments = async (uid) => {
        const userCommentsRef = doc(firestore, `userComments/${uid}`);
        const snapshot = await getDoc(userCommentsRef);

        if (!snapshot.exists()) {
            console.log("No data found!");
            return [];
        }

        const data = snapshot.data();

        const moviesWithComments = Object.entries(data).map(([movieId, movieData]) => ({
            ...movieData,
            movieId,
            // 假设每个评论都有一个publishedAt属性
            // 找出每部电影最新评论的时间
            latestCommentTime: movieData.comments.reduce((latest, comment) => {
              const commentTime = new Date(comment.publishedAt).getTime();
              return commentTime > latest ? commentTime : latest;
            }, 0),
          }));

           // 按最新评论时间对电影进行排序
  moviesWithComments.sort((a, b) => b.latestCommentTime - a.latestCommentTime);
        return moviesWithComments;
    };


    const fetchCommentsAndCount = async (uid) => {
        const userCommentsRef = doc(firestore, `userComments/${uid}`);
        try {
            const docSnapshot = await getDoc(userCommentsRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const countsByDate = {};

                Object.values(data).forEach(movie => {
                    movie.comments.forEach(comment => {
                        const date = new Date(comment.publishedAt).toISOString().split('T')[0].replace(/-/g, '/');
                        countsByDate[date] = (countsByDate[date] || 0) + 1;
                    });
                });

                const value = Object.entries(countsByDate).map(([date, count]) => ({
                    date,
                    count
                }));

                return value;
            } else {
                console.log("No comments found for user:", uid);
                return [];
            }
        } catch (error) {
            console.error("Error fetching comments: ", error);
            return [];
        }
    };




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
                        <Avatar src={avatarUrl} sx={{ width: 130, height: 130, mb: 2, cursor: 'pointer' }} />
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
                        style={{ margin: 40, color: 'white', '--rhm-rect-active': 'red', transform: 'scale(1.5)' }}
                        startDate={new Date('2024/01/01')}
                        // endDate={new Date('2016/06/01')}
                        // monthLabels={}
                        weekLabels={['Sun', '', 'Tue', '', 'Thu', '', 'Sat']}
                        space={4}
                        legendRender={() => null} // 这里设置为返回null，不渲染图例
                        rectProps={{
                            rx: 2
                        }}
                        panelColors={{
                            0: '#ffebee', // 很浅的红色
                            1: '#ffcdd2', // 较浅的红色
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



                    <MovieCommentsTimeline movieData={items}/>

                </Box>

            </div>
        </div>
    );
};

export default UserProfile;
