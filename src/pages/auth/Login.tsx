import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { signInWithEmailPassword, signUpWithEmailPassword, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const onLogin = async () => {
    setIsSubmitting(true);
    const { error } = await signInWithEmailPassword(email, password);
    setIsSubmitting(false);
    if (error) setError(error);
    else navigate(from, { replace: true });
  };

  const onSignup = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    const { error, message } = await signUpWithEmailPassword(email, password);
    setIsSubmitting(false);
    
    if (error) {
      setError(error);
    } else if (message) {
      setSuccess(message);
      setEmail("");
      setPassword("");
    } else {
      navigate(from, { replace: true });
    }
  };

  const onGoogle = async () => {
    setIsSubmitting(true);
    const { error } = await signInWithGoogle();
    setIsSubmitting(false);
    if (error) setError(error);
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <Card className="w-full max-w-sm bg-gradient-card border-border p-6">
        <h1 className="text-xl font-bold text-foreground mb-4">Entrar</h1>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          {success && <div className="text-sm text-green-600 bg-green-50 p-2 rounded">{success}</div>}
          <Button className="w-full bg-gradient-primary" disabled={isSubmitting} onClick={onLogin}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
          <Button className="w-full" variant="secondary" disabled={isSubmitting} onClick={onSignup}>
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
          <Button className="w-full" variant="outline" onClick={onGoogle} disabled={isSubmitting}>
            Entrar com Google
          </Button>
        </div>
      </Card>
    </div>
  );
}

