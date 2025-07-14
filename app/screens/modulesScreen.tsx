import { firestoreDb } from '@/services/firebaseConfig';
import {
    LearningProgressProps,
    Lesson,
    LessonStatus,
    Module,
} from '@/types/types';
import { router, useLocalSearchParams } from 'expo-router';
import { collection, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const LearningProgressScreen: React.FC<LearningProgressProps> = () => {
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [animatedValues] = useState(new Map<string, Animated.Value>());
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const { subject, grade } = useLocalSearchParams();

    // Normalize params to handle array case
    const normalizedSubject = Array.isArray(subject) ? subject[0] : subject;
    const normalizedGrade = Array.isArray(grade) ? grade[0] : grade;

    const getModulesForSubject = async (
        subject: string,
        grade: string
    ): Promise<Module[]> => {
        try {
            const subjectRef = doc(
                firestoreDb,
                'grades',
                grade,
                'subjects',
                subject
            );
            const modulesRef = collection(subjectRef, 'modules');
            const modulesSnap = await getDocs(modulesRef);

            const modulesWithLessons = await Promise.all(
                modulesSnap.docs.map(async (modDoc) => {
                    const modData = modDoc.data();
                    const lessonsRef = collection(modDoc.ref, 'lessons');
                    const lessonsSnap = await getDocs(lessonsRef);

                    const lessons: Lesson[] = lessonsSnap.docs.map((doc) => {
                        const lessonData = doc.data();
                        return {
                            id: doc.id,
                            icon: lessonData.icon ?? '📘',
                            title: lessonData.title ?? '',
                            allLessons: lessonData.allLessons ?? [],

                            status: lessonData.status ?? 'locked',
                            progress: lessonData.progress ?? 0,
                            singleLesson: lessonData,
                            totalLessons: lessonData.allLessons?.length || 0,
                        };
                    });

                    const completedLessons = lessons.filter(
                        (lesson) => lesson.status === 'completed'
                    ).length;
                    const totalLessons = lessons.length;

                    return {
                        id: modDoc.id,
                        title: modData.title ?? '',
                        icon: modData.icon ?? '',
                        lessons,
                        completedLessons,
                        totalLessons,
                    };
                })
            );
            console.log(
                'Modules and lessons fetched successfully:',
                modulesWithLessons
            );
            return modulesWithLessons;
        } catch (error) {
            console.error('Error fetching modules and lessons:', error);
            return [];
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!normalizedSubject || !normalizedGrade) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const result = await getModulesForSubject(
                    normalizedSubject,
                    normalizedGrade
                );
                if (isMounted) {
                    setModules(result);
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
                if (isMounted) {
                    setModules([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [normalizedSubject, normalizedGrade]);

    // Calculate overall progress
    const totalLessons = modules.reduce(
        (sum, module) => sum + module.totalLessons,
        0
    );
    const completedLessons = modules.reduce(
        (sum, module) => sum + module.completedLessons,
        0
    );
    const overallProgress =
        totalLessons === 0
            ? 0
            : Math.round((completedLessons / totalLessons) * 100);

    // Toggle module expansion
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

    // Lesson status icons and colors
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

    // Normalize subject and grade for display
    const normalizeSubject = (subject: string) => {
        return subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
    };
    const normalizeGrade = (grade: string) => {
        if (grade === 'kindergarten' || grade === 'K') {
            return 'Kindergarten';
        }
        return `Grade ${grade.replace('grade_', '')}`;
    };

    // Render progress header
    const renderProgressHeader = () => (
        <View style={styles.progressHeader}>
            <Text style={styles.subjectTitle}>
                {normalizeSubject(normalizedSubject)} -{' '}
                {normalizeGrade(normalizedGrade)} 🎯
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

    // Render lesson item
    const renderLesson = (lesson: Lesson, moduleId: string) => (
        <TouchableOpacity
            key={lesson.id}
            style={[
                styles.lessonItem,
                lesson.status === 'locked' && styles.lockedLesson,
            ]}
            onPress={() => {
                router.push({
                    pathname: '/screens/singleLessonScreen',

                    params: {
                        singleLesson: encodeURIComponent(
                            JSON.stringify(lesson)
                        ),
                        normalizedSubject: normalizedSubject,
                    },
                });
            }}
            // disabled={lesson.status === 'locked'}
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

    // Render module
    const renderModule = (module: Module) => {
        const isExpanded = expandedModule === module.id;
        const animatedValue =
            animatedValues.get(module.id) || new Animated.Value(0);

        const moduleProgress =
            module.totalLessons === 0
                ? 0
                : Math.round(
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

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1E3A8A" />
                    <Text style={styles.loadingText}>Loading modules...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // No data state
    if (!normalizedSubject || !normalizedGrade) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Subject and grade parameters are required
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground
            source={require('@/assets/images/bg.png')}
            style={styles.gradientBackground}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {renderProgressHeader()}

                    <View style={styles.modulesSection}>
                        <Text style={styles.sectionTitle}>
                            Learning Modules 📚
                        </Text>
                        {modules.length === 0 ? (
                            <View style={styles.noDataContainer}>
                                <Text style={styles.noDataText}>
                                    No modules found for {normalizedSubject} -
                                    Grade {normalizedGrade}
                                </Text>
                            </View>
                        ) : (
                            modules.map(renderModule)
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#64748B',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
    },
    noDataContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    progressHeader: {
        marginTop: Platform.OS === 'ios' ? 20 : 60,
        marginBottom: Platform.OS === 'ios' ? 30 : 24,
    },
    subjectTitle: {
        fontSize: Platform.OS === 'ios' ? 28 : 26,
        fontWeight: 'bold',
        color: '#ffffff',
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
        color: '#ffffff',
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
