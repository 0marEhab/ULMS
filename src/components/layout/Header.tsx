import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    student?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    onLogout?: () => void;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    student,
    onLogout,
    className = ''
}) => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/dashboard');
    };

    return (
        <header className={`bg-white shadow-sm border-b sticky top-0 z-50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center">
                        <button
                            onClick={handleHomeClick}
                            className="flex items-center hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-lg">U</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">ULMS</h1>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={handleHomeClick}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </button>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            My Courses
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Grades
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Schedule
                        </a>
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center">
                        {student ? (
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-7a6 6 0 10-12 0v7" />
                                    </svg>
                                </button>

                                {/* User Profile */}
                                <div className="relative group">
                                    <button className="flex items-center text-sm">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                            <span className="text-blue-600 font-medium">
                                                {student.firstName[0]}{student.lastName[0]}
                                            </span>
                                        </div>
                                        <span className="hidden md:block text-gray-700 font-medium">
                                            {student.firstName} {student.lastName}
                                        </span>
                                        <svg className="ml-1 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile Settings
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Account Settings
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Help & Support
                                        </a>
                                        <hr className="my-1" />
                                        <button
                                            onClick={onLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                                    Login
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;