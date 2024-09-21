'use client';

import { useEffect, useState } from 'react';

const Notification = ({ message, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed z-50 p-4 text-black bg-white border rounded shadow-lg border-neutral-400 top-20 right-4">
            <p>{message}</p>
        </div>
    );
};

export default Notification;
