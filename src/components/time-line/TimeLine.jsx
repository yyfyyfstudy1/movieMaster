import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../../scss/heatmap.scss'
import { FaStar } from 'react-icons/fa';

const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => <FaStar key={i} />);
};

const MovieCommentsTimeline = ({ movieData }) => {
    return (
        <VerticalTimeline>
            {Object.entries(movieData).map(([movieId, movie]) => (
                <VerticalTimelineElement
                    key={movieId}
                    contentStyle={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid #ddd', 
                    width: '40%', // 设置卡片宽度为容器宽度的75%
                    }}
                    iconStyle={{ background: '#c62828', color: '#fff' }}
                >
                    <img
                        src={'https://image.tmdb.org/t/p/original/'+movie.imgUrl}
                        alt={movie.movieTitle}
                        style={{
                            maxWidth: '50%',
                            height: 'auto',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginBottom: '15px'
                        }}
                    />
                    <h3 className="vertical-timeline-element-title">{movie.movieTitle}</h3>
                    {movie.comments.map((comment, index, array) => (
                        <div key={index} style={{
                            wordBreak: 'break-word', // 确保评论在需要时可以换行
                            marginBottom: index < array.length - 1 ? '10px' : '0', // 为最后一条评论之前的每条评论添加底部外边距
                            borderBottom: index < array.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : 'none', // 为最后一条评论之前的每条评论添加分隔线
                            paddingBottom: index < array.length - 1 ? '10px' : '0', // 为最后一条评论之前的每条评论添加底部内边距
                        }}>
                            <p>{comment.comment}</p>
                            <div style={{ color: 'yellow',marginTop:5 }}>
                                {renderStars(comment.rate)}
                            </div>

                            <p style={{ color: '#c62828' }}>Post: {new Date(comment.publishedAt).toLocaleString()}</p>
                        </div>
                    ))}
                </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
    );
};

export default MovieCommentsTimeline;
