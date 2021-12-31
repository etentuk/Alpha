import React, { FC } from 'react';
import './App.css';
import AppRoutes from './routes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const App: FC = () => <AppRoutes />;

export default App;
