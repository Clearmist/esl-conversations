'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ReplyIcon from '@mui/icons-material/Reply';
import storiesData from '../../data/stories.json';

const styles = {
    container: {
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    selectionWrapper: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        padding: 4,
        gap: 2,
    },
    selectionContainer: {
        display: 'flex',
        gap: 2,
    },
    storySelection: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'start',
    },
    titleHeader: {
        paddingLeft: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    storyCard: {
        cursor: 'pointer',
        '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-4px)',
        },
        transition: 'all 0.3s ease',
    },
    contentContainer: {
        display: 'flex',
        gap: 3,
        marginTop: 2,
        minHeight: 'calc(100vh - 100px)',
    },
    leftColumn: (imageName) => ({
        flex: 1,
        backgroundImage: `url(/images/stories/${imageName})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
        borderRadius: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        gap: 2,
        overflow: 'auto',
    }),
    rightColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflow: 'auto',
        maxHeight: '100vh',
    },
    notebookPage: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: '1px solid brown',
        borderRadius: 2,
        '& p': {
            fontFamily: '"Times New Roman", Times, serif',
        },
        mb: 1,
    },
    wordCard: {
        cursor: 'grab',
        '&:active': {
            cursor: 'grabbing',
        },
        backgroundColor: 'rgb(227 242 253 / 96%)',
        border: '2px solid #1976d2',
        textAlign: 'center',
        userSelect: 'none',
        padding: 1,
        flex: '0 1 calc(25% - 12px)',
        minWidth: '100px',
    },
    sentenceCard: {
        display: 'flex',
        alignItems: 'center',
        padding: 2,
    },
    sentenceText: {
        fontSize: '1.3rem',
        lineHeight: 1.6,
    },
    translationText: {
        fontSize: '1.1rem',
        color: '#666',
        marginTop: 1,
    },
    wordPlaceholder: {
        display: 'inline',
        padding: '4px 8px',
        backgroundColor: '#fff59d',
        borderRadius: '4px',
        fontWeight: 'bold',
        border: '2px dashed #f57f17',
    },
    insertedWord: {
        display: 'inline',
        padding: '4px 8px',
        backgroundColor: '#c8e6c9',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: '2px solid #388e3c',
        '&:hover': {
            backgroundColor: '#a5d6a7',
        },
    },
    backButton: {
        marginBottom: 2,
    },
};

export default function Stories() {
    const [selectedStory, setSelectedStory] = useState(null);
    const [insertedWords, setInsertedWords] = useState({});
    const [draggedWord, setDraggedWord] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    if (selectedStory === null) {
        return (
            <Box sx={styles.selectionWrapper}>
                <Paper sx={{ height: '50%', width: '50%' }}>
                    <img src="/images/stories/notebook.jpg" style={{ width: '100%', height: '100%' }} />
                </Paper>
                <Box sx={styles.storySelection}>
                    <Typography variant="h5" gutterBottom>
                        Repair a clumsy naturalist's notebook.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Починить блокнот неуклюжего натуралиста.
                    </Typography>
                    <Box sx={styles.selectionContainer}>
                        {storiesData.map((story, index) => (
                            <Card
                                key={index}
                                sx={styles.storyCard}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    console.debug(`Selected story: ${story.name} (${index}).`);

                                    setSelectedStory(index);
                                    setInsertedWords({});
                                    setDraggedWord(null);
                                }}
                            >
                                <CardContent sx={{ cursor: 'pointer' }}>
                                    <Typography variant="h6">{story.name}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Box>
        );
    }

    const story = storiesData[selectedStory];
    const availableWords = story.words.filter(
        (word) => !Object.values(insertedWords).includes(word)
    );

    const renderSentenceContent = (sentenceIndex) => {
        const sentence = story.sentences[sentenceIndex];
        const english = sentence.english;
        const insertedWord = insertedWords[sentenceIndex];

        if (!english.includes('{{word}}')) {
            return english;
        }

        return english.split('{{word}}').map((part, idx) => (
            <span key={idx}>
                {part}
                {idx < english.split('{{word}}').length - 1 && (
                    <>
                        {insertedWord ? (
                            <Box
                                component="span"
                                sx={styles.insertedWord}
                                onClick={() => {
                                    const newInserted = { ...insertedWords };
                                    delete newInserted[sentenceIndex];
                                    setInsertedWords(newInserted);
                                }}
                            >
                                {insertedWord}
                            </Box>
                        ) : (
                            <Box component="span" sx={styles.wordPlaceholder}>
                                ...
                            </Box>
                        )}
                    </>
                )}
            </span>
        ));
    };

    return (
        <Box sx={styles.container}>
            <Box sx={styles.titleHeader}>
                <IconButton aria-label="delete" size="large" onClick={() => setSelectedStory(null)}>
                    <ReplyIcon fontSize="inherit" />
                </IconButton>

                <Typography variant="h4">
                    {story.name}
                </Typography>
            </Box>

            <Box sx={styles.contentContainer}>
                {/* Left Column - Words */}
                <Box sx={styles.leftColumn(story.image)}>
                    {availableWords.map((word, index) => (
                        <Card
                            key={index}
                            sx={styles.wordCard}
                            draggable
                            onDragStart={(e) => {
                                setDraggedWord(word);
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragEnd={() => setDraggedWord(null)}
                        >
                            <CardContent sx={{ padding: '8px !important' }}>
                                <Typography variant="body1">{word}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Right Column - Sentences */}
                <Box sx={styles.rightColumn}>
                    <Paper sx={{ p: 2 }}>
                        <Typography sx={styles.sentenceText}>{story.introduction.english}</Typography>
                        <Typography sx={styles.translationText}>{story.introduction.translation}</Typography>
                    </Paper>
                    <Paper sx={styles.notebookPage}>
                        {story.sentences.map((sentence, index) => {
                            const hasPlaceholder = sentence.english.includes('{{word}}');
                            const style = { ...styles.sentenceCard };

                            if (dragOverIndex === index && hasPlaceholder) {
                                style.border = '1px dashed #1976d2';
                            } else {
                                style.borderBottom = '1px solid brown';
                                style.borderTop = '1px solid transparent';
                                style.borderLeft = '1px solid transparent';
                                style.borderRight = '1px solid transparent';
                            }

                            return (
                                <Box
                                    key={index}
                                    sx={style}
                                    onDragOver={hasPlaceholder ? (e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                        setDragOverIndex(index);
                                    } : undefined}
                                    onDragLeave={hasPlaceholder ? () => {
                                        setDragOverIndex(null);
                                    } : undefined}
                                    onDrop={hasPlaceholder ? (e) => {
                                        e.preventDefault();
                                        setDragOverIndex(null);
                                        if (draggedWord) {
                                            setInsertedWords({
                                                ...insertedWords,
                                                [index]: draggedWord,
                                            });
                                            setDraggedWord(null);
                                        }
                                    } : undefined}
                                >
                                    <Box>
                                        <Typography sx={styles.sentenceText}>
                                            {renderSentenceContent(index)}
                                        </Typography>
                                        {sentence.translation && (
                                            <Typography sx={styles.translationText}>
                                                {sentence.translation}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}