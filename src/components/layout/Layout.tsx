import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
    // Mock student data - in a real app, this would come from context or state management
    const student = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.edu'
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header student={student} onLogout={handleLogout} />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;