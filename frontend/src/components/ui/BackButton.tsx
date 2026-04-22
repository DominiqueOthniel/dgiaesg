import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-brand-primary font-bold text-[10px] uppercase tracking-widest mb-6"
        >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
            </div>
            Retourner à la page précédente
        </Button>
    );
}
