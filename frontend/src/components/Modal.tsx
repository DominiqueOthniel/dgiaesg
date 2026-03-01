import { Button } from './ui/Button';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal = ({ isOpen, onClose, title, children, width = 'md' }: ModalProps) => {
    if (!isOpen) return null;

    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Content */}
            <div
                className={cn(
                    "relative bg-white rounded-[3rem] shadow-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300",
                    widthClasses[width]
                )}
            >
                <div className="px-8 pt-8 flex items-center justify-between">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">
                        {title}
                    </h2>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-10 h-10 p-0 rounded-2xl border-gray-100 hover:bg-gray-50 shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};
