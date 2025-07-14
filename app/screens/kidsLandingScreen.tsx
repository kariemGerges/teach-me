
// export default KidsLandingScreen;

import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
    Animated,
} from 'react-native';
import { Satellite } from 'lucide-react-native';
import { Children } from '@/types/children';

const { width, height } = Dimensions.get('window');

// Animated Star Component
const AnimatedStar: React.FC<{
    id: number;
    initialLeft: number;
    initialTop: number;
    delay: number;
}> = ({ id, initialLeft, initialTop, delay }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const startAnimation = () => {
            // Reset values
            opacity.setValue(0);
            translateY.setValue(Math.random() * 20 - 10); // Random starting offset
            scale.setValue(0.3 + Math.random() * 0.4); // Random scale between 0.3-0.7

            // Create sequence: fade in -> float -> fade out -> repeat
            Animated.sequence([
                // Fade in
                Animated.timing(opacity, {
                    toValue: 0.4 + Math.random() * 0.6, // Random opacity between 0.4-1.0
                    duration: 1000 + Math.random() * 2000, // 1-3 seconds fade in
                    useNativeDriver: true,
                }),
                // Float while visible
                Animated.parallel([
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(translateY, {
                                toValue: -15 - Math.random() * 10,
                                duration: 2000 + Math.random() * 2000,
                                useNativeDriver: true,
                            }),
                            Animated.timing(translateY, {
                                toValue: 15 + Math.random() * 10,
                                duration: 2000 + Math.random() * 2000,
                                useNativeDriver: true,
                            }),
                        ]),
                        { iterations: 2 + Math.floor(Math.random() * 3) } // 2-4 float cycles
                    ),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(scale, {
                                toValue: 0.5 + Math.random() * 0.3,
                                duration: 3000 + Math.random() * 2000,
                                useNativeDriver: true,
                            }),
                            Animated.timing(scale, {
                                toValue: 0.3 + Math.random() * 0.2,
                                duration: 3000 + Math.random() * 2000,
                                useNativeDriver: true,
                            }),
                        ]),
                        { iterations: 1 + Math.floor(Math.random() * 2) } // 1-2 twinkle cycles
                    ),
                ]),
                // Fade out
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1000 + Math.random() * 1500, // 1-2.5 seconds fade out
                    useNativeDriver: true,
                }),
                // Wait before next cycle
                Animated.delay(2000 + Math.random() * 4000), // 2-6 seconds pause
            ]).start(() => {
                // Restart the animation cycle
                startAnimation();
            });
        };

        // Start with random delay
        const timeout = setTimeout(startAnimation, delay);
        return () => clearTimeout(timeout);
    }, [delay, opacity, translateY, scale]);

    return (
        <Animated.View
            style={[
                styles.starContainer,
                {
                    left: initialLeft,
                    top: initialTop,
                    opacity,
                    transform: [{ translateY }, { scale }],
                },
            ]}
        >
            <Satellite
                color="#E97451"
                size={20 + Math.random() * 4} // Random size between 20-28
            />
        </Animated.View>
    );
};

const KidsLandingScreen: React.FC = () => {
    const router = useRouter();
    const { childData } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('home');
    type Star = { id: number; left: number; top: number; delay: number };
    const [stars, setStars] = useState<Star[]>([]);

    // Generate floating stars
    useEffect(() => {
        const generateStars = () => {
            const starCount = Math.floor(Math.random() * 2) + 12; // 12-20 stars
            const newStars = Array.from({ length: starCount }, (_, index) => ({
                id: index,
                left: Math.random() * (width - 40), // Keep stars within screen bounds
                top: Math.random() * (height - 200), // Avoid bottom navigation area
                delay: Math.random() * 5000, // Random start delay up to 5 seconds
            }));
            setStars(newStars);
        };

        generateStars();
    }, []);

    let child = {} as Children;
    try {
        child = childData
            ? (JSON.parse(childData as string) as Children)
            : ({} as Children);
    } catch (e) {
        console.error('Error parsing child data:', e);
        child = {} as Children;
    }

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'study') {
            router.push('/screens/studyLandingScreen');
        } else if (tab === 'settings') {
            router.push({
                pathname: '/screens/kidsSettingsScreen',
                params: {
                    childData: encodeURIComponent(JSON.stringify(child)),
                },
            });
        }
    };

    // convert createdAt timestamp to a readable date
    const formatCreatedAt = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Calculate the level
    const calculateLevel = (): number => {
        const English = child.progress?.english?.level || 1;
        const MathLevel = child.progress?.math?.level || 1;
        const Science = child.progress?.science?.level || 1;
        const levels = [English, MathLevel, Science];
        const maxLevel = Math.max(...levels);
        return maxLevel;
    };

    const TabButton = ({
        tab,
        icon,
        label,
        isActive,
    }: {
        tab: string;
        icon: string;
        label: string;
        isActive: boolean;
    }) => (
        <TouchableOpacity
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => handleTabPress(tab)}
        >
            <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                {icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B1426" />

            {/* Animated Stars */}
            {stars.map((star) => (
                <AnimatedStar
                    key={star.id}
                    id={star.id}
                    initialLeft={star.left}
                    initialTop={star.top}
                    delay={star.delay}
                />
            ))}

            {/* Background Animation */}
            {/* <LottieView
                source={require('@/assets/lottie/spacebackground.json')}
                autoPlay
                loop
                style={styles.backgroundLottie}
            />  */}

            {/* Header */}
            <View
                style={[
                    styles.header,
                    { paddingTop: Platform.OS === 'ios' ? 10 : 15 },
                ]}
            >
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {child.avatarUrl ? (
                            <Text style={styles.avatarText}>
                                {child.avatarUrl}
                            </Text>
                        ) : (
                            <Text style={styles.avatarText}>
                                {(child.name || 'K').charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.kidName}>
                        {child.name || 'Space Explorer'}
                    </Text>
                    <Text style={styles.kidGrade}>
                        {child.grade ? `Grade ${child.grade}` : 'Young Learner'}
                    </Text>
                </View>
                <View style={styles.headerStats}>
                    <Text style={styles.pointsText}>
                        ⭐ {child.rewards?.length || 0}
                    </Text>
                </View>
            </View>

            {/* Main Content Area */}
            <View style={styles.mainContent}>
                {/* Welcome Message */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>
                        Welcome back, {child.name || 'Explorer'}!
                    </Text>
                    <Text style={styles.welcomeSubtitle}>
                        Ready for another space adventure?
                    </Text>
                </View>

                {/* Main Character - Centered and Bigger */}
                <View style={styles.characterContainer}>
                    {/* <LottieView
                        source={require('@/assets/lottie/spaceKid.json')}
                        autoPlay
                        loop
                        style={styles.characterAnimation}
                    />  */}
                </View>

                {/* Quick Stats or Actions */}
                <View style={styles.quickStats}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Joined</Text>

                        <Text style={styles.statNumber}>
                            {/* {child.streak || 0} */}
                            {formatCreatedAt(child?.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {calculateLevel() || 1}
                        </Text>
                        <Text style={styles.statLabel}>Level 🚀</Text>
                    </View>
                </View>
            </View>

            {/* Bottom Tab Navigation */}
            <View
                style={[
                    styles.bottomTabContainer,
                    { paddingBottom: Platform.OS === 'ios' ? 0 : 15 },
                ]}
            >
                <View style={styles.tabBar}>
                    <TabButton
                        tab="home"
                        icon="🏠"
                        label="Home"
                        isActive={activeTab === 'home'}
                    />
                    <TabButton
                        tab="study"
                        icon="📚"
                        label="Study"
                        isActive={activeTab === 'study'}
                    />
                    <TabButton
                        tab="settings"
                        icon="⚙️"
                        label="Settings"
                        isActive={activeTab === 'settings'}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1426',
    },
    starContainer: {
        position: 'absolute',
        zIndex: 0,
    },
    backgroundLottie: {
        position: 'absolute',
        width: width,
        height: height,
        resizeMode: 'cover',
        top: 0,
        left: 0,
        zIndex: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 5 : 35,
        paddingHorizontal: 20,
        paddingBottom: 15,
        zIndex: 1,
        backgroundColor: 'rgba(11, 20, 38, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 217, 61, 0.2)',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFD93D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#1E3A8A',
        shadowColor: '#FFD93D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0B1426',
    },
    headerInfo: {
        flex: 1,
    },
    kidName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD93D',
        marginBottom: 2,
    },
    kidGrade: {
        fontSize: 14,
        color: 'rgba(255, 217, 61, 0.8)',
    },
    headerStats: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B1426',
        backgroundColor: '#FFD93D',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        shadowColor: '#FFD93D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === 'ios' ? 10 : 15,
        zIndex: 1,
    },
    welcomeSection: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 10 : 20,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD93D',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(11, 20, 38, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 217, 61, 0.8)',
        textAlign: 'center',
        textShadowColor: 'rgba(11, 20, 38, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    characterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginVertical: Platform.OS === 'ios' ? 10 : 20,
    },
    characterAnimation: {
        width: Platform.OS === 'ios' ? 350 : 330,
        height: Platform.OS === 'ios' ? 350 : 320,
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: Platform.OS === 'ios' ? 10 : 20,
    },
    statCard: {
        backgroundColor: 'rgba(30, 58, 138, 0.6)',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD93D',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD93D',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 217, 61, 0.8)',
        textAlign: 'center',
    },
    bottomTabContainer: {
        zIndex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 217, 61, 0.95)',
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
        borderTopWidth: 2,
        borderTopColor: '#1E3A8A',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 15,
        marginHorizontal: 4,
    },
    activeTabButton: {
        backgroundColor: '#1E3A8A',
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    activeTabIcon: {
        transform: [{ scale: 1.1 }],
    },
    tabLabel: {
        fontSize: 12,
        color: '#0B1426',
        fontWeight: '500',
    },
    activeTabLabel: {
        color: '#FFD93D',
        fontWeight: 'bold',
    },
});

export default KidsLandingScreen;