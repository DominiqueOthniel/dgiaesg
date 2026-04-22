import { useState, useEffect } from "react";
import { Award, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

interface DigitalBadgeProps {
    companyId: string;
    companyName: string;
    status: string;
}

export default function DigitalBadge({ companyId, companyName, status }: DigitalBadgeProps) {
    const [badgeData, setBadgeData] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "certified" && companyId) {
            fetchBadge();
        } else {
            setLoading(false);
        }
    }, [companyId, status]);

    const fetchBadge = async () => {
        try {
            const res = await api.get(`/certificates/badge/${companyId}`);
            setBadgeData(res.data?.data);
        } catch {
            // Badge not available
        } finally {
            setLoading(false);
        }
    };

    const copyEmbedCode = () => {
        if (badgeData?.embedCode) {
            navigator.clipboard.writeText(badgeData.embedCode);
            setCopied(true);
            toast.success("Code d'intégration copié !");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading || !badgeData || status !== "certified") return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden bg-white"
        >
            <div className="p-6">
                <div className="flex items-center gap-2 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <Award className="w-4 h-4" /> Badge Certifié - {companyName}
                </div>

                {/* Badge Preview */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                    <div className="relative z-10" dangerouslySetInnerHTML={{ __html: badgeData.svg }} />
                </div>

                <div className="space-y-3">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Affichez ce badge sur votre site web pour prouver votre certification.
                    </p>

                    <div className="flex gap-2">
                        <Button
                            onClick={copyEmbedCode}
                            variant="outline"
                            className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5 border-slate-200 py-3"
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? "Copié" : "Embed"}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
