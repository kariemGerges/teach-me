import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Firestore Services
import { auth, firestoreDb } from '@/services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Components
import Loading from '@/components/Loading';

const { width } = Dimensions.get('window');

interface RoleSelectionScreenProps {
    onKidSelected?: () => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
    onKidSelected,
}) => {
    const router = useRouter();
    const [userLoading, setUserLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, check Firestore for user data
                const userDocRef = doc(firestoreDb, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    // User data exists, navigate to role selected screen
                    const profile = userDoc.data();
                    if (
                        profile.type === 'parent' ||
                        profile.type === 'teacher'
                    ) {
                        // Pass the user object as a query parameter to the next screen
                        // 
                        router.replace({
                            pathname: '/screens/parentDashoard',
                            params: { user: JSON.stringify(user) },
                        });
                    } else if (profile.type === 'kid') {
                        router.replace('/(tabs)');
                    } else {
                        // User data does not exist, navigate to profile creation
                        router.push('/');
                    }
                }
            } else {
                // No user is signed in, navigate to login screen
                router.push('/screens/kidsLandingScreen');
            }
            setUserLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    // State to manage selected type
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const kidCardScale = useRef(new Animated.Value(1)).current;
    const parentCardScale = useRef(new Animated.Value(1)).current;
    const sparkleRotate1 = useRef(new Animated.Value(0)).current;
    const sparkleRotate2 = useRef(new Animated.Value(0)).current;
    const sparkleRotate3 = useRef(new Animated.Value(0)).current;
    const arrowBounce = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Initial entrance ani
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1.2)),
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous sparkle animations
        const sparkleAnimation1 = Animated.loop(
            Animated.timing(sparkleRotate1, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        const sparkleAnimation2 = Animated.loop(
            Animated.timing(sparkleRotate2, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        const sparkleAnimation3 = Animated.loop(
            Animated.timing(sparkleRotate3, {
                toValue: 1,
                duration: 2500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        // Arrow bouncing animation
        const arrowAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(arrowBounce, {
                    toValue: -10,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(arrowBounce, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );

        sparkleAnimation1.start();
        sparkleAnimation2.start();
        sparkleAnimation3.start();
        arrowAnimation.start();

        return () => {
            sparkleAnimation1.stop();
            sparkleAnimation2.stop();
            sparkleAnimation3.stop();
            arrowAnimation.stop();
        };
    }, [
        arrowBounce,
        fadeAnim,
        slideAnim,
        sparkleRotate1,
        sparkleRotate2,
        sparkleRotate3,
    ]);

    useEffect(() => {
        // Button entrance animation
        if (selectedRole) {
            Animated.spring(buttonScale, {
                toValue: 1,
                tension: 150,
                friction: 3,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(buttonScale, {
                toValue: 0.8,
                tension: 150,
                friction: 3,
                useNativeDriver: true,
            }).start();
        }
    }, [selectedRole, buttonScale]);

    const handleRolePress = (role: 'kid' | 'parent') => {
        setSelectedRole(role);

        // Card press animation
        const scaleRef = role === 'kid' ? kidCardScale : parentCardScale;

        Animated.sequence([
            Animated.timing(scaleRef, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleRef, {
                toValue: 1.05,
                tension: 300,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.timing(scaleRef, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleGetStarted = () => {
        if (selectedRole === 'kid') {
            onKidSelected?.();
            router.push('/(auth)/kidsLogin');
        } else if (selectedRole === 'parent') {
            router.push('/(auth)/parentSignup');
        }
    };

    const sparkleRotation1 = sparkleRotate1.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const sparkleRotation2 = sparkleRotate2.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg'],
    });

    const sparkleRotation3 = sparkleRotate3.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (userLoading) {
        return (
            <View style={styles.container}>
                <Loading />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/selectedrole.png')}
                style={styles.backgroundImage}
                contentFit="cover"
            />
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9E6" />

            {/* Animated Sparkles */}
            <Animated.View
                style={[
                    styles.sparkle,
                    styles.sparkle1,
                    { transform: [{ rotate: sparkleRotation1 }] },
                ]}
            >
                <Text style={styles.sparkleText}>✨</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.sparkle,
                    styles.sparkle2,
                    { transform: [{ rotate: sparkleRotation2 }] },
                ]}
            >
                <Text style={styles.sparkleText}>⭐</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.sparkle,
                    styles.sparkle3,
                    { transform: [{ rotate: sparkleRotation3 }] },
                ]}
            >
                <Text style={styles.sparkleText}>🌟</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Choose your role</Text>
                    <Text style={styles.subtitle}>below</Text>
                    <Animated.View
                        style={[
                            styles.arrow,
                            { transform: [{ translateY: arrowBounce }] },
                        ]}
                    >
                        <Image
                            source={require('@/assets/images/arrow2.png')}
                            style={styles.arrowPic1}
                        />
                    </Animated.View>
                </View>

                {/* Role Cards */}
                <View style={styles.cardsContainer}>
                    {/* Kid Role Card */}
                    <Animated.View
                        style={{ transform: [{ scale: kidCardScale }] }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                selectedRole === 'kid' && styles.selectedCard,
                            ]}
                            onPress={() => handleRolePress('kid')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.kidAvatar}>
                                    <Image
                                        source={require('@/assets/images/kids.png')}
                                        style={styles.kidAvatar}
                                        contentFit="cover"
                                    />
                                </View>
                                <View style={styles.cardText}>
                                    <Text style={styles.roleTitle}>Kid</Text>
                                    <Text style={styles.roleSubtitle}>
                                        Ready to Learn!
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={styles.orText}>or</Text>

                    {/* Parent/Teacher Role Card */}
                    <Animated.View
                        style={{ transform: [{ scale: parentCardScale }] }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                selectedRole === 'parent' &&
                                    styles.selectedCard,
                            ]}
                            onPress={() => handleRolePress('parent')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardText}>
                                    <Text style={styles.roleTitle}>
                                        Parent/Teacher
                                    </Text>
                                    <Text style={styles.roleSubtitle}>
                                        Guide & Support
                                    </Text>
                                </View>
                                <View style={styles.parentAvatar}>
                                    <Image
                                        source={require('@/assets/images/teacher.png')}
                                        style={styles.parentAvatar}
                                        contentFit="cover"
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Get Started Button */}
                <Image
                    source={require('@/assets/images/arrow2.png')}
                    style={styles.arrowPic2}
                />
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        { transform: [{ scale: buttonScale }] },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.getStartedButton,
                            !selectedRole && styles.disabledButton,
                        ]}
                        onPress={handleGetStarted}
                        disabled={!selectedRole}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get started →</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF9E6',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 30,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2D2D2D',
    },
    arrow: {
        position: 'absolute',
        top: 40,
        left: 100,
    },
    arrowPic1: {
        width: 200,
        height: 200,
    },
    arrowPic2: {
        width: 160,
        height: 160,
        position: 'absolute',
        bottom: 70,
        right: 50,
        transform: [{ rotate: '55deg' }],
    },
    cardsContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    roleCard: {
        backgroundColor: '#FFD700',
        borderRadius: 24,
        padding: 24,
        marginVertical: 8,
        width: width - 48,
        minHeight: 100,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#FFA500',
        backgroundColor: '#FFE55C',
        shadowOpacity: 0.2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardText: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: 4,
    },
    roleSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
    },
    kidAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        marginLeft: 16,
    },
    parentAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
    },
    avatarEmoji: {
        fontSize: 36,
    },
    orText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#666',
        marginVertical: 12,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 20,
    },
    getStartedButton: {
        backgroundColor: '#2D2D2D',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#CCC',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    sparkle: {
        position: 'absolute',
        zIndex: 1,
    },
    sparkle1: {
        top: 100,
        right: 60,
    },
    sparkle2: {
        top: 180,
        left: 30,
    },
    sparkle3: {
        bottom: 180,
        right: 40,
    },
    sparkleText: {
        fontSize: 20,
    },
});

export default RoleSelectionScreen;
