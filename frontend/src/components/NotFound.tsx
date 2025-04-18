import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-orange-500">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;