
// app/components/GoogleSignInButton.tsx
import { auth, firestoreDb } from '@/services/firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { UserProfile } from '@/types/user';

import * as AuthSession from 'expo-auth-session';

// Only complete auth session for non-web platforms
if (Platform.OS !== 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
console.log('Generated Redirect URI (Tunnel Mode):', redirectUri);

export default function GoogleSignInButton() {
    const EXPO_CLIENT_ID = Constants.expoConfig?.extra?.GOOGLE_EXPO_CLIENT_ID;
    const IOS_CLIENT_ID = Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID;
    const ANDROID_CLIENT_ID =
        Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID;
    const WEB_CLIENT_ID = Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID;

    // console.log('Google OAuth IDs:', {
    //     EXPO_CLIENT_ID,
    //     IOS_CLIENT_ID,
    //     ANDROID_CLIENT_ID,
    //     WEB_CLIENT_ID,
    //     platform: Platform.OS,
    // });

    if (__DEV__) {
        const missing = [
            !EXPO_CLIENT_ID && 'GOOGLE_EXPO_CLIENT_ID',
            !IOS_CLIENT_ID && 'GOOGLE_IOS_CLIENT_ID',
            !ANDROID_CLIENT_ID && 'GOOGLE_ANDROID_CLIENT_ID',
            !WEB_CLIENT_ID && 'GOOGLE_WEB_CLIENT_ID',
        ].filter(Boolean);
        if (missing.length) {
            console.warn(`⚠️ Missing Google OAuth IDs: ${missing.join(', ')}`);
        }
    }

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const redirectUri = `https://auth.expo.io/@kariemgerges/teach-me`;

    // For native platforms, use expo-auth-session
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: EXPO_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: 'id_token',
        // ...(Platform.OS === 'android' && {
        //     redirectUri: `${Constants.linkingUri}/--/`,
        // }),
    });

    // Function to create user profile in Firestore
    const createUserProfile = async (user: any) => {
        const { uid, displayName, email } = user;
        const userRef = doc(firestoreDb, 'users', uid);
        const snap = await getDoc(userRef);

        const profile: UserProfile = {
            uid,
            type: 'parent',
            name: displayName ?? 'Unknown User',
            email: email ?? '',
            createdAt: Date.now(),
            lastLogin: Date.now(),
            onboardingComplete: false,
            profileCompleted: false,
            isActive: true,
            settings: {
                language: 'en',
                darkMode: false,
                accessibility: {
                    textToSpeech: false,
                    colorContrast: false,
                },
            },
            provider: 'google',
            childrenIds: [],
            classroomIds: [],
        };

        if (snap.exists()) {
            console.log('User exists, updating lastLogin...');
            await setDoc(
                userRef,
                { lastLogin: serverTimestamp() },
                { merge: true }
            );
        } else {
            console.log('New user, creating profile...');
            await setDoc(userRef, profile);
        }
    };

    // Web-specific Google sign-in using Firebase directly
    const handleWebSignIn = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Starting web-based Google sign-in...');

            // Create Google Auth Provider
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            // Set custom parameters
            provider.setCustomParameters({
                prompt: 'select_account',
            });

            console.log('Attempting Firebase signInWithPopup...');
            const result = await signInWithPopup(auth, provider);
            console.log('Sign-in successful:');

            await createUserProfile(result.user);

            console.log('Profile created/updated, navigating...');
            router.replace('/(tabs)');
        } catch (err: any) {
            console.error('Web sign-in error:', err);

            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in was cancelled.');
            } else if (err.code === 'auth/popup-blocked') {
                setError(
                    'Pop-up was blocked. Please allow pop-ups and try again.'
                );
            } else if (err.code === 'auth/network-request-failed') {
                setError(
                    'Network error. Please check your connection and try again.'
                );
            } else if (
                err.code === 'auth/account-exists-with-different-credential'
            ) {
                const email = err.customData?.email;
                if (email) {
                    try {
                        const methods = await fetchSignInMethodsForEmail(
                            auth,
                            email
                        );
                        setError(
                            `Email already in use. Try signing in with: ${
                                methods[0] || 'another method'
                            }`
                        );
                    } catch (fetchError) {
                        console.error(
                            'Error fetching sign-in methods:',
                            fetchError
                        );
                        setError(
                            'Email already in use with another sign-in method.'
                        );
                    }
                } else {
                    setError('Account exists with different credentials.');
                }
            } else {
                setError('Sign-in failed: ' + (err.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };

    // Native-specific sign-in handler
    const handleNativeSignIn = useCallback(async () => {
        if (!request) {
            setError('Google sign-in not ready.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            console.log('Starting native Google sign-in flow...');
            const result = await promptAsync({
                useProxy: true,
                showInRecents: false,
            });
            console.log('Native Google sign-in result:', result);
        } catch (e) {
            console.error('Prompt error:', e);
            setError('Failed to open Google sign-in.');
            setLoading(false);
        }
    }, [request, promptAsync]);

    // Main handler that determines which method to use
    const handlePress =
        Platform.OS === 'web' ? handleWebSignIn : handleNativeSignIn;

    // Handle the response from Google sign-in (only for native platforms)
    useEffect(() => {
        // Skip this effect for web since we handle auth differently
        if (Platform.OS === 'web') return;

        console.log('Response received:', response);

        if (!response) {
            return;
        }

        if (response.type === 'cancel') {
            console.log('User cancelled Google sign-in');
            setLoading(false);
            return;
        }

        if (response.type === 'error') {
            console.error('Google sign-in error:', response.error);
            setError('Google sign-in failed: ' + response.error?.message);
            setLoading(false);
            return;
        }

        if (response.type !== 'success' || !response.authentication) {
            console.log(
                'Unexpected response type or missing authentication:',
                response.type
            );
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const { idToken, accessToken } = response.authentication!;

                console.log('Processing authentication tokens:', {
                    hasIdToken: !!idToken,
                    hasAccessToken: !!accessToken,
                    idTokenLength: idToken?.length || 0,
                });

                if (!idToken) {
                    throw new Error('No ID token received from Google');
                }

                const credential = GoogleAuthProvider.credential(
                    idToken,
                    accessToken
                );

                console.log('Attempting Firebase sign-in...');
                const userCred = await signInWithCredential(auth, credential);
                console.log('Firebase sign-in successful:', userCred.user);

                await createUserProfile(userCred.user);

                console.log('Profile created/updated, navigating...');
                router.replace('/(tabs)');
            } catch (err: any) {
                console.error('Native sign-in error:', err);

                if (
                    err.code === 'auth/account-exists-with-different-credential'
                ) {
                    const email = err.customData?.email;
                    if (email) {
                        try {
                            const methods = await fetchSignInMethodsForEmail(
                                auth,
                                email
                            );
                            setError(
                                `Email already in use. Try signing in with: ${
                                    methods[0] || 'another method'
                                }`
                            );
                        } catch (fetchError) {
                            console.error(
                                'Error fetching sign-in methods:',
                                fetchError
                            );
                            setError(
                                'Email already in use with another sign-in method.'
                            );
                        }
                        return;
                    }
                }

                setError('Sign-in failed: ' + (err.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        })();
    }, [response, router]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    (loading || (Platform.OS !== 'web' && !request)) &&
                        styles.buttonDisabled,
                ]}
                disabled={loading || (Platform.OS !== 'web' && !request)}
                onPress={handlePress}
            >
                <Image
                    source={require('@/assets/images/G_LOGO1.png')}
                    style={{
                        width: 30,
                        height: 30,
                        margin: 2,
                        marginRight: 8,
                    }}
                />
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continue with Google</Text>
                )}
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        marginTop: 8,
        textAlign: 'center',
    },
    googleButton: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5EA',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
