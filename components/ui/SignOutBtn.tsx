import { auth } from '@/services/firebaseConfig';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, Button } from 'react-native';

export default function SignOutButton() {
    const router = useRouter();

    // Function to handle sign out
    const handleSignOut = async (
        onSuccess?: () => void,
        onError?: (err: any) => void
    ) => {
        try {
            await signOut(auth);
            if (onSuccess) onSuccess();
        } catch (error) {
            if (onError) onError(error);
        }
    };

    const signOutUser = async () => {
        await handleSignOut(
            () => {
                // Success: Go back to root/index (role selector)
                router.replace('/');
            },
            (error) => {
                Alert.alert('Sign Out Failed', error.message || String(error));
            }
        );
    };

    return (
        <Button
            title="Sign Out"
            color="#e74c3c"
            onPress={signOutUser}
            accessibilityLabel="Sign out of your account"
        />
    );
}
