import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SubjectSelectionProps, Subject, Grade } from '@/types/types';

const { width } = Dimensions.get('window');



const SubjectSelectionScreen: React.FC<SubjectSelectionProps> = ({
    onSubjectGradeSelect,
}) => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        null
    );
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [animatedValue] = useState(new Animated.Value(1));

    const subjects: {
        name: Subject;
        icon: string;
        color: string;
        bgColor: string;
    }[] = [
        {
            name: 'math',
            icon: '🔢',
            color: '#1E3A8A', // Dark blue
            bgColor: '#FEF3C7', // Light yellow
        },
        {
            name: 'science',
            icon: '🧪',
            color: '#1E3A8A',
            bgColor: '#DBEAFE', // Light blue
        },
        {
            name: 'english',
            icon: '📚',
            color: '#1E3A8A',
            bgColor: '#FCD34D', // Yellow
        },
    ];

    const grades: Grade[] = [
        'kindergarten',
        'grade_1',
        'grade_2',
        'grade_3',
        'grade_4',
        'grade_5',
    ];

    const handleSubjectPress = (subject: Subject) => {
        // Animate button press
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setSelectedSubject(subject);
        setSelectedGrade(null); // Reset grade when changing subject
    };

    const handleGradePress = (grade: Grade) => {
        setSelectedGrade(grade);
        if (selectedSubject && onSubjectGradeSelect) {
            onSubjectGradeSelect(selectedSubject, grade);
        }
    };

    const renderSubjectCard = (subject: {
        name: Subject;
        icon: string;
        color: string;
        bgColor: string;
    }) => (
        <Animated.View
            key={subject.name}
            style={[
                styles.subjectCard,
                {
                    backgroundColor: subject.bgColor,
                    borderColor:
                        selectedSubject === subject.name
                            ? subject.color
                            : 'transparent',
                    transform: [{ scale: animatedValue }],
                },
            ]}
        >
            <TouchableOpacity
                style={styles.subjectButton}
                onPress={() => handleSubjectPress(subject.name)}
                activeOpacity={0.8}
            >
                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                <Text style={[styles.subjectName, { color: subject.color }]}>
                    {subject.name}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderGradeSelector = () => {
        if (!selectedSubject) return null;

        return (
            <View style={styles.gradeContainer}>
                <Text style={styles.gradeTitle}>
                    Choose your grade level for {selectedSubject}!
                </Text>
                <View style={styles.gradeGrid}>
                    {grades.map((grade) => (
                        <TouchableOpacity
                            key={grade}
                            style={[
                                styles.gradeButton,
                                selectedGrade === grade &&
                                    styles.selectedGradeButton,
                            ]}
                            onPress={() => handleGradePress(grade)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.gradeText,
                                    selectedGrade === grade &&
                                        styles.selectedGradeText,
                                ]}
                            >
                                {grade === 'kindergarten'
                                    ? 'Kindergarten'
                                    : `Grade ${grade.replace('grade_', '')}`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        // <LinearGradient colors={['#d6d69d', '#fefebe']}>
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        What do you want to learn today? 🌟
                    </Text>
                    <Text style={styles.subtitleText}>
                        Pick your favorite subject!
                    </Text>
                </View>

                {/* Subject Cards */}
                <View style={styles.subjectsContainer}>
                    {subjects.map(renderSubjectCard)}
                </View>

                {/* Grade Selector */}
                {renderGradeSelector()}

                {/* Start Learning Button */}
                {selectedSubject && selectedGrade && (
                    <TouchableOpacity
                        style={styles.startButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            router.push({
                                pathname: '/screens/modulesScreen',
                                params: {
                                    subject: selectedSubject,
                                    grade: selectedGrade,
                                },
                            });
                        }}
                    >
                        <Text style={styles.startButtonText}>
                            Lets Learn {selectedSubject}! 🚀
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
        // </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEBE', // Light yellow background
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    header: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 16,
        marginBottom: Platform.OS === 'ios' ? 30 : 24,
    },
    welcomeText: {
        fontSize: Platform.OS === 'ios' ? 28 : 26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        textAlign: 'center',
        marginBottom: Platform.OS === 'ios' ? 8 : 6,
    },
    subtitleText: {
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        color: '#64748B',
        textAlign: 'center',
    },
    subjectsContainer: {
        gap: Platform.OS === 'ios' ? 16 : 12,
        marginBottom: Platform.OS === 'ios' ? 30 : 24,
    },
    subjectCard: {
        borderRadius: 20,
        borderWidth: 3,
        elevation: Platform.OS === 'android' ? 4 : 0,
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
        shadowOffset:
            Platform.OS === 'ios'
                ? { width: 0, height: 2 }
                : { width: 0, height: 0 },
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
        shadowRadius: Platform.OS === 'ios' ? 8 : 0,
    },
    subjectButton: {
        alignItems: 'center',
        paddingVertical: Platform.OS === 'ios' ? 24 : 20,
        paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    },
    subjectIcon: {
        fontSize: Platform.OS === 'ios' ? 48 : 44,
        marginBottom: Platform.OS === 'ios' ? 12 : 8,
    },
    subjectName: {
        fontSize: Platform.OS === 'ios' ? 24 : 22,
        fontWeight: 'bold',
    },
    gradeContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: Platform.OS === 'ios' ? 20 : 16,
        marginBottom: Platform.OS === 'ios' ? 30 : 24,
        elevation: Platform.OS === 'android' ? 2 : 0,
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
        shadowOffset:
            Platform.OS === 'ios'
                ? { width: 0, height: 1 }
                : { width: 0, height: 0 },
        shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0,
        shadowRadius: Platform.OS === 'ios' ? 4 : 0,
    },
    gradeTitle: {
        fontSize: Platform.OS === 'ios' ? 20 : 18,
        fontWeight: 'bold',
        color: '#1E3A8A',
        textAlign: 'center',
        marginBottom: Platform.OS === 'ios' ? 20 : 16,
    },
    gradeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Platform.OS === 'ios' ? 12 : 8,
    },
    gradeButton: {
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        paddingVertical: Platform.OS === 'ios' ? 16 : 12,
        paddingHorizontal: Platform.OS === 'ios' ? 12 : 8,
        width:
            (width - (Platform.OS === 'ios' ? 80 : 64)) / 2 -
            (Platform.OS === 'ios' ? 6 : 4),
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedGradeButton: {
        backgroundColor: '#FCD34D',
        borderColor: '#1E3A8A',
    },
    gradeText: {
        fontSize: Platform.OS === 'ios' ? 16 : 14,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
    selectedGradeText: {
        color: '#1E3A8A',
        fontWeight: 'bold',
    },
    startButton: {
        backgroundColor: '#1E3A8A',
        borderRadius: 20,
        paddingVertical: Platform.OS === 'ios' ? 18 : 16,
        paddingHorizontal: Platform.OS === 'ios' ? 24 : 20,
        alignItems: 'center',
        elevation: Platform.OS === 'android' ? 3 : 0,
        shadowColor: Platform.OS === 'ios' ? '#1E3A8A' : 'transparent',
        shadowOffset:
            Platform.OS === 'ios'
                ? { width: 0, height: 4 }
                : { width: 0, height: 0 },
        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
        shadowRadius: Platform.OS === 'ios' ? 8 : 0,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'ios' ? 20 : 18,
        fontWeight: 'bold',
    },
});

export default SubjectSelectionScreen;
