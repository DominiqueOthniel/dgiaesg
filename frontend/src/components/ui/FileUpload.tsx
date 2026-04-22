import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';

interface FileUploadProps {
    onUploadSuccess: (url: string) => void;
    defaultValue?: string;
    label?: string;
}

export const FileUpload = ({ onUploadSuccess, defaultValue, label }: FileUploadProps) => {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Le fichier est trop volumineux (max 2MB)');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Format non supporté (JPG, PNG, WEBP uniquement)');
            return;
        }

        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('image', file);

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setUploadProgress(percentCompleted);
                },
            });

            const uploadedUrl = response.data.data;
            // API returns relative URL like /uploads/filename. We need to prepend the API base or serve from host.
            // Assuming the frontend service/api config handles the base URL.
            // For now, let's store the full path or relative path consistently.
            onUploadSuccess(uploadedUrl);
            toast.success('Téléchargement réussi');
        } catch (error: any) {
            console.error('Upload failed', error);
            toast.error('Échec du téléchargement');
            setPreview(defaultValue || null);
        } finally {
            setIsUploading(false);
        }
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onUploadSuccess('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">{label}</label>}

            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-3xl transition-all overflow-hidden",
                    preview ? "border-emerald-500/20 bg-emerald-50/10" : "border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-forest/10",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                />

                <div className="p-8 flex flex-col items-center justify-center min-h-[160px]">
                    {preview ? (
                        <div className="relative group/preview">
                            <img
                                src={preview.startsWith('data:') ? preview : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${preview}`}
                                alt="Preview"
                                className="h-40 w-full object-cover rounded-xl shadow-2xl transition-all duration-500"
                            />
                            {!isUploading && (
                                <button
                                    onClick={clearSelection}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-gray-400 group-hover:text-forest transition-colors" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-forest transition-colors">Cliquez pour téléverser</p>
                                <p className="text-[8px] font-medium text-gray-300 uppercase tracking-[0.2em] mt-2">PNG, JPG ou WEBP (Max. 2MB)</p>
                            </div>
                        </div>
                    )}

                    {isUploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                            <div className="w-full max-w-[120px] h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                <div
                                    className="h-full bg-indigo-action transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-[9px] font-black text-indigo-action uppercase tracking-widest animate-pulse">
                                {uploadProgress}% - Synchronisation...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
