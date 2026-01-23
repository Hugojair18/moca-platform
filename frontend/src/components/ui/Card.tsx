import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`bg-white rounded-xl border border-brand-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-brand-50">
                    <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
