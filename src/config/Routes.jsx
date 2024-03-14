import React from 'react';

import { Route, Switch, useLocation } from 'react-router-dom';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Detail from '../pages/detail/Detail';
import Login from '../pages/Login';
import Footer from '../components/footer/Footer';
const Routes = () => {
    const location = useLocation();
    return (
        <>
        <Switch>
            <Route path='/login' component={Login} />
            <Route path='/:category/search/:keyword' component={Catalog} />
            <Route path='/:category/:id' component={Detail} />
            <Route path='/:category' component={Catalog} />
            <Route path='/' exact component={Home} />
        </Switch>
        {location.pathname !== '/login' && <Footer />}
    </>

    );
}

export default Routes;
