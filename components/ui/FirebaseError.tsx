import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    StyleProp,
    ViewStyle,
} from 'react-native';

// Define the type for the component's props
interface ErrorMessageProps {
    /** The error message to display. If null, undefined, or empty, the component is not rendered. */
    error: string | null | undefined;
    /** Optional custom styles for the container view. */
    style?: StyleProp<ViewStyle>;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, style }) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    // Animate the component's appearance
    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: error ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [error, animatedValue]);

    // Don't render anything if there's no error message.
    if (!error) {
        return null;
    }

    // Style for the animation (fade and scale in)
    const animatedStyle = {
        opacity: animatedValue,
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                }),
            },
        ],
    };

    return (
        <Animated.View style={[styles.container, animatedStyle, style]}>
            {/* Icon container */}
            <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>!</Text>
            </View>
            {/* Error message text */}
            <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
    );
};

// Define the styles for the component using StyleSheet for performance optimization.
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderLeftWidth: 5,
        borderLeftColor: '#D9534F',
        marginVertical: 10,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconWrapper: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D9534F',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 20,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: '#B94A48',
        fontWeight: '500',
    },
});

export default ErrorMessage;
