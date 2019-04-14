import React from 'react';

import { BrowserRouter, Route , Switch } from 'react-router-dom';

import Main from './pages/Main';
import Box from './pages/Box';

const route = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Main}  />
            <Route path="/boxes/:id"  component={Box} />
        </Switch>
    </BrowserRouter>
);


export default route;