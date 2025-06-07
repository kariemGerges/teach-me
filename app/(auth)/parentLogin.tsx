// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//     Alert,
//     KeyboardAvoidingView,
//     Platform,
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// // imports for firebase
// import { auth } from '@/services/firebaseConfig';
// import { signInWithEmailAndPassword } from 'firebase/auth';

// // import components
// import FirebaseError from '@/components/ui/FirebaseError';

// type ParentLoginProps = object;

// const ParentLogin: React.FC<ParentLoginProps> = () => {
//     const [email, setEmail] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [showPassword, setShowPassword] = useState<boolean>(false);
//     const [firebaseError, setFirebaseError] = useState<string | null>(null);

//     const validateEmail = (email: string): boolean => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const handleLogin = async (): Promise<void> => {
//         if (!email.trim() || !password.trim()) {
//             Alert.alert(
//                 'Missing Information',
//                 'Please enter both email and password.'
//             );
//             return;
//         }

//         if (!validateEmail(email)) {
//             Alert.alert('Invalid Email', 'Please enter a valid email address.');
//             return;
//         }

//         setIsLoading(true);

//         // Firebase sign-in logic
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             // On success, navigate to dashboard
//             router.replace('/screens/parentTeacherDashboard');
//         } catch (error: any) {
//             let message = 'An unexpected error occurred. Please try again.';
//             if (error.code) {
//                 switch (error.code) {
//                     case 'auth/invalid-email':
//                         message = 'The email address is not valid.';
//                         setFirebaseError(message);
//                         break;
//                     case 'auth/user-disabled':
//                         message = 'This account has been disabled.';
//                         setFirebaseError(message);
//                         break;
//                     case 'auth/user-not-found':
//                     case 'auth/wrong-password':
//                         message = 'Invalid email or password.';
//                         setFirebaseError(message);
//                         break;
//                     case 'auth/too-many-requests':
//                         message =
//                             'Too many attempts. Please wait and try again.';
//                         setFirebaseError(message);
//                         break;
//                     default:
//                         message = error.message || message;
//                 }
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleForgotPassword = (): void => {
//         if (!email.trim()) {
//             Alert.alert(
//                 'Email Required',
//                 'Please enter your email address first.'
//             );
//             return;
//         }

//         if (!validateEmail(email)) {
//             Alert.alert('Invalid Email', 'Please enter a valid email address.');
//             return;
//         }

//         Alert.alert(
//             'Password Reset',
//             `Password reset instructions have been sent to ${email}`,
//             [{ text: 'OK', style: 'default' }]
//         );
//     };

//     const handleSignUp = (): void => {
//         router.push('/(auth)/parentSignup');
//     };

//     const isFormValid = email.trim() && password.trim() && validateEmail(email);

//     return (
//         <SafeAreaView style={styles.container}>
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.keyboardView}
//             >
//                 <ScrollView
//                     contentContainerStyle={styles.scrollContent}
//                     showsVerticalScrollIndicator={false}
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     <View style={styles.content}>
//                         {/* Header */}
//                         <View style={styles.header}>
//                             <View style={styles.logoContainer}>
//                                 <Text style={styles.logoText}>TeachMe</Text>
//                                 <Text style={styles.logoSubtext}>
//                                     For Parents & Teachers
//                                 </Text>
//                             </View>
//                             <Text style={styles.welcomeText}>Welcome Back</Text>
//                             <Text style={styles.subtitleText}>
//                                 Sign in to manage your kids&apos; learning
//                             </Text>
//                         </View>

//                         {/* Login Form */}
//                         <View style={styles.formContainer}>
//                             {/* Email Input */}
//                             <View style={styles.inputGroup}>
//                                 <Text style={styles.inputLabel}>
//                                     Email Address
//                                 </Text>
//                                 <View style={styles.inputContainer}>
//                                     <TextInput
//                                         style={styles.input}
//                                         value={email}
//                                         onChangeText={setEmail}
//                                         placeholder="Enter your email"
//                                         placeholderTextColor="#9CA3AF"
//                                         keyboardType="email-address"
//                                         autoCapitalize="none"
//                                         autoCorrect={false}
//                                         autoComplete="email"
//                                     />
//                                     <Text style={styles.inputIcon}>📧</Text>
//                                 </View>
//                             </View>

//                             {/* Password Input */}
//                             <View style={styles.inputGroup}>
//                                 <Text style={styles.inputLabel}>Password</Text>
//                                 <View style={styles.inputContainer}>
//                                     <TextInput
//                                         style={styles.input}
//                                         value={password}
//                                         onChangeText={setPassword}
//                                         placeholder="Enter your password"
//                                         placeholderTextColor="#9CA3AF"
//                                         secureTextEntry={!showPassword}
//                                         autoComplete="password"
//                                     />
//                                     <TouchableOpacity
//                                         style={styles.passwordToggle}
//                                         onPress={() =>
//                                             setShowPassword(!showPassword)
//                                         }
//                                     >
//                                         <Text style={styles.inputIcon}>
//                                             {!showPassword ? '👀' : '🫣'}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>

//                             {/* Error Message */}
//                             {firebaseError && (
//                                 <FirebaseError error={firebaseError} />
//                             )}

//                             {/* Forgot Password */}
//                             <TouchableOpacity
//                                 style={styles.forgotPasswordContainer}
//                                 onPress={handleForgotPassword}
//                             >
//                                 <Text style={styles.forgotPasswordText}>
//                                     Forgot Password?
//                                 </Text>
//                             </TouchableOpacity>

//                             {/* Login Button */}
//                             <TouchableOpacity
//                                 style={[
//                                     styles.loginButton,
//                                     isFormValid
//                                         ? styles.loginButtonActive
//                                         : styles.loginButtonInactive,
//                                 ]}
//                                 onPress={handleLogin}
//                                 disabled={!isFormValid || isLoading}
//                             >
//                                 <Text style={styles.loginButtonText}>
//                                     {isLoading ? 'Signing In...' : 'Sign In'}
//                                 </Text>
//                             </TouchableOpacity>

//                             {/* Divider */}
//                             <View style={styles.divider}>
//                                 <View style={styles.dividerLine} />
//                                 <Text style={styles.dividerText}>OR</Text>
//                                 <View style={styles.dividerLine} />
//                             </View>

//                             {/* Social Login Buttons */}
//                             <View style={styles.socialContainer}>
//                                 <TouchableOpacity style={styles.socialButton}>
//                                     <Text style={styles.socialIcon}>🔵</Text>
//                                     <Text style={styles.socialText}>
//                                         Continue with Google
//                                     </Text>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity style={styles.socialButton}>
//                                     <Text style={styles.socialIcon}>📘</Text>
//                                     <Text style={styles.socialText}>
//                                         Continue with Facebook
//                                     </Text>
//                                 </TouchableOpacity>
//                             </View>

//                             {/* Sign Up Link */}
//                             <View style={styles.signUpContainer}>
//                                 <Text style={styles.signUpText}>
//                                     Don&apos;t have an account?{' '}
//                                 </Text>
//                                 <TouchableOpacity onPress={handleSignUp}>
//                                     <Text style={styles.signUpLink}>
//                                         Sign Up
//                                     </Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8FAFC',
//     },
//     keyboardView: {
//         flex: 1,
//     },
//     scrollContent: {
//         flexGrow: 1,
//     },
//     content: {
//         flex: 1,
//         paddingHorizontal: 24,
//         paddingVertical: 20,
//     },
//     header: {
//         alignItems: 'center',
//         marginBottom: 40,
//         paddingTop: 20,
//     },
//     logoContainer: {
//         alignItems: 'center',
//         marginBottom: 24,
//     },
//     logoText: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#1E293B',
//         marginBottom: 4,
//     },
//     logoSubtext: {
//         fontSize: 14,
//         color: '#64748B',
//         fontWeight: '500',
//     },
//     welcomeText: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#1E293B',
//         marginBottom: 8,
//     },
//     subtitleText: {
//         fontSize: 16,
//         color: '#64748B',
//         textAlign: 'center',
//     },
//     formContainer: {
//         flex: 1,
//     },
//     inputGroup: {
//         marginBottom: 20,
//     },
//     inputLabel: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#374151',
//         marginBottom: 8,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#FFFFFF',
//         borderWidth: 1,
//         borderColor: '#D1D5DB',
//         borderRadius: 12,
//         paddingHorizontal: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     input: {
//         flex: 1,
//         paddingVertical: 16,
//         fontSize: 16,
//         color: '#1F2937',
//     },
//     inputIcon: {
//         fontSize: 20,
//         marginLeft: 8,
//     },
//     passwordToggle: {
//         padding: 4,
//     },
//     forgotPasswordContainer: {
//         alignItems: 'flex-end',
//         marginBottom: 24,
//     },
//     forgotPasswordText: {
//         fontSize: 14,
//         color: '#3B82F6',
//         fontWeight: '500',
//     },
//     loginButton: {
//         paddingVertical: 16,
//         borderRadius: 12,
//         alignItems: 'center',
//         marginBottom: 24,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     loginButtonActive: {
//         backgroundColor: '#3B82F6',
//     },
//     loginButtonInactive: {
//         backgroundColor: '#9CA3AF',
//     },
//     loginButtonText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#FFFFFF',
//     },
//     divider: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 24,
//     },
//     dividerLine: {
//         flex: 1,
//         height: 1,
//         backgroundColor: '#E5E7EB',
//     },
//     dividerText: {
//         paddingHorizontal: 16,
//         fontSize: 14,
//         color: '#9CA3AF',
//         fontWeight: '500',
//     },
//     socialContainer: {
//         gap: 12,
//         marginBottom: 32,
//     },
//     socialButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#FFFFFF',
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         borderRadius: 12,
//         paddingVertical: 14,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 1,
//     },
//     socialIcon: {
//         fontSize: 20,
//         marginRight: 12,
//     },
//     socialText: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#374151',
//     },
//     signUpContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     signUpText: {
//         fontSize: 14,
//         color: '#6B7280',
//     },
//     signUpLink: {
//         fontSize: 14,
//         color: '#3B82F6',
//         fontWeight: '600',
//     },
// });

// export default ParentLogin;


import { router } from 'expo-router';
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
    ActivityIndicator,
} from 'react-native';

// Firebase
import { auth } from '@/services/firebaseConfig';
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';

// UI
import FirebaseError from '@/components/ui/FirebaseError';

const ParentLogin: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [firebaseErrorMessage, setFirebaseErrorMessage] = useState<string | null>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isFormValid =
        email.trim().length > 0 &&
        password.trim().length > 0 &&
        validateEmail(email);

    const handleLogin = async (): Promise<void> => {
        setFirebaseErrorMessage(null); // Always clear old error

        if (!email.trim() || !password.trim()) {
            const msg = 'Please enter both email and password.';
            setFirebaseErrorMessage(msg);
            Alert.alert('Missing Information', msg);
            return;
        }

        if (!validateEmail(email)) {
            const msg = 'Please enter a valid email address.';
            setFirebaseErrorMessage(msg);
            Alert.alert('Invalid Email', msg);
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setFirebaseErrorMessage(null); // clear any lingering error
            // Success: Navigate to dashboard
            router.replace('/screens/parentTeacherDashboard');
        } catch (error: any) {
            let message = '';
            if (error.code) {
                switch (error.code) {
                    case 'auth/invalid-email':
                        message = 'The email address is not valid.';
                        break;
                    case 'auth/user-disabled':
                        message = 'This account has been disabled.';
                        break;
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        message = 'Invalid email or password.';
                        break;
                    case 'auth/too-many-requests':
                        message =
                            'Too many attempts. Please wait and try again.';
                        break;
                    default:
                        message = error.message;
                }
            }
            setFirebaseErrorMessage(message);
            // console.log('kariemerr1', firebaseErrorMessage)
            // console.log('kariemerr2', message);
            // console.log('kariemerr3', error.code);
            // console.log('kariemerr4', error.message);
            // console.log('kariemerr5', setFirebaseErrorMessage);
            Alert.alert('Sign In Failed', message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (): Promise<void> => {
        setFirebaseErrorMessage(null);
        if (!email.trim()) {
            const msg = 'Please enter your email address first.';
            setFirebaseErrorMessage(msg);
            Alert.alert('Email Required', msg);
            return;
        }
        if (!validateEmail(email)) {
            const msg = 'Please enter a valid email address.';
            setFirebaseErrorMessage(msg);
            Alert.alert('Invalid Email', msg);
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Password Reset',
                `Password reset instructions have been sent to ${email}`
            );
        } catch (error: any) {
            let message = 'Failed to send password reset email.';
            if (error.code === 'auth/user-not-found') {
                message = 'No account found for this email.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Email address is not valid.';
            }
            setFirebaseErrorMessage(message);
            Alert.alert('Error', message);
        }
    };

    const handleSignUp = (): void => {
        setFirebaseErrorMessage(null);
        router.push('/(auth)/parentSignup');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoText}>TeachMe</Text>
                                <Text style={styles.logoSubtext}>
                                    For Parents & Teachers
                                </Text>
                            </View>
                            <Text style={styles.welcomeText}>Welcome Back</Text>
                            <Text style={styles.subtitleText}>
                                Sign in to manage your kids&apos; learning
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View style={styles.formContainer}>
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Email Address
                                </Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="email"
                                    />
                                    <Text style={styles.inputIcon}>📧</Text>
                                </View>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Password</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry={!showPassword}
                                        autoComplete="password"
                                    />
                                    <TouchableOpacity
                                        style={styles.passwordToggle}
                                        onPress={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    >
                                        <Text style={styles.inputIcon}>
                                            {!showPassword ? '👀' : '🫣'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Error Message */}
                            {firebaseErrorMessage && (
                                <FirebaseError error={firebaseErrorMessage} />
                            )}

                            {/* Forgot Password */}
                            <TouchableOpacity
                                style={styles.forgotPasswordContainer}
                                onPress={handleForgotPassword}
                                disabled={isLoading}
                            >
                                <Text style={styles.forgotPasswordText}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    isFormValid
                                        ? styles.loginButtonActive
                                        : styles.loginButtonInactive,
                                ]}
                                onPress={handleLogin}
                                disabled={!isFormValid || isLoading}
                            >
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                </Text>
                                {isLoading && (
                                    <ActivityIndicator
                                        color="#FFF"
                                        style={{ marginLeft: 12 }}
                                    />
                                )}
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Social Login Buttons (disabled for now) */}
                            <View style={styles.socialContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.socialButton,
                                        styles.socialButtonDisabled,
                                    ]}
                                    disabled
                                >
                                    <Text style={styles.socialIcon}>🔵</Text>
                                    <Text style={styles.socialText}>
                                        Continue with Google
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.socialButton,
                                        styles.socialButtonDisabled,
                                    ]}
                                    disabled
                                >
                                    <Text style={styles.socialIcon}>📘</Text>
                                    <Text style={styles.socialText}>
                                        Continue with Facebook
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Sign Up Link */}
                            <View style={styles.signUpContainer}>
                                <Text style={styles.signUpText}>
                                    Don&apos;t have an account?{' '}
                                </Text>
                                <TouchableOpacity
                                    onPress={handleSignUp}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.signUpLink}>
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        paddingTop: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    logoSubtext: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    inputIcon: {
        fontSize: 20,
        marginLeft: 8,
    },
    passwordToggle: {
        padding: 4,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
    },
    loginButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButtonActive: {
        backgroundColor: '#3B82F6',
    },
    loginButtonInactive: {
        backgroundColor: '#9CA3AF',
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    socialContainer: {
        gap: 12,
        marginBottom: 32,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        opacity: 1,
    },
    socialButtonDisabled: {
        opacity: 0.5,
    },
    socialIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    socialText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#6B7280',
    },
    signUpLink: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
});

export default ParentLogin;
