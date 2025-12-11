import React from 'react';
import { createRoot } from 'react-dom/client';
import DashBoard from './DashBoard';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<DashBoard />);
    root.unmount();
});
