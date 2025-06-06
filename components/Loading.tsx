import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface LoadingProps {
    subject?: 'math' | 'english' | 'science' | 'general';
    message?: string;
    showProgress?: boolean;
}

const LoadingComponent: React.FC<LoadingProps> = ({
    subject = 'general',
    message,
    showProgress = true,
}) => {
    const [animatedValue] = useState(new Animated.Value(0));
    const [bounceValue] = useState(new Animated.Value(0));
    const [progressValue] = useState(new Animated.Value(0));
    const [currentIcon, setCurrentIcon] = useState(0);

    const subjectConfig = {
        math: {
            icons: ['📊', '🔢', '➕', '📐', '🧮'],
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
            messages: [
                'Calculating awesome problems...',
                'Counting up the fun...',
                'Adding some magic...',
                'Measuring greatness...',
            ],
        },
        english: {
            icons: ['📚', '✏️', '📝', '🔤', '📖'],
            colors: ['#A8E6CF', '#7FCDCD', '#81C784', '#AED581', '#C5E1A5'],
            messages: [
                'Reading amazing stories...',
                'Writing wonderful words...',
                'Spelling out the fun...',
                'Building better sentences...',
            ],
        },
        science: {
            icons: ['🔬', '🧪', '🌱', '⚗️', '🌟'],
            colors: ['#FFB74D', '#FF8A65', '#FFAB91', '#FFCC02', '#FFF176'],
            messages: [
                'Mixing up experiments...',
                'Discovering new things...',
                'Exploring the universe...',
                'Growing knowledge...',
            ],
        },
        general: {
            icons: ['🎨', '🎯', '🚀', '⭐', '🌈'],
            colors: ['#E1BEE7', '#F8BBD9', '#F48FB1', '#F06292', '#EC407A'],
            messages: [
                'Getting ready for fun...',
                'Loading awesome content...',
                'Preparing your adventure...',
                'Almost there...',
            ],
        },
    };

    const config = subjectConfig[subject];

    useEffect(() => {
        // Spinning animation
        const spinAnimation = Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        // Bounce animation for icons
        const bounceAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(bounceValue, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceValue, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        // Progress animation
        const progressAnimation = Animated.loop(
            Animated.timing(progressValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: false,
            })
        );

        spinAnimation.start();
        bounceAnimation.start();
        if (showProgress) {
            progressAnimation.start();
        }

        // Icon rotation
        const iconInterval = setInterval(() => {
            setCurrentIcon((prev) => (prev + 1) % config.icons.length);
        }, 1000);

        return () => {
            spinAnimation.stop();
            bounceAnimation.stop();
            progressAnimation.stop();
            clearInterval(iconInterval);
        };
    }, [
        animatedValue,
        bounceValue,
        progressValue,
        showProgress,
        config.icons.length,
    ]);

    const spin = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const bounce = bounceValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const progressWidth = progressValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const displayMessage =
        message || config.messages[currentIcon % config.messages.length];

    return (
        <View style={styles.container}>
            {/* Animated Background Circles */}
            <View style={styles.backgroundCircles}>
                {config.colors.map((color, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.backgroundCircle,
                            {
                                backgroundColor: color,
                                transform: [
                                    {
                                        rotate: spin,
                                    },
                                    {
                                        scale: animatedValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.2],
                                        }),
                                    },
                                ],
                                opacity: animatedValue.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.3, 0.7, 0.3],
                                }),
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Animated Icon */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            transform: [
                                { translateY: bounce },
                                { rotate: spin },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.icon}>{config.icons[currentIcon]}</Text>
                </Animated.View>

                {/* Loading Text */}
                <Text style={styles.loadingText}>Loading...</Text>

                {/* Dynamic Message */}
                <Text style={styles.message}>{displayMessage}</Text>

                {/* Progress Bar */}
                {showProgress && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressWidth,
                                        backgroundColor:
                                            config.colors[
                                                currentIcon %
                                                    config.colors.length
                                            ],
                                    },
                                ]}
                            />
                        </View>
                    </View>
                )}

                {/* Floating Subject Icons */}
                <View style={styles.floatingIcons}>
                    {config.icons.slice(0, 3).map((icon, index) => (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.floatingIcon,
                                {
                                    transform: [
                                        {
                                            translateY: bounceValue.interpolate(
                                                {
                                                    inputRange: [0, 1],
                                                    outputRange: [
                                                        0,
                                                        -10 - index * 5,
                                                    ],
                                                }
                                            ),
                                        },
                                    ],
                                    opacity: bounceValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.6, 1],
                                    }),
                                },
                            ]}
                        >
                            {icon}
                        </Animated.Text>
                    ))}
                </View>
            </View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        position: 'relative',
    },
    backgroundCircles: {
        position: 'absolute',
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.1,
    },
    content: {
        alignItems: 'center',
        zIndex: 1,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    icon: {
        fontSize: 40,
    },
    loadingText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    progressContainer: {
        width: width * 0.7,
        alignItems: 'center',
        marginBottom: 20,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    floatingIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width * 0.6,
        marginTop: 20,
    },
    floatingIcon: {
        fontSize: 24,
        opacity: 0.6,
    },
});

export default LoadingComponent;
