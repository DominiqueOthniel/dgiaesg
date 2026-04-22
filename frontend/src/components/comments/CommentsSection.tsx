import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";

interface CommentsSectionProps {
    targetType: "news" | "review";
    targetId: string;
}

const CommentsSection = ({ targetType, targetId }: CommentsSectionProps) => {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [targetType, targetId]);

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/comments?targetType=${targetType}&targetId=${targetId}`);
            setComments(data.data || []);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        if (!newComment.trim()) return;
        setPosting(true);
        try {
            const { data } = await api.post("/comments", {
                targetType,
                targetId,
                content: newComment.trim(),
            });
            setComments((prev) => [data.data, ...prev]);
            setNewComment("");
            toast.success("Commentaire publié !");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erreur lors de la publication");
        } finally {
            setPosting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await api.delete(`/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            toast.success("Commentaire supprimé");
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-brand-secondary flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-accent" />
                Commentaires ({comments.length})
            </h3>

            {/* Comment Input */}
            {isAuthenticated ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-bold text-brand-secondary">{user?.name}</span>
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Partagez votre avis..."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handlePost}
                            disabled={!newComment.trim() || posting}
                            isLoading={posting}
                            className="h-10 px-6 rounded-xl bg-brand-primary text-white text-xs font-bold uppercase tracking-widest"
                        >
                            <Send className="w-3.5 h-3.5 mr-2" />
                            Publier
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
                    <p className="text-sm text-slate-500">
                        <a href="/auth/login" className="text-brand-primary font-bold hover:underline">Connectez-vous</a> pour laisser un commentaire.
                    </p>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">Aucun commentaire pour le moment.</p>
                    <p className="text-xs text-slate-300 mt-1">Soyez le premier à réagir !</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {comments.map((comment, idx) => (
                            <motion.div
                                key={comment._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="bg-white rounded-2xl border border-slate-200/60 p-5 group hover:border-brand-primary/20 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 flex items-center justify-center text-brand-primary font-bold text-xs shrink-0">
                                            {comment.userName?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-brand-secondary">{comment.userName}</span>
                                                <span className="text-[10px] text-slate-300">
                                                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1.5 whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                    </div>

                                    {/* Delete button for admin or author */}
                                    {(user?.role === "admin" || user?.id === (comment.userId?._id || comment.userId)) && (
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
