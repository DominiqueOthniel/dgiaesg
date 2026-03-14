import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface ChatPanelProps {
    applicationId: string;
}

const ChatPanel = ({ applicationId }: ChatPanelProps) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get(`/messages/${applicationId}`);
            setMessages(data.data || []);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            // Poll every 5 seconds for new messages
            pollRef.current = setInterval(fetchMessages, 5000);
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [isOpen, applicationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            const { data } = await api.post(`/messages/${applicationId}`, {
                content: newMessage.trim(),
            });
            setMessages((prev) => [...prev, data.data]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all",
                    isOpen
                        ? "bg-slate-700 text-white"
                        : "bg-brand-primary text-white hover:bg-brand-secondary hover:scale-110"
                )}
            >
                <MessageSquare className="w-6 h-6" />
                {messages.length > 0 && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {messages.length}
                    </span>
                )}
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
                        style={{ maxHeight: "70vh" }}
                    >
                        {/* Header */}
                        <div className="bg-brand-secondary text-white px-6 py-4 flex items-center gap-3">
                            <MessageSquare className="w-5 h-5" />
                            <div>
                                <h3 className="font-bold text-sm">Discussion du dossier</h3>
                                <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">
                                    {messages.length} message{messages.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px] bg-slate-50">
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-10">
                                    <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400">Aucun message. Commencez la discussion !</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isMine = msg.senderId === user?.id;
                                    return (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn("flex", isMine ? "justify-end" : "justify-start")}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                                                    isMine
                                                        ? "bg-brand-primary text-white rounded-br-sm"
                                                        : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm"
                                                )}
                                            >
                                                {!isMine && (
                                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-60">
                                                        {msg.senderName} · {msg.senderRole}
                                                    </p>
                                                )}
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                <p className={cn("text-[9px] mt-1", isMine ? "text-white/50" : "text-slate-300")}>
                                                    {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-slate-100 bg-white">
                            <div className="flex items-end gap-2">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Votre message..."
                                    rows={1}
                                    className="flex-1 resize-none text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!newMessage.trim() || sending}
                                    className="h-10 w-10 rounded-xl bg-brand-primary text-white p-0 flex items-center justify-center shrink-0"
                                >
                                    {sending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatPanel;
