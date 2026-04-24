import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { toast } from "react-hot-toast";

function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { identifier, password });
      login(response.data.token);
      toast.success(t("auth.login.toast_success"));

      const userRole = response.data.data.role;
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("auth.login.toast_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/20"
          >
            <ShieldCheck className="w-10 h-10 text-accent" />
          </motion.div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-6 italic italic">DGIAESG</h2>
          <p className="text-primary-foreground/60 text-base leading-relaxed font-medium">
            {t("auth.login.brand_tagline")}
          </p>
          <div className="mt-12 flex justify-center gap-4 opacity-30">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/50" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-10 left-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            {t("auth.login.back")}
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">DGIAESG</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 uppercase italic">
              {t("auth.login.title")}
            </h1>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" /> {t("auth.login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {t("auth.login.identifier_label")}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder={t("auth.login.identifier_placeholder")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {t("auth.login.password_label")}
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-muted border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t("auth.login.submit")} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <Link to="/signup" className="text-primary hover:text-accent transition-colors">
              {t("auth.login.create_account")}
            </Link>
            <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("auth.login.forgot")}
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-6 opacity-20 hidden lg:block">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">{t("auth.login.footer_version")}</p>
      </div>
    </div>
  );
}

export default LoginPage;
