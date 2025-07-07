import { AuthCard } from "@/components/auth/auth-card";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen landing-background landing-theme overflow-y-scroll">
      <div className="animate-in fade-in zoom-in-95 duration-1000 py-20">
        <AuthCard type="login" />
      </div>
    </div>
  );
}
