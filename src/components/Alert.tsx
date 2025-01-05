import React, { useEffect } from 'react';
import { XCircle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '@/app/store/appStore';


const Alert = () => {

    const { message, type, duration, setAlert } = useAppStore(state => state)
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [duration]);

    const onClose = () => {
        setAlert({ message: "" })
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            case 'error':
                return <XCircle className="h-6 w-6 text-red-500" />;
            case 'alert':
                return <AlertCircle className="h-6 w-6 text-yellow-500" />;
            default:
                return null;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100';
            case 'error':
                return 'bg-red-100';
            case 'alert':
                return 'bg-yellow-100';
            default:
                return '';
        }
    };

    return (
        <div className={`flex items-center p-4 mb-4 text-sm rounded-lg ${getBgColor()}`} role="alert">
            {getIcon()}
            <div className="ml-3">{message}</div>
            <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-200 inline-flex h-8 w-8">
                <span className="sr-only">Close</span>
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Alert;