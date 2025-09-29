import React from 'react';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    student?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    student,
    onLogout
}) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header student={student} onLogout={onLogout} />
            <main>{children}</main>
        </div>
    );
};

export default Layout;