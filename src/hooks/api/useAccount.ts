import { useState, useCallback, useEffect } from "react";
import { callApi } from "@/lib/api";
import { API_ROUTES } from "@/lib/apiRoutes";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

// API response wrapper
interface MeApiResponse {
  user: UserProfile;
}

interface UseAccountResult {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAccount(): UseAccountResult {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await callApi<MeApiResponse>(API_ROUTES.me);
      setUser(response.user);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch user data");
      setError(error);
      console.error("[useAccount] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}

interface UpdateProfileData {
  email: string;
  first_name: string;
  last_name: string;
}

interface UseUpdateProfileResult {
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
}

export function useUpdateProfile(): UseUpdateProfileResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsUpdating(true);
    setError(null);

    try {
      await callApi(API_ROUTES.me, {
        method: "PUT",
        body: data as unknown as BodyInit,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update profile");
      setError(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateProfile,
    isUpdating,
    error,
  };
}

interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

interface UseChangePasswordResult {
  changePassword: (data: ChangePasswordData) => Promise<void>;
  isChanging: boolean;
  error: Error | null;
}

export function useChangePassword(): UseChangePasswordResult {
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    setIsChanging(true);
    setError(null);

    try {
      await callApi(API_ROUTES.mePassword, {
        method: "PUT",
        body: data as unknown as BodyInit,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to change password");
      setError(error);
      throw error;
    } finally {
      setIsChanging(false);
    }
  }, []);

  return {
    changePassword,
    isChanging,
    error,
  };
}
