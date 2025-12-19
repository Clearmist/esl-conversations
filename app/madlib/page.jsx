'use client';

import { useState } from 'react';
import { Box, Button, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import madlibs from '../../data/madlibs.json';
import entries from '../../data/madlibs-entries.json';

const styles = {
  // Generic layouts
  selectRoot: {
    minHeight: '100vh',
    py: 4,
    background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
  },
  playRoot: {
    minHeight: '100vh',
    py: 4,
    background: 'linear-gradient(135deg, #faf5ff 0%, #ffe4e6 100%)',
  },
  completeRoot: {
    minHeight: '100vh',
    py: 4,
    background: 'linear-gradient(135deg, #ecfccb 0%, #dbeafe 100%)',
  },
  // Common containers / titles
  pageTitle: {
    textAlign: 'center',
    fontWeight: 800,
    mb: 4,
    color: 'text.primary',
  },
  progressText: {
    textAlign: 'center',
    color: 'text.secondary',
    mb: 2,
  },
  // Selection screen
  madlibCardButton: {
    width: '100%',
    textTransform: 'none',
    justifyContent: 'flex-start',
    p: 3,
    bgcolor: '#fff',
    borderRadius: 2,
    border: '2px solid',
    borderColor: 'secondary.200',
    boxShadow: 3,
    transition: 'box-shadow .2s, border-color .2s',
    '&:hover': { boxShadow: 6, borderColor: 'secondary.main', bgcolor: '#faf5ff' },
  },
  madlibCardTitle: {
    fontWeight: 700,
    color: 'text.primary',
  },
  // Template display
  templateWrapper: {
    overflow: 'hidden',
    mb: 3,
    padding: 2,
  },
  templatePaperBase: {
    p: 4,
    borderRadius: 3,
    boxShadow: 6,
    bgcolor: '#fff',
    transition: 'transform 500ms',
  },
  templateText: {
    fontSize: '1.25rem',
    lineHeight: 1.75,
    color: 'text.primary',
  },
  placeholderActive: {
    fontWeight: 700,
    color: 'primary.main',
    backgroundColor: 'primary.50',
    px: 0.5,
    py: 0.25,
    borderRadius: 1,
    display: 'inline-block',
  },
  placeholderInactive: {
    color: 'text.disabled',
  },
  // Highlight for filled substitutions
  placeholderFilled: {
    fontWeight: 700,
    color: grey[900],
    backgroundColor: blue[50],
    px: 1,
    py: 0.25,
    my: 0.25,
    borderRadius: 1,
    display: 'inline-block',
  },
  // Selection panel
  panelPaper: {
    p: 3,
    borderRadius: 3,
    boxShadow: 6,
    bgcolor: '#fff',
  },
  categoryTitle: {
    fontWeight: 700,
    mb: 2,
    color: 'text.primary',
  },
  wordButton: {
    width: '100%',
    textTransform: 'none',
    bgcolor: 'primary.50',
    color: 'text.primary',
    border: '2px solid',
    borderColor: 'primary.200',
    '&:hover': { bgcolor: 'primary.100', borderColor: 'primary.main' },
  },
  noWordsText: {
    textAlign: 'center',
    color: 'text.secondary',
    py: 2,
  },
  // Final screen
  finalPaper: {
    p: 4,
    borderRadius: 3,
    boxShadow: 8,
    bgcolor: '#fff',
  },
  playAgainButton: {
    mt: 4,
    display: 'block',
    mx: 'auto',
    px: 4,
    py: 1.5,
    fontWeight: 700,
  },
};

export default function MadlibGame() {
  const [selectedMadlib, setSelectedMadlib] = useState(null);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [filledTemplates, setFilledTemplates] = useState([]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(null);
  const [usedWords, setUsedWords] = useState({});
  const [customValues, setCustomValues] = useState({});
  const [slideDirection, setSlideDirection] = useState('in');
  const [isComplete, setIsComplete] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState('');
  const [translateError, setTranslateError] = useState('');
  const [isTranslatingRu, setIsTranslatingRu] = useState(false);
  const [translationRu, setTranslationRu] = useState('');
  const [translateErrorRu, setTranslateErrorRu] = useState('');

  // Extract placeholders from a template string
  const extractPlaceholders = (template) => {
    const regex = /\{([^}]+)\}/g;
    const placeholders = [];
    let match;
    while ((match = regex.exec(template)) !== null) {
      placeholders.push(match[1]);
    }
    return placeholders;
  };

  // Get category entries by ID
  const getCategoryById = (id) => {
    return entries.find(cat => cat.id === id);
  };

  // Get available words for a category (not used yet)
  const getAvailableWords = (categoryId) => {
    const category = getCategoryById(categoryId);
    if (!category) return [];

    const used = usedWords[categoryId] || [];
    const filtered = category.entries.filter(word => !used.includes(word));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, Math.min(12, shuffled.length));

    return limited;
  };

  // Start a new madlib
  const startMadlib = (madlib) => {
    setSelectedMadlib(madlib);
    setCurrentTemplateIndex(0);
    setFilledTemplates([]);
    setUsedWords({});
    setCustomValues({});
    setIsComplete(false);
    setSlideDirection('in');

    // Get first placeholder
    const placeholders = extractPlaceholders(madlib.templates[0]);
    setCurrentPlaceholder(placeholders[0] || null);
  };

  // Handle word selection
  const selectWord = (word) => {
    if (!currentPlaceholder || !selectedMadlib) return;

    const baseTemplate = selectedMadlib.templates[currentTemplateIndex];
    // Use the progressively filled template for accurate placeholder ordering
    let updatedTemplate = filledTemplates[currentTemplateIndex] || baseTemplate;

    // Replace only one occurrence for non-custom; replace all for custom
    if (currentPlaceholder.startsWith('custom')) {
      const re = new RegExp(`\\{${currentPlaceholder}\\}`, 'g');
      const marker = `[[HL|${currentPlaceholder}|${word}]]`;
      updatedTemplate = updatedTemplate.replace(re, marker);
    } else {
      const marker = `[[HL|${currentPlaceholder}|${word}]]`;
      updatedTemplate = updatedTemplate.replace(`{${currentPlaceholder}}`, marker);
    }

    const newFilledTemplates = [...filledTemplates];
    newFilledTemplates[currentTemplateIndex] = updatedTemplate;
    setFilledTemplates(newFilledTemplates);

    // Mark word as used (if not custom)
    if (!currentPlaceholder.startsWith('custom')) {
      const categoryId = currentPlaceholder;
      const newUsedWords = { ...usedWords };
      if (!newUsedWords[categoryId]) newUsedWords[categoryId] = [];
      newUsedWords[categoryId].push(word);
      setUsedWords(newUsedWords);
    }

    // Determine next placeholder from the updated template
    let remaining = extractPlaceholders(updatedTemplate);
    // Auto-fill any saved custom placeholders without prompting
    while (remaining.length > 0 && remaining[0].startsWith('custom') && customValues[remaining[0]]) {
      const key = remaining[0];
      const val = customValues[key];
      const marker = `[[HL|${key}|${val}]]`;
      const re = new RegExp(`\\{${key}\\}`, 'g');
      updatedTemplate = updatedTemplate.replace(re, marker);
      const autoFilledTemplates = [...newFilledTemplates];
      autoFilledTemplates[currentTemplateIndex] = updatedTemplate;
      setFilledTemplates(autoFilledTemplates);
      remaining = extractPlaceholders(updatedTemplate);
    }

    if (remaining.length > 0) {
      setCurrentPlaceholder(remaining[0]);
      return;
    }

    // No placeholders remain in this template; move to next
    if (currentTemplateIndex < selectedMadlib.templates.length - 1) {
      setSlideDirection('out');
      setTimeout(() => {
        const nextIndex = currentTemplateIndex + 1;
        setCurrentTemplateIndex(nextIndex);
        // Pre-fill known custom values in the upcoming template
        let nextTemplate = selectedMadlib.templates[nextIndex];
        Object.entries(customValues).forEach(([key, value]) => {
          const re = new RegExp(`\\{${key}\\}`, 'g');
          nextTemplate = nextTemplate.replace(re, `[[HL|${key}|${value}]]`);
        });
        const nextFilled = [...newFilledTemplates];
        nextFilled[nextIndex] = nextTemplate;
        setFilledTemplates(nextFilled);
        const nextPlaceholders = extractPlaceholders(nextTemplate);
        setCurrentPlaceholder(nextPlaceholders[0] || null);
        setSlideDirection('in');
      }, 500);
    } else {
      // All templates complete
      setIsComplete(true);
      setCurrentPlaceholder(null);
    }
  };

  // Handle custom input
  const handleCustomInput = (value) => {
    if (!currentPlaceholder || !currentPlaceholder.startsWith('custom')) return;

    const newCustomValues = { ...customValues };
    newCustomValues[currentPlaceholder] = value;
    setCustomValues(newCustomValues);
  };

  const submitCustomValue = () => {
    const value = customValues[currentPlaceholder];
    if (value && value.trim()) {
      selectWord(value.trim());
    }
  };

  // Sanitize template strings for translation: replace highlight markers with words
  const stripHighlightMarkers = (text) => {
    return text.replace(/\[\[HL\|[^|]+\|([^\]]+)\]\]/g, '$1');
  };

  const translateToPolish = async () => {
    try {
      setIsTranslating(true);
      setTranslateError('');
      setTranslation('');
      const lines = filledTemplates.map(t => stripHighlightMarkers(t));
      const results = await Promise.all(lines.map(async (line) => {
        if (!line || !line.trim()) return '';
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(line)}&langpair=en|pl`;
        const r = await fetch(url, { headers: { 'accept': 'application/json' } });
        if (!r.ok) throw new Error(`Translation failed (${r.status})`);
        const data = await r.json();
        return (data && data.responseData && data.responseData.translatedText) ? data.responseData.translatedText : '';
      }));
      setTranslation(results.join('\n'));
    } catch (e) {
      setTranslateError(e.message || 'Translation error');
    } finally {
      setIsTranslating(false);
    }
  };

  const translateToRussian = async () => {
    try {
      setIsTranslatingRu(true);
      setTranslateErrorRu('');
      setTranslationRu('');
      const lines = filledTemplates.map(t => stripHighlightMarkers(t));
      const results = await Promise.all(lines.map(async (line) => {
        if (!line || !line.trim()) return '';
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(line)}&langpair=en|ru`;
        const r = await fetch(url, { headers: { 'accept': 'application/json' } });
        if (!r.ok) throw new Error(`Translation failed (${r.status})`);
        const data = await r.json();
        return (data && data.responseData && data.responseData.translatedText) ? data.responseData.translatedText : '';
      }));
      setTranslationRu(results.join('\n'));
    } catch (e) {
      setTranslateErrorRu(e.message || 'Translation error');
    } finally {
      setIsTranslatingRu(false);
    }
  };

  // Get current template text with replacements for custom placeholders
  const getCurrentTemplateText = () => {
    if (!selectedMadlib) return '';

    let template = filledTemplates[currentTemplateIndex] || selectedMadlib.templates[currentTemplateIndex];

    // Replace custom placeholders that have been filled before
    Object.entries(customValues).forEach(([key, value]) => {
      // wrap for display so substituted words are highlighted
      const marked = `[[HL|${key}|${value}]]`;
      template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), marked);
    });

    return template;
  };

  if (!selectedMadlib) {
    return (
      <Box sx={styles.selectRoot}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={styles.pageTitle}>Madlibs Game</Typography>
          <Grid container spacing={2}>
            {madlibs.map((madlib, index) => (
              <Grid item xs={12} key={index}>
                <Button onClick={() => startMadlib(madlib)} sx={styles.madlibCardButton}>
                  <Typography variant="h5" sx={styles.madlibCardTitle}>{madlib.title}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (isComplete) {
    return (
      <Box sx={styles.completeRoot}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={styles.pageTitle}>{selectedMadlib.title}</Typography>
          <Stack spacing={2} sx={styles.finalPaper} component={Paper}>
            {filledTemplates.map((template, index) => (
              <Typography key={index} component="div" variant="body1" sx={{ lineHeight: 1.8 }}>
                {(() => {
                  const tokenRegex = /(\{[^}]+\}|\[\[HL\|[^|]+\|[^\]]+\]\])/g;
                  const parts = template.split(tokenRegex);
                  return parts.map((part, i) => {
                    if (!part) return null;
                    if (part.startsWith('[[HL|')) {
                      const m = part.match(/^\[\[HL\|([^|]+)\|([^\]]+)\]\]$/);
                      if (m) {
                        const [, catId, word] = m;
                        return (
                          <Box key={`f-${index}-${i}`} component="span" sx={styles.placeholderFilled} title={catId}>
                            {word}
                          </Box>
                        );
                      }
                    }
                    if (part.startsWith('{') && part.endsWith('}')) {
                      return (
                        <Box key={`f-${index}-${i}`} component="span" sx={styles.placeholderInactive}>
                          {part}
                        </Box>
                      );
                    }
                    return <Box key={`f-${index}-${i}`} component="span">{part}</Box>;
                  });
                })()}
              </Typography>
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button
              onClick={translateToPolish}
              variant="contained"
              color="secondary"
              disabled={isTranslating}
            >
              {isTranslating ? 'Translating…' : 'Translate to Polish'}
            </Button>
            <Button
              onClick={translateToRussian}
              variant="contained"
              color="secondary"
              disabled={isTranslatingRu}
            >
              {isTranslatingRu ? 'Translating…' : 'Translate to Russian'}
            </Button>
          </Stack>
          {translateError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>{translateError}</Typography>
          )}
          {translateErrorRu && (
            <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>{translateErrorRu}</Typography>
          )}
          {translation && (
            <Paper sx={{ mt: 2, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Polish Translation</Typography>
              {translation.split('\n').map((line, i) => (
                <Typography key={i} variant="body1" sx={{ lineHeight: 1.8 }}>{line}</Typography>
              ))}
            </Paper>
          )}
          {translationRu && (
            <Paper sx={{ mt: 2, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Russian Translation</Typography>
              {translationRu.split('\n').map((line, i) => (
                <Typography key={i} variant="body1" sx={{ lineHeight: 1.8 }}>{line}</Typography>
              ))}
            </Paper>
          )}
          <Button onClick={() => setSelectedMadlib(null)} variant="contained" color="primary" sx={styles.playAgainButton}>
            Play Again
          </Button>
        </Container>
      </Box>
    );
  }

  const currentTemplate = getCurrentTemplateText();
  const isCustomPlaceholder = currentPlaceholder && currentPlaceholder.startsWith('custom');
  const availableWords = isCustomPlaceholder ? [] : getAvailableWords(currentPlaceholder);
  const category = isCustomPlaceholder ? null : getCategoryById(currentPlaceholder);

  return (
    <Box sx={styles.playRoot}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={styles.pageTitle}>{selectedMadlib.title}</Typography>
        <Typography variant="body2" sx={styles.progressText}>
          Prompt {currentTemplateIndex + 1} of {selectedMadlib.templates.length}
        </Typography>

        {/* Template Display with Slide Animation */}
        <Box sx={styles.templateWrapper}>
          <Paper
            sx={{
              ...styles.templatePaperBase,
              transform: slideDirection === 'out' ? 'translateX(-100%)' : 'translateX(0)'
            }}
          >
            <Typography component="div" sx={styles.templateText}>
              {(() => {
                const tokenRegex = /(\{[^}]+\}|\[\[HL\|[^|]+\|[^\]]+\]\])/g;
                const parts = currentTemplate.split(tokenRegex);
                return parts.map((part, index) => {
                  if (!part) return null;
                  if (part.startsWith('[[HL|')) {
                    const m = part.match(/^\[\[HL\|([^|]+)\|([^\]]+)\]\]$/);
                    if (m) {
                      const [, catId, word] = m;
                      return (
                        <Box key={index} component="span" sx={styles.placeholderFilled} title={catId}>
                          {word}
                        </Box>
                      );
                    }
                  }
                  if (part.startsWith('{') && part.endsWith('}')) {
                    const placeholder = part.slice(1, -1);
                    if (placeholder === currentPlaceholder) {
                      return (
                        <Box key={index} component="span" sx={styles.placeholderActive}>
                          {part}
                        </Box>
                      );
                    }
                    return (
                      <Box key={index} component="span" sx={styles.placeholderInactive}>
                        {part}
                      </Box>
                    );
                  }
                  return <Box key={index} component="span">{part}</Box>;
                });
              })()}
            </Typography>
          </Paper>
        </Box>

        {/* Word Selection */}
        {currentPlaceholder && (
          <Paper sx={styles.panelPaper}>
            <Typography variant="h5" sx={styles.categoryTitle}>
              {isCustomPlaceholder ? (
                <>Enter a {currentPlaceholder.replace('custom-', '').replace(/-/g, ' ')}</>
              ) : (
                <>{category?.name || currentPlaceholder}</>
              )}
            </Typography>

            {isCustomPlaceholder ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  value={customValues[currentPlaceholder] || ''}
                  onChange={(e) => handleCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitCustomValue()}
                  placeholder="Type here..."
                />
                <Button
                  variant="contained"
                  onClick={submitCustomValue}
                  disabled={!customValues[currentPlaceholder]?.trim()}
                >
                  Submit
                </Button>
              </Stack>
            ) : (
              <Box sx={{ overflowY: 'auto', mt: 1 }}>
                <Grid container spacing={1.5}>
                  {availableWords.length > 0 ? (
                    availableWords.map((word, index) => (
                      <Grid item xs={6} md={4} lg={3} key={index}>
                        <Button onClick={() => selectWord(word)} sx={styles.wordButton}>
                          {word}
                        </Button>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={styles.noWordsText}>
                        No more words available in this category
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
}
