import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/api";
import { AVATARS, API_PATHS } from "@/constants";
import { STORAGE_KEYS } from "@/lib/utils";
import { getUserId } from "@/lib/userId";

export function useUserProfile() {
    const [userProfile, setUserProfile] = useState<{ username: string; avatar: string } | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [inputUsername, setInputUsername] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [userRank, setUserRank] = useState<number | null>(null);

    useEffect(() => {
        const savedName = localStorage.getItem(STORAGE_KEYS.USERNAME);
        const savedAvatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
        if (savedName && savedAvatar) {
            setUserProfile({ username: savedName, avatar: savedAvatar });
            setInputUsername(savedName);
            setSelectedAvatar(savedAvatar);
        }
    }, []);

    useEffect(() => {
        const checkUsername = async () => {
            if (!inputUsername.trim() || inputUsername === userProfile?.username) {
                setUsernameAvailable(null);
                return;
            }

            setIsCheckingUsername(true);
            try {
                const res = await fetch(`${API_PATHS.USER}?username=${encodeURIComponent(inputUsername)}`);
                const rawData = await res.json();
                setUsernameAvailable(rawData.available);
            } catch (error) {
                console.error("Failed to check username:", error);
                setUsernameAvailable(null);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [inputUsername, userProfile?.username]);

    const saveProfile = useCallback(async (onSuccess?: () => void) => {
        if (!inputUsername.trim()) return;

        const userId = getUserId();
        const newProfile = { username: inputUsername, avatar: selectedAvatar };

        try {
            await api.saveUserProfile({ userId, ...newProfile });
            setUserProfile(newProfile);
            localStorage.setItem(STORAGE_KEYS.USERNAME, inputUsername);
            localStorage.setItem(STORAGE_KEYS.AVATAR, selectedAvatar);
            setShowProfileModal(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Failed to save profile:", err);
            throw err;
        }
    }, [inputUsername, selectedAvatar]);

    const handleClearCache = useCallback(() => {
        if (confirm("This will clear your local sessions and reset your profile. Your verified actions will remain on the server. Proceed?")) {
            localStorage.removeItem(STORAGE_KEYS.USERNAME);
            localStorage.removeItem(STORAGE_KEYS.AVATAR);
            localStorage.removeItem(STORAGE_KEYS.HIDE_ONBOARDING);
            window.location.reload();
        }
    }, []);

    const handleDeleteAccount = useCallback(async () => {
        if (confirm("CRITICAL: This will permanently delete your account and all your verified actions. This cannot be undone. Are you absolutely sure?")) {
            try {
                await api.deleteAccount(getUserId());
                localStorage.clear();
                window.location.reload();
            } catch (err) {
                console.error("Failed to delete account:", err);
                alert("Failed to delete account. Please try again later.");
            }
        }
    }, []);

    return {
        userProfile,
        setUserProfile,
        showProfileModal,
        setShowProfileModal,
        inputUsername,
        setInputUsername,
        selectedAvatar,
        setSelectedAvatar,
        isCheckingUsername,
        usernameAvailable,
        saveProfile,
        handleClearCache,
        handleDeleteAccount,
        userRank,
        setUserRank
    };
}
