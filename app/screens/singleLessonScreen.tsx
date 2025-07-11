// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useState } from 'react';
// import {
//     Alert,
//     // FlatList,
//     Animated,
//     Dimensions,
//     ScrollView,
//     StyleSheet,
//     Text,
//     // Image,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// import { router, useLocalSearchParams } from 'expo-router';

// const { width, height } = Dimensions.get('window');

// // Type definitions for lesson content
// interface Question {
//     id: number;
//     question: string;
//     options: string[];
//     correct: number;
//     hint: string;
// }

// interface Example {
//     problem?: string;
//     solution?: string;
//     explanation?: string;
//     fraction1?: string;
//     fraction2?: string;
//     number?: string;
//     breakdown?: string;
//     scenario?: string;
//     probability?: string;
// }

// interface Activity {
//     type: string;
//     question?: string;
//     pairs?: { fraction: string; equivalent: string }[];
//     problems?: { fraction: string; equivalent: string; answer: string }[];
//     challenges?: { clue: string; answer: string }[];
//     datasets?: any[];
//     experiments?: string[];
//     key_points?: string[];
//     sample_summary?: string;
// }

// interface LessonContent {
//     introduction: string;
//     instructions: string;
//     examples?: Example[];
//     questions?: Question[];
//     activities?: Activity[];
//     reward: string;
//     passage?: string;
//     key_concepts?: string[];
//     virtual_experiments?: any[];
//     story_elements?: any;
//     story_starters?: string[];
//     writing_techniques?: any;
//     revision_checklist?: string[];
//     [key: string]: any; // For additional flexible properties
// }

// interface Lesson {
//     title: string;
//     type:
//         | 'quiz'
//         | 'interactive'
//         | 'writing'
//         | 'experiment'
//         | 'design_project'
//         | 'labeling'
//         | 'map_activity'
//         | 'instructions'
//         | 'interactiveElements'
//         | 'practiceExamples'
//         | 'feedback';
//     content: LessonContent;
// }

// interface LessonScreenProps {
//     route: {
//         params: {
//             lesson: Lesson;
//             subjectName: string;
//             topicName: string;
//         };
//     };
//     navigation: any;
// }

// const LessonScreen: React.FC = () => {
//     // const { lesson, subjectName, topicName } = route.params;
//     const searchParams = useLocalSearchParams();
//     const lesson: Lesson =
//         typeof searchParams.lesson === 'string'
//             ? JSON.parse(searchParams.lesson)
//             : Array.isArray(searchParams.lesson)
//             ? JSON.parse(searchParams.lesson[0])
//             : (searchParams.lesson as unknown as Lesson);
//     const subjectName: string = typeof searchParams.subjectName === 'string'
//         ? searchParams.subjectName
//         : Array.isArray(searchParams.subjectName)
//         ? searchParams.subjectName[0]
//         : '';
//     const topicName: string = typeof searchParams.topicName === 'string'
//         ? searchParams.topicName
//         : Array.isArray(searchParams.topicName)
//         ? searchParams.topicName[0]
//         : '';
//     const [currentStep, setCurrentStep] = useState(0);
//     const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
//     const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
//     const [showHint, setShowHint] = useState(false);
//     const [showExplanation, setShowExplanation] = useState(false);
//     const [score, setScore] = useState(0);
//     const [completed, setCompleted] = useState(false);
//     const [userInput, setUserInput] = useState('');
//     const [draggedItems, setDraggedItems] = useState<string[]>([]);
//     const [progress] = useState(new Animated.Value(0));

//     const totalSteps =
//         lesson.content.questions?.length ||
//         lesson.content.activities?.length ||
//         1;

//     useEffect(() => {
//         // Animate progress bar
//         Animated.timing(progress, {
//             toValue: (currentStep + 1) / totalSteps,
//             duration: 300,
//             useNativeDriver: false,
//         }).start();
//     }, [currentStep]);

//     const handleAnswerSelect = (answerIndex: number) => {
//         setSelectedAnswer(answerIndex);
//         setShowExplanation(false);
//         setShowHint(false);
//     };

//     const handleSubmitAnswer = () => {
//         if (selectedAnswer === null) {
//             Alert.alert(
//                 'Please select an answer',
//                 'Choose one of the options before submitting.'
//             );
//             return;
//         }

//         const question = lesson.content.questions![currentStep];
//         const isCorrect = selectedAnswer === question.correct;

//         setUserAnswers((prev) => ({ ...prev, [currentStep]: selectedAnswer }));
//         setShowExplanation(true);

//         if (isCorrect) {
//             setScore((prev) => prev + 1);
//         }

//         setTimeout(() => {
//             if (currentStep < totalSteps - 1) {
//                 setCurrentStep((prev) => prev + 1);
//                 setSelectedAnswer(null);
//                 setShowExplanation(false);
//                 setShowHint(false);
//             } else {
//                 setCompleted(true);
//             }
//         }, 2000);
//     };

//     const handleShowHint = () => {
//         setShowHint(true);
//     };

//     const renderQuizContent = () => {
//         if (!lesson.content.questions) return null;

//         const question = lesson.content.questions[currentStep];
//         const isCorrect = selectedAnswer === question.correct;

//         return (
//             <View style={styles.questionContainer}>
//                 <Text style={styles.questionText}>{question.question}</Text>

//                 <View style={styles.optionsContainer}>
//                     {question.options.map((option, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             style={[
//                                 styles.optionButton,
//                                 selectedAnswer === index &&
//                                     styles.selectedOption,
//                                 showExplanation &&
//                                     index === question.correct &&
//                                     styles.correctOption,
//                                 showExplanation &&
//                                     selectedAnswer === index &&
//                                     !isCorrect &&
//                                     styles.incorrectOption,
//                             ]}
//                             onPress={() => handleAnswerSelect(index)}
//                             disabled={showExplanation}
//                         >
//                             <Text
//                                 style={[
//                                     styles.optionText,
//                                     selectedAnswer === index &&
//                                         styles.selectedOptionText,
//                                 ]}
//                             >
//                                 {option}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {showExplanation && (
//                     <View
//                         style={[
//                             styles.feedbackContainer,
//                             isCorrect
//                                 ? styles.correctFeedback
//                                 : styles.incorrectFeedback,
//                         ]}
//                     >
//                         <Ionicons
//                             name={
//                                 isCorrect ? 'checkmark-circle' : 'close-circle'
//                             }
//                             size={24}
//                             color={isCorrect ? '#4CAF50' : '#F44336'}
//                         />
//                         <Text style={styles.feedbackText}>
//                             {isCorrect
//                                 ? 'Correct! Great job!'
//                                 : 'Not quite right. Try again next time!'}
//                         </Text>
//                     </View>
//                 )}

//                 {showHint && (
//                     <View style={styles.hintContainer}>
//                         <Ionicons name="bulb" size={20} color="#FFA726" />
//                         <Text style={styles.hintText}>{question.hint}</Text>
//                     </View>
//                 )}

//                 <View style={styles.actionButtons}>
//                     {!showHint && !showExplanation && (
//                         <TouchableOpacity
//                             style={styles.hintButton}
//                             onPress={handleShowHint}
//                         >
//                             <Ionicons
//                                 name="help-circle"
//                                 size={20}
//                                 color="#FFA726"
//                             />
//                             <Text style={styles.hintButtonText}>
//                                 Need a hint?
//                             </Text>
//                         </TouchableOpacity>
//                     )}

//                     {!showExplanation && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.submitButton,
//                                 selectedAnswer === null &&
//                                     styles.disabledButton,
//                             ]}
//                             onPress={handleSubmitAnswer}
//                             disabled={selectedAnswer === null}
//                         >
//                             <Text style={styles.submitButtonText}>
//                                 Submit Answer
//                             </Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     const renderInteractiveContent = () => {
//         if (!lesson.content.activities) return null;

//         const activity =
//             lesson.content.activities[currentStep] ||
//             lesson.content.activities[0];

//         switch (activity.type) {
//             case 'drag_and_drop':
//                 return renderDragAndDrop(activity);
//             case 'fill_in_blank':
//                 return renderFillInBlank(activity);
//             case 'summary_builder':
//                 return renderSummaryBuilder(activity);
//             default:
//                 return renderGenericActivity(activity);
//         }
//     };

//     const renderDragAndDrop = (activity: Activity) => (
//         <View style={styles.activityContainer}>
//             <Text style={styles.activityTitle}>{activity.question}</Text>
//             {activity.pairs?.map((pair, index) => (
//                 <View key={index} style={styles.dragDropPair}>
//                     <View style={styles.dragItem}>
//                         <Text style={styles.dragItemText}>{pair.fraction}</Text>
//                     </View>
//                     <Ionicons name="arrow-forward" size={24} color="#666" />
//                     <View style={styles.dropZone}>
//                         <Text style={styles.dragItemText}>
//                             {pair.equivalent}
//                         </Text>
//                     </View>
//                 </View>
//             ))}
//         </View>
//     );

//     const renderFillInBlank = (activity: Activity) => (
//         <View style={styles.activityContainer}>
//             <Text style={styles.activityTitle}>{activity.question}</Text>
//             {activity.problems?.map((problem, index) => (
//                 <View key={index} style={styles.fillBlankContainer}>
//                     <Text style={styles.fillBlankText}>
//                         {problem.fraction} ={' '}
//                         {problem.equivalent.replace('?', '___')}
//                     </Text>
//                     <TextInput
//                         style={styles.fillBlankInput}
//                         placeholder="?"
//                         value={userInput}
//                         onChangeText={setUserInput}
//                         keyboardType="numeric"
//                     />
//                 </View>
//             ))}
//         </View>
//     );

//     const renderSummaryBuilder = (activity: Activity) => (
//         <View style={styles.activityContainer}>
//             <Text style={styles.activityTitle}>Build a Summary</Text>
//             <Text style={styles.activitySubtitle}>
//                 Select the most important points:
//             </Text>
//             {activity.key_points?.map((point, index) => (
//                 <TouchableOpacity
//                     key={index}
//                     style={[
//                         styles.keyPointButton,
//                         draggedItems.includes(point) && styles.selectedKeyPoint,
//                     ]}
//                     onPress={() => {
//                         if (draggedItems.includes(point)) {
//                             setDraggedItems(
//                                 draggedItems.filter((item) => item !== point)
//                             );
//                         } else {
//                             setDraggedItems([...draggedItems, point]);
//                         }
//                     }}
//                 >
//                     <Text
//                         style={[
//                             styles.keyPointText,
//                             draggedItems.includes(point) &&
//                                 styles.selectedKeyPointText,
//                         ]}
//                     >
//                         {point}
//                     </Text>
//                 </TouchableOpacity>
//             ))}

//             {activity.sample_summary && (
//                 <View style={styles.sampleSummaryContainer}>
//                     <Text style={styles.sampleSummaryTitle}>
//                         Sample Summary:
//                     </Text>
//                     <Text style={styles.sampleSummaryText}>
//                         {activity.sample_summary}
//                     </Text>
//                 </View>
//             )}
//         </View>
//     );

//     const renderGenericActivity = (activity: Activity) => (
//         <View style={styles.activityContainer}>
//             <Text style={styles.activityTitle}>Interactive Activity</Text>
//             <Text style={styles.activityDescription}>
//                 Explore and learn through this hands-on activity!
//             </Text>
//         </View>
//     );

//     const renderWritingContent = () => (
//         <View style={styles.writingContainer}>
//             <Text style={styles.writingTitle}>Writing Activity</Text>
//             <Text style={styles.writingInstructions}>
//                 {lesson.content.instructions}
//             </Text>

//             {lesson.content.story_starters && (
//                 <View style={styles.storyStartersContainer}>
//                     <Text style={styles.sectionTitle}>Story Starters:</Text>
//                     {lesson.content.story_starters.map((starter, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             style={styles.storyStarterButton}
//                         >
//                             <Text style={styles.storyStarterText}>
//                                 {starter}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             )}

//             <TextInput
//                 style={styles.writingInput}
//                 placeholder="Start writing your story here..."
//                 multiline
//                 value={userInput}
//                 onChangeText={setUserInput}
//                 textAlignVertical="top"
//             />
//         </View>
//     );

//     const renderExperimentContent = () => (
//         <View style={styles.experimentContainer}>
//             <Text style={styles.experimentTitle}>Science Experiment</Text>
//             <Text style={styles.experimentInstructions}>
//                 {lesson.content.instructions}
//             </Text>

//             {lesson.content.key_concepts && (
//                 <View style={styles.conceptsContainer}>
//                     <Text style={styles.sectionTitle}>Key Concepts:</Text>
//                     {lesson.content.key_concepts.map((concept, index) => (
//                         <View key={index} style={styles.conceptItem}>
//                             <Ionicons name="bulb" size={16} color="#FFA726" />
//                             <Text style={styles.conceptText}>{concept}</Text>
//                         </View>
//                     ))}
//                 </View>
//             )}

//             {lesson.content.virtual_experiments && (
//                 <View style={styles.experimentsContainer}>
//                     <Text style={styles.sectionTitle}>
//                         Virtual Experiments:
//                     </Text>
//                     {lesson.content.virtual_experiments.map(
//                         (experiment, index) => (
//                             <TouchableOpacity
//                                 key={index}
//                                 style={styles.experimentCard}
//                             >
//                                 <Text style={styles.experimentName}>
//                                     {experiment.name}
//                                 </Text>
//                                 <Text style={styles.experimentProcedure}>
//                                     {experiment.procedure}
//                                 </Text>
//                             </TouchableOpacity>
//                         )
//                     )}
//                 </View>
//             )}
//         </View>
//     );

//     const renderCompletionScreen = () => (
//         <View style={styles.completionContainer}>
//             <Animated.View
//                 style={[styles.completionContent, { opacity: progress }]}
//             >
//                 <View style={styles.rewardIcon}>
//                     <Ionicons name="trophy" size={80} color="#FFD700" />
//                 </View>

//                 <Text style={styles.completionTitle}>Lesson Complete!</Text>
//                 <Text style={styles.rewardText}>{lesson.content.reward}</Text>

//                 {lesson.type === 'quiz' && (
//                     <View style={styles.scoreContainer}>
//                         <Text style={styles.scoreText}>
//                             Your Score: {score}/{totalSteps}
//                         </Text>
//                         <View style={styles.scoreBar}>
//                             <View
//                                 style={[
//                                     styles.scoreProgress,
//                                     { width: `${(score / totalSteps) * 100}%` },
//                                 ]}
//                             />
//                         </View>
//                     </View>
//                 )}

//                 <TouchableOpacity
//                     style={styles.continueButton}
//                     onPress={() => router.back()}
//                 >
//                     <Text style={styles.continueButtonText}>
//                         Continue Learning
//                     </Text>
//                 </TouchableOpacity>
//             </Animated.View>
//         </View>
//     );

//     const renderContent = () => {
//         if (completed) {
//             return renderCompletionScreen();
//         }

//         switch (lesson.type) {
//             case 'quiz':
//                 return renderQuizContent();
//             case 'interactive':
//                 return renderInteractiveContent();
//             case 'writing':
//                 return renderWritingContent();
//             case 'experiment':
//                 return renderExperimentContent();
//             default:
//                 return renderInteractiveContent();
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar style="light" />

//             {/* Header */}
//             <LinearGradient
//                 colors={['#667eea', '#764ba2']}
//                 style={styles.header}
//             >
//                 <TouchableOpacity
//                     style={styles.backButton}
//                     onPress={() => router.back()}
//                 >
//                     <Ionicons name="arrow-back" size={24} color="white" />
//                 </TouchableOpacity>

//                 <View style={styles.headerContent}>
//                     <Text style={styles.subjectText}>{subjectName}</Text>
//                     <Text style={styles.lessonTitle}>{lesson.title}</Text>
//                 </View>

//                 <View style={styles.progressContainer}>
//                     <Text style={styles.progressText}>
//                         {completed ? totalSteps : currentStep + 1}/{totalSteps}
//                     </Text>
//                 </View>
//             </LinearGradient>

//             {/* Progress Bar */}
//             {!completed && (
//                 <View style={styles.progressBarContainer}>
//                     <Animated.View
//                         style={[
//                             styles.progressBar,
//                             {
//                                 width: progress.interpolate({
//                                     inputRange: [0, 1],
//                                     outputRange: ['0%', '100%'],
//                                 }),
//                             },
//                         ]}
//                     />
//                 </View>
//             )}

//             {/* Introduction */}
//             {!completed && currentStep === 0 && (
//                 <View style={styles.introductionContainer}>
//                     <Text style={styles.introductionText}>
//                         {lesson.content.introduction}
//                     </Text>
//                     <Text style={styles.instructionsText}>
//                         {lesson.content.instructions}
//                     </Text>
//                 </View>
//             )}

//             {/* Main Content */}
//             <ScrollView
//                 style={styles.scrollView}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {renderContent()}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fc',
//     },
//     header: {
//         paddingTop: 50,
//         paddingBottom: 20,
//         paddingHorizontal: 20,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     backButton: {
//         padding: 8,
//     },
//     headerContent: {
//         flex: 1,
//         alignItems: 'center',
//     },
//     subjectText: {
//         color: 'white',
//         fontSize: 14,
//         opacity: 0.8,
//     },
//     lessonTitle: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     progressContainer: {
//         alignItems: 'center',
//     },
//     progressText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     progressBarContainer: {
//         height: 4,
//         backgroundColor: '#e0e0e0',
//     },
//     progressBar: {
//         height: '100%',
//         backgroundColor: '#4CAF50',
//     },
//     introductionContainer: {
//         padding: 20,
//         backgroundColor: 'white',
//         margin: 16,
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     introductionText: {
//         fontSize: 16,
//         color: '#333',
//         marginBottom: 12,
//         lineHeight: 24,
//     },
//     instructionsText: {
//         fontSize: 14,
//         color: '#666',
//         lineHeight: 20,
//     },
//     scrollView: {
//         flex: 1,
//     },
//     questionContainer: {
//         margin: 16,
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     questionText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 20,
//         lineHeight: 26,
//     },
//     optionsContainer: {
//         marginBottom: 20,
//     },
//     optionButton: {
//         padding: 16,
//         marginVertical: 6,
//         backgroundColor: '#f5f5f5',
//         borderRadius: 12,
//         borderWidth: 2,
//         borderColor: 'transparent',
//     },
//     selectedOption: {
//         backgroundColor: '#e3f2fd',
//         borderColor: '#2196F3',
//     },
//     correctOption: {
//         backgroundColor: '#e8f5e8',
//         borderColor: '#4CAF50',
//     },
//     incorrectOption: {
//         backgroundColor: '#ffebee',
//         borderColor: '#F44336',
//     },
//     optionText: {
//         fontSize: 16,
//         color: '#333',
//         textAlign: 'center',
//     },
//     selectedOptionText: {
//         color: '#2196F3',
//         fontWeight: '600',
//     },
//     feedbackContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 16,
//     },
//     correctFeedback: {
//         backgroundColor: '#e8f5e8',
//     },
//     incorrectFeedback: {
//         backgroundColor: '#ffebee',
//     },
//     feedbackText: {
//         marginLeft: 8,
//         fontSize: 14,
//         fontWeight: '600',
//     },
//     hintContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 12,
//         backgroundColor: '#fff3e0',
//         borderRadius: 8,
//         marginBottom: 16,
//     },
//     hintText: {
//         marginLeft: 8,
//         fontSize: 14,
//         color: '#ff8f00',
//         flex: 1,
//     },
//     actionButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     hintButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 8,
//     },
//     hintButtonText: {
//         marginLeft: 4,
//         color: '#FFA726',
//         fontSize: 14,
//     },
//     submitButton: {
//         backgroundColor: '#4CAF50',
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         borderRadius: 8,
//     },
//     disabledButton: {
//         backgroundColor: '#ccc',
//     },
//     submitButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     activityContainer: {
//         margin: 16,
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     activityTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 16,
//     },
//     activitySubtitle: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 12,
//     },
//     activityDescription: {
//         fontSize: 16,
//         color: '#666',
//         lineHeight: 24,
//     },
//     dragDropPair: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginVertical: 8,
//         padding: 12,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 8,
//     },
//     dragItem: {
//         backgroundColor: '#2196F3',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 6,
//     },
//     dropZone: {
//         backgroundColor: '#4CAF50',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 6,
//     },
//     dragItemText: {
//         color: 'white',
//         fontWeight: '600',
//     },
//     fillBlankContainer: {
//         marginVertical: 8,
//         alignItems: 'center',
//     },
//     fillBlankText: {
//         fontSize: 18,
//         color: '#333',
//         marginBottom: 8,
//     },
//     fillBlankInput: {
//         borderWidth: 2,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         padding: 12,
//         width: 60,
//         textAlign: 'center',
//         fontSize: 16,
//     },
//     keyPointButton: {
//         padding: 12,
//         marginVertical: 4,
//         backgroundColor: '#f5f5f5',
//         borderRadius: 8,
//         borderWidth: 2,
//         borderColor: 'transparent',
//     },
//     selectedKeyPoint: {
//         backgroundColor: '#e3f2fd',
//         borderColor: '#2196F3',
//     },
//     keyPointText: {
//         fontSize: 14,
//         color: '#333',
//     },
//     selectedKeyPointText: {
//         color: '#2196F3',
//         fontWeight: '600',
//     },
//     sampleSummaryContainer: {
//         marginTop: 20,
//         padding: 16,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 8,
//     },
//     sampleSummaryTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 8,
//     },
//     sampleSummaryText: {
//         fontSize: 14,
//         color: '#666',
//         lineHeight: 20,
//     },
//     writingContainer: {
//         margin: 16,
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     writingTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 12,
//     },
//     writingInstructions: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 20,
//         lineHeight: 20,
//     },
//     storyStartersContainer: {
//         marginBottom: 20,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 12,
//     },
//     storyStarterButton: {
//         padding: 12,
//         marginVertical: 4,
//         backgroundColor: '#f0f4ff',
//         borderRadius: 8,
//         borderLeftWidth: 4,
//         borderLeftColor: '#2196F3',
//     },
//     storyStarterText: {
//         fontSize: 14,
//         color: '#333',
//         lineHeight: 20,
//     },
//     writingInput: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         padding: 16,
//         height: 200,
//         fontSize: 16,
//         color: '#333',
//     },
//     experimentContainer: {
//         margin: 16,
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     experimentTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 12,
//     },
//     experimentInstructions: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 20,
//         lineHeight: 20,
//     },
//     conceptsContainer: {
//         marginBottom: 20,
//     },
//     conceptItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 4,
//     },
//     conceptText: {
//         marginLeft: 8,
//         fontSize: 14,
//         color: '#333',
//         flex: 1,
//     },
//     experimentsContainer: {
//         marginTop: 20,
//     },
//     experimentCard: {
//         padding: 16,
//         marginVertical: 8,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 8,
//         borderLeftWidth: 4,
//         borderLeftColor: '#FF5722',
//     },
//     experimentName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 4,
//     },
//     experimentProcedure: {
//         fontSize: 14,
//         color: '#666',
//         lineHeight: 20,
//     },
//     completionContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     completionContent: {
//         alignItems: 'center',
//         backgroundColor: 'white',
//         padding: 40,
//         borderRadius: 20,
//         width: '100%',
//         maxWidth: 350,
//         elevation: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//     },
//     rewardIcon: {
//         marginBottom: 20,
//     },
//     completionTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 16,
//         textAlign: 'center',
//     },
//     rewardText: {
//         fontSize: 16,
//         color: '#666',
//         textAlign: 'center',
//         marginBottom: 24,
//         lineHeight: 24,
//     },
//     scoreContainer: {
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     scoreText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 12,
//     },
//     scoreBar: {
//         width: 200,
//         height: 8,
//         backgroundColor: '#e0e0e0',
//         borderRadius: 4,
//         overflow: 'hidden',
//     },
//     scoreProgress: {
//         height: '100%',
//         backgroundColor: '#4CAF50',
//         borderRadius: 4,
//     },
//     continueButton: {
//         backgroundColor: '#4CAF50',
//         paddingHorizontal: 32,
//         paddingVertical: 16,
//         borderRadius: 12,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     continueButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: '600',
//     },
// });

// export default LessonScreen;


// screens/LessonScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

import { router, useLocalSearchParams } from 'expo-router';

import { Lesson as ImportedLesson } from '@/types/types';
import {
    MathLessonComponent,
    ScienceLessonComponent,
    EnglishLessonComponent,
} from '@/components/lessons';

// Extend Lesson type to include 'type' if not present
type Lesson = ImportedLesson & { type: 'math' | 'science' | 'english' };

type RootStackParamList = {
    LessonScreen: {
        lessonId: string;
        subject: string;
        module: string;
    };
};

type LessonScreenRouteProp = RouteProp<RootStackParamList, 'LessonScreen'>;
type LessonScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LessonScreen'
>;

interface LessonScreenProps {
    route: LessonScreenRouteProp;
    navigation: LessonScreenNavigationProp;
}

// Component mapping strategy
const LessonComponentMap = {
    math: MathLessonComponent,
    science: ScienceLessonComponent,
    english: EnglishLessonComponent,
} as const;

export const LessonScreen: React.FC<LessonScreenProps> = ({
    route,
    navigation,
}) => {
    
    const { lessonId, subject, module } = useLocalSearchParams();
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        // Simulate fetching lesson data and ensure required properties are present
        // Replace this with your actual data fetching logic
        async function fetchLesson() {
            try {
                setLoading(true);
                // Example: fetch lesson data from API or local source
                // Here we just mock the lesson object for demonstration
                // Make sure to include content, subject, and module
                const fetchedLesson = {
                    title: 'Sample Math Lesson',
                    type: subject as 'math' | 'science' | 'english',
                    content: {}, // Replace with actual content
                    subject: subject || 'math',
                    module: module || 'Module 1',
                    // ...other properties as needed
                };
                setLesson(fetchedLesson);
                setLoading(false);
            } catch (err: any) {
                setError('Failed to load lesson.');
                setLoading(false);
            }
        }
        fetchLesson();
    }, [lessonId, subject, module]);

    const renderLessonContent = () => {
        if (!lesson) return null;

        switch (lesson.type) {
            case 'math':
                return <MathLessonComponent lesson={lesson} />;
            case 'science':
                return <ScienceLessonComponent lesson={lesson} />;
            case 'english':
                return <EnglishLessonComponent lesson={lesson} />;
            default:
                return (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            Unsupported lesson type: {lesson.type}
                        </Text>
                    </View>
                );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading lesson...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {lesson && (
                <View style={styles.header}>
                    <Text style={styles.title}>{lesson.title}</Text>
                    <Text style={styles.subtitle}>
                        {lesson.subject.charAt(0).toUpperCase() +
                            lesson.subject.slice(1)}{' '}
                        • {lesson.module}
                    </Text>
                </View>
            )}
            {renderLessonContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#f44336',
        textAlign: 'center',
    },
});
