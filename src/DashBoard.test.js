import React from 'react';
import ReactDOM from 'react-dom';
import DashBoard from './DashBoard';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DashBoard />, div);
});
