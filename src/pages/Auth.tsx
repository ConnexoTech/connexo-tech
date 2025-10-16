import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Footer } from "@/components/Footer";
import logoFull from "@/assets/logo-full.png";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { signUp, signIn, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic client-side validation
    if (!email || !password) {
      toast({
        title: t("common.error"),
        description: "Email and password are required",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast({
        title: t("common.error"),
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("auth.accountCreated"),
        description: t("auth.welcomeMessage").replace("{username}", email.split('@')[0]),
      });
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast({
        title: t("common.error"),
        description: "Email and password are required",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("auth.welcomeBackMessage"),
        description: t("auth.successLogin"),
      });
      navigate("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with Language Selector */}
      <div className="w-full flex justify-end p-3 sm:p-4">
        <LanguageSelector />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="login" className="text-sm sm:text-base py-2">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm sm:text-base py-2">{t("auth.signup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">{t("auth.welcomeBack")}</CardTitle>
                  <CardDescription className="text-sm">{t("auth.welcomeDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm">{t("auth.email")}</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm">{t("auth.password")}</Label>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <Button type="submit" className="w-full text-sm sm:text-base" disabled={isLoading}>
                      {isLoading ? t("auth.loggingIn") : t("auth.logIn")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl">{t("auth.createAccount")}</CardTitle>
                  <CardDescription className="text-sm">{t("auth.createAccountDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <form onSubmit={handleSignUp} className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm">{t("auth.email")}</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm">{t("auth.password")}</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <Button type="submit" className="w-full text-sm sm:text-base" disabled={isLoading}>
                      {isLoading ? t("auth.creatingAccount") : t("auth.createAccountButton")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer with Logo */}
      <div className="w-full pb-4 sm:pb-6">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <img src={logoFull} alt="Connexo" className="h-8 sm:h-10 opacity-80" />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Auth;