import React from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void | Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <input
            type="file"
            onChange={handleChange}
            accept="*"
        />
    );
};

export default FileUpload;