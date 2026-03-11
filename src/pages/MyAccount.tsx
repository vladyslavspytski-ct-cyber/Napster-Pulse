import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectronPageWrapper from "@/components/electron/ElectronPageWrapper";
import { useIsElectron } from "@/lib/electron";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAccount, useUpdateProfile, useChangePassword } from "@/hooks/api/useAccount";

const MyAccount = () => {
  const navigate = useNavigate();
  const isDesktop = useIsElectron();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  // Redirect to home when logged out
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // Account data
  const { user, isLoading: isLoadingUser } = useAccount();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { changePassword, isChanging } = useChangePassword();

  // Tab state
  const [activeTab, setActiveTab] = useState("personal");

  // Personal Information form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasProfileChanges, setHasProfileChanges] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
    currentPassword?: string;
  }>({});

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);

  // Check for profile changes
  useEffect(() => {
    if (user) {
      const changed =
        firstName !== (user.first_name || "") ||
        lastName !== (user.last_name || "");
      setHasProfileChanges(changed);
    }
  }, [firstName, lastName, user]);

  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      await updateProfile({ email: user!.email, first_name: firstName, last_name: lastName });
      toast({
        title: "Profile updated successfully",
        description: "Your personal information has been saved.",
      });
      setHasProfileChanges(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: "Please try again later.",
      });
    }
  };

  // Validate password
  const validatePassword = (): boolean => {
    const errors: typeof passwordErrors = {};

    if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      await changePassword({ old_password: currentPassword, new_password: newPassword });
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to change password";
      if (message.toLowerCase().includes("incorrect") || message.toLowerCase().includes("invalid") || message.toLowerCase().includes("wrong")) {
        setPasswordErrors({ currentPassword: "Current password is incorrect" });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to change password",
          description: message,
        });
      }
    }
  };

  const isPasswordFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <ElectronPageWrapper>
      <div className={`min-h-screen flex flex-col bg-background ${isDesktop ? 'electron-page' : ''}`}>
        {!isDesktop && <Header />}

        <main className={`flex-1 ${isDesktop ? 'pt-6' : 'pt-24'} pb-16`}>
          <div className="section-container max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">My Account</h1>
              <p className="text-muted-foreground mt-1">Manage your profile and security settings.</p>
            </motion.div>

            {isLoadingUser ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Tabs List */}
                  <TabsList className="w-full h-12 p-1 mb-6 bg-muted/50 border border-border/50 rounded-xl">
                    <TabsTrigger
                      value="personal"
                      className="flex-1 h-full gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Personal Information</span>
                      <span className="sm:hidden">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="password"
                      className="flex-1 h-full gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      <Lock className="w-4 h-4" />
                      <span className="hidden sm:inline">Change Password</span>
                      <span className="sm:hidden">Password</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Contents */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {activeTab === "personal" && (
                        <div className="glass-card rounded-2xl p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                              <p className="text-xs text-muted-foreground">Update your name and contact details</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  name="firstName"
                                  autoComplete="given-name"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  placeholder="Enter your first name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  name="lastName"
                                  autoComplete="family-name"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  placeholder="Enter your last name"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                autoComplete="email"
                                value={user?.email || ""}
                                disabled
                                className="bg-muted/50 text-muted-foreground"
                              />
                              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <div className="pt-4">
                              <Button
                                onClick={handleSaveProfile}
                                disabled={!hasProfileChanges || isUpdating}
                              >
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save Changes"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "password" && (
                        <div className="glass-card rounded-2xl p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                              <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
                              <p className="text-xs text-muted-foreground">Update your password for security</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => {
                                  setCurrentPassword(e.target.value);
                                  if (passwordErrors.currentPassword) {
                                    setPasswordErrors((prev) => ({ ...prev, currentPassword: undefined }));
                                  }
                                }}
                                placeholder="Enter your current password"
                              />
                              {passwordErrors.currentPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.currentPassword}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  if (passwordErrors.newPassword) {
                                    setPasswordErrors((prev) => ({ ...prev, newPassword: undefined }));
                                  }
                                }}
                                placeholder="Enter your new password"
                              />
                              {passwordErrors.newPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.newPassword}</p>
                              )}
                              {!passwordErrors.newPassword && newPassword.length > 0 && newPassword.length < 8 && (
                                <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  if (passwordErrors.confirmPassword) {
                                    setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                                  }
                                }}
                                placeholder="Confirm your new password"
                              />
                              {passwordErrors.confirmPassword && (
                                <p className="text-xs text-destructive">{passwordErrors.confirmPassword}</p>
                              )}
                              {!passwordErrors.confirmPassword && confirmPassword.length > 0 && newPassword !== confirmPassword && (
                                <p className="text-xs text-muted-foreground">Passwords do not match</p>
                              )}
                            </div>

                            <div className="pt-4">
                              <Button
                                onClick={handleChangePassword}
                                disabled={!isPasswordFormValid || isChanging}
                              >
                                {isChanging ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  "Update Password"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </motion.div>
            )}
          </div>
        </main>

        {!isDesktop && <Footer />}
      </div>
    </ElectronPageWrapper>
  );
};

export default MyAccount;
