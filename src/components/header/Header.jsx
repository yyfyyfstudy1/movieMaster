import React, { useRef, useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import './header.scss';

import logo from '../../assets/tmovie.png';
import { useSelector } from 'react-redux';


const headerNav = [
    {
        display: 'Home',
        path: '/'
    },
    {
        display: 'Movies',
        path: '/movie'
    },
    {
        display: 'TV Series',
        path: '/tv'
    },
    {
        display: 'Login',
        path: '/login'
    }
];

const Header = () => {

    const { pathname } = useLocation();
    const headerRef = useRef(null);
     // 从Redux Store获取当前用户状态
     const currentUser = useSelector(state => state.user.currentUser);
     console.log(currentUser)
     console.log(">??????????/")
     // 根据用户登录状态动态调整菜单项
     const updatedHeaderNav = headerNav.map(nav => {
         if (nav.display === "Login" && currentUser) {
             return { ...nav, display: "Profile", path: "/profile" }; 
         }
         return nav;
     });
 
    const active = updatedHeaderNav.findIndex(e => e.path === pathname);

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink');
            } else {
                headerRef.current.classList.remove('shrink');
            }
        }
        window.addEventListener('scroll', shrinkHeader);
        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        };
    }, []);

    return (
        <div ref={headerRef} className="header">
            <div className="header__wrap container">
                <div className="logo">
                    <img src={logo} alt="" />
                    <Link to="/">MovieEveryday</Link>
                </div>
                <ul className="header__nav">
                    {
                        updatedHeaderNav.map((e, i) => (
                            <li key={i} className={`${i === active ? 'active' : ''}`}>
                                <Link to={e.path}>
                                    {e.display}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default Header;
