import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Animated,
    Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';




interface LearningProgressProps {
//     subject: string;
//     grade: string;
//     onLessonSelect?: (moduleId: string, lessonId: string) => void;
}

type LessonStatus = 'completed' | 'in_progress' | 'locked';

interface Lesson {
    id: string;
    title: string;
    status: LessonStatus;
    progress: number; // 0-100
}

interface Module {
    id: string;
    title: string;
    icon: string;
    lessons: Lesson[];
    completedLessons: number;
    totalLessons: number;
}

const LearningProgressScreen: React.FC<LearningProgressProps> = () => {
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [animatedValues] = useState(new Map());
    const { subject, grade } = useLocalSearchParams();

    // Sample data - you would fetch this from your API
    const getModulesForSubject = (subject: string): Module[] => {
        const mathModules: Module[] = [
            {
                id: 'addition',
                title: 'Addition & Subtraction',
                icon: '➕',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Basic Addition',
                        status: 'completed',
                        progress: 100,
                    },
                    {
                        id: 'lesson2',
                        title: 'Adding with Pictures',
                        status: 'completed',
                        progress: 100,
                    },
                    {
                        id: 'lesson3',
                        title: 'Two-Digit Addition',
                        status: 'in_progress',
                        progress: 65,
                    },
                    {
                        id: 'lesson4',
                        title: 'Word Problems',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 2,
                totalLessons: 4,
            },
            {
                id: 'multiplication',
                title: 'Multiplication',
                icon: '✖️',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Times Tables 1-5',
                        status: 'locked',
                        progress: 0,
                    },
                    {
                        id: 'lesson2',
                        title: 'Times Tables 6-10',
                        status: 'locked',
                        progress: 0,
                    },
                    {
                        id: 'lesson3',
                        title: 'Multiplication Games',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 0,
                totalLessons: 3,
            },
            {
                id: 'geometry',
                title: 'Shapes & Geometry',
                icon: '🔺',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Basic Shapes',
                        status: 'locked',
                        progress: 0,
                    },
                    {
                        id: 'lesson2',
                        title: 'Shape Patterns',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 0,
                totalLessons: 2,
            },
        ];

        const scienceModules: Module[] = [
            {
                id: 'plants',
                title: 'Plants & Animals',
                icon: '🌱',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Parts of a Plant',
                        status: 'completed',
                        progress: 100,
                    },
                    {
                        id: 'lesson2',
                        title: 'Animal Habitats',
                        status: 'in_progress',
                        progress: 45,
                    },
                    {
                        id: 'lesson3',
                        title: 'Life Cycles',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 1,
                totalLessons: 3,
            },
            {
                id: 'weather',
                title: 'Weather & Seasons',
                icon: '☀️',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Types of Weather',
                        status: 'locked',
                        progress: 0,
                    },
                    {
                        id: 'lesson2',
                        title: 'Four Seasons',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 0,
                totalLessons: 2,
            },
        ];

        const englishModules: Module[] = [
            {
                id: 'phonics',
                title: 'Phonics & Reading',
                icon: '🔤',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Letter Sounds A-M',
                        status: 'completed',
                        progress: 100,
                    },
                    {
                        id: 'lesson2',
                        title: 'Letter Sounds N-Z',
                        status: 'completed',
                        progress: 100,
                    },
                    {
                        id: 'lesson3',
                        title: 'Blending Sounds',
                        status: 'in_progress',
                        progress: 80,
                    },
                    {
                        id: 'lesson4',
                        title: 'Simple Words',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 2,
                totalLessons: 4,
            },
            {
                id: 'writing',
                title: 'Writing & Spelling',
                icon: '✏️',
                lessons: [
                    {
                        id: 'lesson1',
                        title: 'Letter Formation',
                        status: 'locked',
                        progress: 0,
                    },
                    {
                        id: 'lesson2',
                        title: 'Simple Sentences',
                        status: 'locked',
                        progress: 0,
                    },
                ],
                completedLessons: 0,
                totalLessons: 2,
            },
        ];

        switch (subject.toLowerCase()) {
            case 'math':
                return mathModules;
            case 'science':
                return scienceModules;
            case 'english':
                return englishModules;
            default:
                return mathModules;
        }
    };

    const normalizedSubject = Array.isArray(subject) ? subject[0] : subject;
    const modules = getModulesForSubject(normalizedSubject);

    // Calculate overall progress
    const totalLessons = modules.reduce(
        (sum, module) => sum + module.totalLessons,
        0
    );
    const completedLessons = modules.reduce(
        (sum, module) => sum + module.completedLessons,
        0
    );
    const overallProgress = Math.round((completedLessons / totalLessons) * 100);

    // toggle module expansion
    const toggleModule = (moduleId: string) => {
        if (!animatedValues.has(moduleId)) {
            animatedValues.set(moduleId, new Animated.Value(0));
        }

        const isExpanding = expandedModule !== moduleId;
        setExpandedModule(isExpanding ? moduleId : null);

        Animated.timing(animatedValues.get(moduleId)!, {
            toValue: isExpanding ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    // lesson status icons and colors
    const getLessonStatusIcon = (status: LessonStatus) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'in_progress':
                return '🔄';
            case 'locked':
                return '🔒';
        }
    };


    const getLessonStatusColor = (status: LessonStatus) => {
        switch (status) {
            case 'completed':
                return '#10B981';
            case 'in_progress':
                return '#F59E0B';
            case 'locked':
                return '#9CA3AF';
        }
    };

    // Render progress header
    // This shows the overall progress, completed lessons, and remaining lessons
    const renderProgressHeader = () => (
        <View style={styles.progressHeader}>
            <Text style={styles.subjectTitle}>
                {subject} - Grade {grade} 🎯
            </Text>

            <View style={styles.progressCard}>
                <View style={styles.progressInfo}>
                    <Text style={styles.progressLabel}>Overall Progress</Text>
                    <Text style={styles.progressPercentage}>
                        {overallProgress}%
                    </Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${overallProgress}%` },
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {completedLessons}
                        </Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {totalLessons - completedLessons}
                        </Text>
                        <Text style={styles.statLabel}>Remaining</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statBadge}>🏆</Text>
                        <Text style={styles.statLabel}>Keep Going!</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderLesson = (lesson: Lesson, moduleId: string) => (
        <TouchableOpacity
            key={lesson.id}
            style={[
                styles.lessonItem,
                lesson.status === 'locked' && styles.lockedLesson,
            ]}
            onPress={() => {
                // TODO: Implement lesson selection navigation or logic here
                // Example: navigate to lesson details screen
                // if (lesson.status !== 'locked') {
                //     navigation.navigate('LessonDetail', { moduleId, lessonId: lesson.id });
                // }
            }}
            disabled={lesson.status === 'locked'}
            activeOpacity={0.7}
        >
            <View style={styles.lessonContent}>
                <Text style={styles.lessonIcon}>
                    {getLessonStatusIcon(lesson.status)}
                </Text>
                <View style={styles.lessonDetails}>
                    <Text
                        style={[
                            styles.lessonTitle,
                            lesson.status === 'locked' && styles.lockedText,
                        ]}
                    >
                        {lesson.title}
                    </Text>
                    {lesson.status === 'in_progress' && (
                        <View style={styles.lessonProgressBar}>
                            <View
                                style={[
                                    styles.lessonProgressFill,
                                    { width: `${lesson.progress}%` },
                                ]}
                            />
                        </View>
                    )}
                </View>
                {lesson.status === 'completed' && (
                    <Text style={styles.completedBadge}>🌟</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderModule = (module: Module) => {
        const isExpanded = expandedModule === module.id;
        const animatedValue =
            animatedValues.get(module.id) || new Animated.Value(0);

        const moduleProgress = Math.round(
            (module.completedLessons / module.totalLessons) * 100
        );

        return (
            <View key={module.id} style={styles.moduleContainer}>
                <TouchableOpacity
                    style={styles.moduleHeader}
                    onPress={() => toggleModule(module.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.moduleInfo}>
                        <Text style={styles.moduleIcon}>{module.icon}</Text>
                        <View style={styles.moduleTextContainer}>
                            <Text style={styles.moduleTitle}>
                                {module.title}
                            </Text>
                            <Text style={styles.moduleProgress}>
                                {module.completedLessons}/{module.totalLessons}{' '}
                                lessons • {moduleProgress}%
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={[
                            styles.expandIcon,
                            {
                                transform: [
                                    { rotate: isExpanded ? '180deg' : '0deg' },
                                ],
                            },
                        ]}
                    >
                        ⌄
                    </Text>
                </TouchableOpacity>

                <View style={styles.moduleProgressBar}>
                    <View
                        style={[
                            styles.moduleProgressFill,
                            { width: `${moduleProgress}%` },
                        ]}
                    />
                </View>

                {isExpanded && (
                    <Animated.View
                        style={[
                            styles.lessonsContainer,
                            {
                                opacity: animatedValue,
                                maxHeight: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1000],
                                }),
                            },
                        ]}
                    >
                        {module.lessons.map((lesson) =>
                            renderLesson(lesson, module.id)
                        )}
                    </Animated.View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {renderProgressHeader()}

                <View style={styles.modulesSection}>
                    <Text style={styles.sectionTitle}>Learning Modules 📚</Text>
                    {modules.map(renderModule)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    progressHeader: {
        marginTop: Platform.OS === 'ios' ? 20 : 16,
        marginBottom: Platform.OS === 'ios' ? 30 : 24,
    },
    subjectTitle: {
        fontSize: Platform.OS === 'ios' ? 28 : 26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        textAlign: 'center',
        marginBottom: Platform.OS === 'ios' ? 20 : 16,
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: Platform.OS === 'ios' ? 20 : 16,
        elevation: Platform.OS === 'android' ? 3 : 0,
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
        shadowOffset:
            Platform.OS === 'ios'
                ? { width: 0, height: 2 }
                : { width: 0, height: 0 },
        shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
        shadowRadius: Platform.OS === 'ios' ? 8 : 0,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 16 : 12,
    },
    progressLabel: {
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    progressPercentage: {
        fontSize: Platform.OS === 'ios' ? 24 : 22,
        fontWeight: 'bold',
        color: '#FCD34D',
    },
    progressBarContainer: {
        marginBottom: Platform.OS === 'ios' ? 20 : 16,
    },
    progressBarBackground: {
        height: 12,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FCD34D',
        borderRadius: 6,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: Platform.OS === 'ios' ? 20 : 18,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    statLabel: {
        fontSize: Platform.OS === 'ios' ? 14 : 12,
        color: '#64748B',
        marginTop: 4,
    },
    statBadge: {
        fontSize: Platform.OS === 'ios' ? 24 : 22,
    },
    modulesSection: {
        gap: Platform.OS === 'ios' ? 16 : 12,
    },
    sectionTitle: {
        fontSize: Platform.OS === 'ios' ? 22 : 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: Platform.OS === 'ios' ? 16 : 12,
    },
    moduleContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: Platform.OS === 'ios' ? 16 : 12,
        elevation: Platform.OS === 'android' ? 2 : 0,
        shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
        shadowOffset:
            Platform.OS === 'ios'
                ? { width: 0, height: 1 }
                : { width: 0, height: 0 },
        shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0,
        shadowRadius: Platform.OS === 'ios' ? 4 : 0,
        overflow: 'hidden',
    },
    moduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Platform.OS === 'ios' ? 16 : 14,
    },
    moduleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    moduleIcon: {
        fontSize: Platform.OS === 'ios' ? 32 : 28,
        marginRight: Platform.OS === 'ios' ? 16 : 12,
    },
    moduleTextContainer: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: Platform.OS === 'ios' ? 18 : 16,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 4,
    },
    moduleProgress: {
        fontSize: Platform.OS === 'ios' ? 14 : 12,
        color: '#64748B',
    },
    expandIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 18,
        color: '#64748B',
    },
    moduleProgressBar: {
        height: 6,
        backgroundColor: '#E2E8F0',
        marginHorizontal: Platform.OS === 'ios' ? 16 : 14,
        borderRadius: 3,
        overflow: 'hidden',
    },
    moduleProgressFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 3,
    },
    lessonsContainer: {
        paddingTop: Platform.OS === 'ios' ? 16 : 12,
    },
    lessonItem: {
        paddingHorizontal: Platform.OS === 'ios' ? 16 : 14,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    lockedLesson: {
        opacity: 0.5,
    },
    lessonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lessonIcon: {
        fontSize: Platform.OS === 'ios' ? 20 : 18,
        marginRight: Platform.OS === 'ios' ? 12 : 10,
    },
    lessonDetails: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: Platform.OS === 'ios' ? 16 : 14,
        fontWeight: '600',
        color: '#1E3A8A',
    },
    lockedText: {
        color: '#9CA3AF',
    },
    lessonProgressBar: {
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        marginTop: 8,
        overflow: 'hidden',
    },
    lessonProgressFill: {
        height: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: 2,
    },
    completedBadge: {
        fontSize: Platform.OS === 'ios' ? 20 : 18,
    },
});

export default LearningProgressScreen;
