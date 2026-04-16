import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { identifier, password });
      login(response.data.token);
      const userRole = response.data.data.role;
      setTimeout(() => navigate(userRole === "admin" ? "/admin" : "/"), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentification échouée");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--brand-emerald)/0.3),transparent_70%)]" />
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl font-extrabold text-primary-foreground tracking-tight mb-4">
            Co-op Label
          </h2>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm mx-auto">
            Plateforme panafricaine de certification et de promotion de l'excellence coopérative et entrepreneuriale.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">Co-op Label</span>
          </div>

          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Accédez à votre espace de certification
          </p>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email ou nom d'utilisateur</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="nom@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Créer un compte
            </Link>
            <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
