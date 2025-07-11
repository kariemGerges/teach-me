// components/LessonComponents/ScienceLessonComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ScienceLesson } from '@/types/types';

interface ScienceLessonComponentProps {
    lesson: ScienceLesson;
}

export const ScienceLessonComponent: React.FC<ScienceLessonComponentProps> = ({
    lesson,
}) => {
    const { content } = lesson;

    return (
        <ScrollView style={styles.container}>
            {content.theory && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Theory</Text>
                    <Text style={styles.theory}>{content.theory}</Text>
                </View>
            )}

            {content.diagrams && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diagrams</Text>
                    {content.diagrams.map((diagram, index) => (
                        <View key={index} style={styles.diagramContainer}>
                            <Image
                                source={{ uri: diagram }}
                                style={styles.diagram}
                            />
                        </View>
                    ))}
                </View>
            )}

            {content.experiments && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experiments</Text>
                    {content.experiments.map((experiment, index) => (
                        <View key={index} style={styles.experiment}>
                            <Text style={styles.experimentTitle}>
                                {experiment.title}
                            </Text>

                            <Text style={styles.subTitle}>Materials:</Text>
                            {experiment.materials.map((material, idx) => (
                                <Text key={idx} style={styles.listItem}>
                                    • {material}
                                </Text>
                            ))}

                            <Text style={styles.subTitle}>Procedure:</Text>
                            {experiment.procedure.map((step, idx) => (
                                <Text key={idx} style={styles.listItem}>
                                    {idx + 1}. {step}
                                </Text>
                            ))}

                            <Text style={styles.subTitle}>Observation:</Text>
                            <Text style={styles.observation}>
                                {experiment.observation}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {content.facts && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Key Facts</Text>
                    {content.facts.map((fact, index) => (
                        <Text key={index} style={styles.fact}>
                            • {fact}
                        </Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#4CAF50',
    },
    theory: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'justify',
    },
    diagramContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    diagram: {
        width: 200,
        height: 150,
        borderRadius: 8,
    },
    experiment: {
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    experimentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 4,
    },
    listItem: {
        fontSize: 12,
        marginBottom: 2,
        paddingLeft: 8,
    },
    observation: {
        fontSize: 12,
        fontStyle: 'italic',
        paddingLeft: 8,
    },
    fact: {
        fontSize: 14,
        marginBottom: 4,
        paddingLeft: 8,
    },
});
