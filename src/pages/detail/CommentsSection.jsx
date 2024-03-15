import React, { useState, useEffect } from 'react';
import { Avatar, Rating, Button, Card, CardContent, CardHeader, TextField, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // 引入Link组件
import { database } from '../../api/firebaseConfig';
import { ref, push, set, onValue } from 'firebase/database';
import { Pagination } from '@mui/material';

const mockComments = [
    {
        id: 1,
        user: {
            name: "John Doe",
            avatar: "/static/images/avatar/1.jpg", // 替换为实际图片路径
        },
        comment: "Incredible movie! Highly recommend watching it.",
        rating: 5,
    },
    {
        id: 2,
        user: {
            name: "Jane Smith",
            avatar: "/static/images/avatar/2.jpg",
        },
        comment: "Wasn't what I expected, but still enjoyable.",
        rating: 3,
    },
    // 可以根据需要添加更多评论
];


const CommentsSection = ({ movieId }) => {
    // 从Redux Store获取当前用户状态
    const currentUser = useSelector(state => state.user.currentUser);

    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(2);
    const [comments, setComments] = useState([]); // 新增状态用于存储评论数据
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const commentsPerPage = 5; // 每页评论数量


    // 计算当前页的评论
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    // 计算总页数
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    // 更改页码
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // 监听数据库中评论的变化
    useEffect(() => {
        const commentsRef = ref(database, 'comments/' + movieId);
        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedComments = [];
            for (const key in data) {
                loadedComments.push({
                    id: key,
                    ...data[key],
                });
            }
            setComments(loadedComments);
        });
    }, [movieId]); // 依赖项列表中包含 movieId，确保切换电影时更新评论列表

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting new comment and rating: ", newComment, newRating);


        const commentRef = ref(database, 'comments/' + movieId);
        const newCommentRef = push(commentRef);
        set(newCommentRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName,
            comment: newComment,
            userAvatar: currentUser.photoURL,
            rate: newRating,
            publishedAt: new Date().toISOString(),
        });

        setNewComment("");
        setNewRating(2);

    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Comments
            </Typography>
            {/* 评论列表 */}

            {currentComments.map((comment) => (
                <Card key={comment.id} sx={{ mb: 2 }}>
                    <CardHeader
                        avatar={<Avatar src={comment.userAvatar || '/static/images/avatar/default.jpg'} />}
                        title={comment.userName}
                        subheader={
                            <>
                                <Rating name="read-only" value={comment.rate} readOnly />
                                <Typography variant="body2" color="textSecondary">
                                    {new Date(comment.publishedAt).toLocaleString()}
                                </Typography>
                            </>
                        }
                    />
                    <CardContent>
                        <Typography variant="body2">{comment.comment}</Typography>
                    </CardContent>
                </Card>
            ))}






            {/* 评论提交表单 */}
            {currentUser ? (
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Leave your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Box display="flex" alignItems="center" gap={2}>
                        <Rating
                            name="simple-controlled"
                            value={newRating}
                            onChange={(event, newValue) => {
                                setNewRating(newValue);
                            }}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Box>
                </form>
            ) : (
                <Typography variant="body1" sx={{ color: 'red', textDecoration: 'underline' }}>
                    <Link to="/login" style={{ color: 'inherit' }}>Please log in to leave a comment.</Link>
                </Typography>
            )}

            {/* 分页控件 */}
            <Box my={2} display="flex" justifyContent="center">
                <Pagination count={totalPages} page={currentPage} onChange={(e, value) => paginate(value)} />
            </Box>
        </div>
    );
};


export default CommentsSection;
