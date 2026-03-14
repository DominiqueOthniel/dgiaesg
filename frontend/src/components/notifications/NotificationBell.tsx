import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, ExternalLink, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const TYPE_COLORS: Record<string, string> = {
    application_submitted: "bg-blue-500",
    application_status: "bg-emerald-500",
    auditor_assigned: "bg-indigo-500",
    document_uploaded: "bg-amber-500",
    comment: "bg-purple-500",
    message: "bg-brand-primary",
    certification_expiry: "bg-red-500",
    system: "bg-slate-500",
};

const NotificationBell = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const { data } = await api.get("/notifications");
            setNotifications(data.data || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen]);

    const handleMarkAsRead = async (notifId: string) => {
        try {
            await api.put(`/notifications/${notifId}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleNotificationClick = (notif: any) => {
        if (!notif.isRead) handleMarkAsRead(notif._id);
        if (notif.link) {
            navigate(notif.link);
            setIsOpen(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100]"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-brand-accent" />
                                <h3 className="font-bold text-sm text-brand-secondary">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount} nouvelle{unreadCount !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] font-bold text-brand-accent hover:underline uppercase tracking-widest"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5 inline mr-1" />
                                        Tout lire
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[60vh] overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-10">
                                    <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400">Aucune notification</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={cn(
                                            "px-5 py-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3",
                                            !notif.isRead && "bg-brand-primary/[0.02]"
                                        )}
                                    >
                                        <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", notif.isRead ? "bg-transparent" : TYPE_COLORS[notif.type] || "bg-brand-primary")} />
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-sm", notif.isRead ? "text-slate-600" : "text-brand-secondary font-semibold")}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-slate-300 mt-1">
                                                {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        {notif.link && (
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
