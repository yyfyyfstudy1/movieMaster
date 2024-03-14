import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, Chip } from '@mui/material'; import { Link } from 'react-router-dom';

import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import tmdbApi, { category, movieType, tvType } from '../api/tmdbApi';

const Home = () => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [keywords, setKeywords] = useState([
        "What's a good movie for a family movie night?", 
    "I need a laugh. Recommend a comedy, please.", 
    "Suggest a movie for someone who loves sci-fi.",
     "What are the best romantic movies to watch on a date?", 
     "Recommend a movie that will make me cry.", 
     "What's a good action movie for an adrenaline rush?", "Give me a movie that's visually stunning."]);


    // 从Redux Store获取当前用户状态
     const currentUser = useSelector(state => state.user.currentUser);
     console.log(currentUser)
     console.log(">??????????/")


    const axios = require('axios');
    // 使用axios创建一个实例，配置OpenAI API的基础URL和Headers
    const openAI = axios.create({
        baseURL: 'https://api.openai.com/v1/chat',
        headers: {
            'Authorization': `Bearer ` +  process.env.REACT_APP_OPENAI_API_KEY, // 替换为你的OpenAI API密钥
            'Content-Type': 'application/json',
        }
    });

    // 定义一个函数来发送请求到GPT-3.5 Turbo
    const fetchGPT35TurboResponse = async (messages) => {
        try {
            // 首先从OpenAI获取回复
            let response = await openAI.post('/completions', {
                model: 'gpt-3.5-turbo', // 使用GPT-3.5 Turbo模型
                messages: messages, // 提问或给出的提示文本数组
                temperature: 0.7,
                max_tokens: 150,
                n: 1,
                stop: null,
            });
    
            console.log("Response from GPT-3.5 Turbo: ", response.data.choices[0].message.content);
    
            // 使用得到的回复作为查询参数调用tmdbApi.search
            const searchResponse = await tmdbApi.search('movie', { params: { query: response.data.choices[0].message.content } });
    
            // 确保从这个函数返回tmdbApi.search的结果
            return searchResponse;
        } catch (error) {
            console.error("Error fetching response from GPT-3.5 Turbo: ", error);
            // 在错误情况下也返回undefined或特定错误信息
            return undefined;
        }
    };
    

    useEffect(() => {
        setOpen(true); // 页面加载时打开弹窗
    }, []);

    const handleChipClick = (keyword) => {
        setInputValue(keyword); // 将点击的关键词添加到输入框
    };

    const handleClose = () => {
        setOpen(false); // 关闭弹窗
    };
    const history = useHistory();
    const handleSubmit = () => {
        console.log(inputValue); // 处理提交逻辑
        setOpen(false); // 关闭弹窗

        const messages = [
            { "role": "system", "content": "You are a helpful assistant. Only reply to me with the name of the movie based on my prompts, and do not reply with other content." },
            { "role": "user", "content": inputValue },
        ]
        fetchGPT35TurboResponse(messages)
            .then(GPTreply => {
                console.log(GPTreply.results[0].id);
                // 执行页面跳转逻辑，到电影详情页面
                history.push(`/movie/${GPTreply.results[0].id}`);  
            })
            .catch(error => {
                console.error("Error fetching GPT-3.5 Turbo response: ", error);
            });


    };

    return (
        <>
            <HeroSlide />
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                <h1>Hello! <span style={{ color: "red" }}>{currentUser.displayName || "Stranger"}</span> try to get a movie !</h1>


                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="What do you want to watch today?"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)} // 这里更新了inputValue的值
                    />
                    <div style={{ marginTop: '20px' }}>
                        {keywords.map((keyword, index) => (
                            <Chip
                                key={index}
                                label={keyword}
                                onClick={() => handleChipClick(keyword)}
                                style={{ margin: '5px', border: '1px solid white' }}
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary">
                        Get your daily movie ! ! !
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="container">
                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Trending Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.popular} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Top Rated Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.top_rated} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Trending TV</h2>
                        <Link to="/tv">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.tv} type={tvType.popular} />
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Top Rated TV</h2>
                        <Link to="/tv">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.tv} type={tvType.top_rated} />
                </div>
            </div>
        </>
    );
}

export default Home;
