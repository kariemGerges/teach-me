import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// imports for firebase
import { auth, firestoreDb } from '@/services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Define the UserProfile interface
import { userProfileSchema } from '@/schemas/user'; // Zod schema
import { UserProfile } from '@/types/user';

// import components
import FirebaseError from '@/components/ui/FirebaseError';
import SignWithGoogle from '@/components/ui/SignWithGoogle';

interface SignupScreenProps {
    navigation: any;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const ParentSignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [firebaseError, setFirebaseError] = useState<string | null>(null);

    // Function to validate individual fields
    const validateField = (
        field: string,
        value: string
    ): string | undefined => {
        switch (field) {
            case 'fullName':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2)
                    return 'Full name must be at least 2 characters';
                return undefined;

            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value))
                    return 'Please enter a valid email address';
                return undefined;

            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 8)
                    return 'Password must be at least 8 characters long';
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                }
                return undefined;

            case 'confirmPassword':
                if (!value) return 'Please confirm your password';
                if (value !== password) return 'Passwords do not match';
                return undefined;

            default:
                return undefined;
        }
    };

    // Function to validate all fields
    const validateAllFields = (): boolean => {
        const newErrors: FormErrors = {};

        newErrors.fullName = validateField('fullName', fullName);
        newErrors.email = validateField('email', email);
        newErrors.password = validateField('password', password);
        newErrors.confirmPassword = validateField(
            'confirmPassword',
            confirmPassword
        );

        setErrors(newErrors);

        // Return true if no errors
        return !Object.values(newErrors).some((error) => error !== undefined);
    };

    // Function to handle field changes with real-time validation
    const handleFieldChange = (field: string, value: string) => {
        // Update the field value
        switch (field) {
            case 'fullName':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                // Also revalidate confirm password if it exists
                if (confirmPassword) {
                    setErrors((prev) => ({
                        ...prev,
                        confirmPassword: validateField(
                            'confirmPassword',
                            confirmPassword
                        ),
                    }));
                }
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
        }

        // Clear error for this field and validate
        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, value),
        }));
    };

    // Function to write the user profile to Firestore
    const createUserProfile = async (profile: UserProfile) => {
        try {
            await setDoc(doc(firestoreDb, 'users', profile.uid), profile);
        } catch (error) {
            console.error('Error writing user profile:', error);
            throw error;
        }
    };

    // Function to handle signup
    const handleSignup = async () => {
        // Validate all fields first
        if (!validateAllFields()) {
            Alert.alert(
                'Error',
                'Please fix the errors below before continuing'
            );
            return;
        }

        setIsLoading(true);

        try {
            // 1. register user with email and password using Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // 2. prepare user data according to UserProfile interface (schema)
            const profile: UserProfile = {
                uid: userCredential.user.uid,
                type: 'parent',
                name: fullName.trim(),
                email: email.toLowerCase().trim(),
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
                provider: 'email',
                childrenIds: [], // Initialize with empty array as it is conditional
                classroomIds: [], // Initialize with empty array as it is conditional
            };

            // 3. Validate with Zod schema (this is your structural validation)
            const parsed = userProfileSchema.safeParse(profile);
            if (!parsed.success) {
                console.error('Zod validation failed:', parsed.error);
                throw new Error('Profile validation failed. Please try again.');
            }

            // 4. save user profile to Firestore
            await createUserProfile(parsed.data);

            // 5. navigate to the parent dashboard
            Alert.alert('Success', 'Account created successfully!', [
                {
                    text: 'OK',
                    onPress: () =>
                        router.push('/screens/parentTeacherDashboard'),
                },
            ]);
        } catch (error: any) {
            console.error('Signup error:', error);

            // Handle specific Firebase Auth errors
            setFirebaseError('Signup failed. Please try again.');

            if (error.code === 'auth/email-already-in-use') {
                setFirebaseError(
                    'This email is already registered. Please use a different email or sign in.'
                );
            } else if (error.code === 'auth/weak-password') {
                setFirebaseError(
                    'Password is too weak. Please choose a stronger password.'
                );
            } else if (error.code === 'auth/invalid-email') {
                setFirebaseError(
                    'Invalid email address. Please check and try again.'
                );
            } else if (error.message) {
                setFirebaseError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join our parent community
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.fullName && styles.inputError,
                                ]}
                                value={fullName}
                                onChangeText={(value) =>
                                    handleFieldChange('fullName', value)
                                }
                                placeholder="Enter your full name"
                                placeholderTextColor="#8E8E93"
                                autoCapitalize="words"
                                textContentType="name"
                            />
                            {errors.fullName && (
                                <Text style={styles.errorText}>
                                    {errors.fullName}
                                </Text>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.email && styles.inputError,
                                ]}
                                value={email}
                                onChangeText={(value) =>
                                    handleFieldChange('email', value)
                                }
                                placeholder="Enter your email"
                                placeholderTextColor="#8E8E93"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                textContentType="emailAddress"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>
                                    {errors.email}
                                </Text>
                            )}

                            {(firebaseError ===
                                'This email is already registered. Please use a different email or sign in.' ||
                                firebaseError ===
                                    'Invalid email address. Please check and try again.') && (
                                <FirebaseError error={firebaseError} />
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.password && styles.inputError,
                                ]}
                                value={password}
                                onChangeText={(value) =>
                                    handleFieldChange('password', value)
                                }
                                placeholder="Create a password"
                                placeholderTextColor="#8E8E93"
                                secureTextEntry
                                textContentType="newPassword"
                            />
                            {errors.password && (
                                <Text style={styles.errorText}>
                                    {errors.password}
                                </Text>
                            )}
                            {firebaseError ===
                                'Password is too weak. Please choose a stronger password.' && (
                                <FirebaseError error={firebaseError} />
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Confirm Password
                            </Text>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    errors.confirmPassword && styles.inputError,
                                ]}
                                value={confirmPassword}
                                onChangeText={(value) =>
                                    handleFieldChange('confirmPassword', value)
                                }
                                placeholder="Confirm your password"
                                placeholderTextColor="#8E8E93"
                                secureTextEntry
                                textContentType="newPassword"
                            />
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword}
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.signupButton,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={handleSignup}
                            disabled={isLoading}
                        >
                            <Text style={styles.signupButtonText}>
                                {isLoading
                                    ? 'Creating Account...'
                                    : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.divider} />
                        </View>

                        <SignWithGoogle />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Already have an account?{' '}
                            <Text
                                style={styles.loginLink}
                                onPress={() =>
                                    router.push('/(auth)/parentLogin')
                                }
                            >
                                Sign In
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    header: {
        marginTop: 40,
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 17,
        color: '#8E8E93',
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    textInput: {
        height: 50,
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 17,
        color: '#1C1C1E',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 4,
        marginLeft: 4,
    },
    signupButton: {
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    signupButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5EA',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 15,
        color: '#8E8E93',
    },

    googleButtonText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#1C1C1E',
    },
    footer: {
        marginTop: 32,
        marginBottom: 32,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: '#8E8E93',
    },
    loginLink: {
        color: '#007AFF',
        fontWeight: '500',
    },
});

export default ParentSignupScreen;
