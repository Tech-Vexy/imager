import React from 'react';
import {Share} from 'lucide-react';

// @ts-ignore
const ShareButton = ({title, text, url}) => {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.log('Error sharing content:', error);
            }
        } else {
            alert('Web Share API is not supported in your browser');
        }
    };

    return (
        <button
            onClick = {handleShare}
            className = "flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
            <Share className = "mr-2"
                   size = {18}
            />
            Share
        </button>
    )
        ;
};

export default ShareButton;
