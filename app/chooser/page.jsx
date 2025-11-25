'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import data from '../../data/chooser.json';

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
  },
  item: {
    maxWidth: 'fit-content',
    py: 1,
    px: 2,
  },
  promptItem: {
    cursor: 'pointer',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  },
  choiceStack: {
    overflow: 'auto',
    py: 4,
    width: '100%',
  },
  choiceItem: {
    border: '1px dashed',
  },
};

function getRandomEntries(arr1, arr2) {
  // crypto-safe random integer
  const rand = max =>
    crypto.getRandomValues(new Uint32Array(1))[0] % max;

  // choose 1 from arr1
  const item1 = arr1[rand(arr1.length)];

  // pick 2 unique from arr2 using crypto
  const arr2Copy = [...arr2];
  const item2 = arr2Copy.splice(rand(arr2Copy.length), 1)[0];
  const item3 = arr2Copy.splice(rand(arr2Copy.length), 1)[0];

  const result = [item1, item2, item3];

  // final shuffle (Fisher–Yates w/ crypto)
  for (let i = result.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getAllResponses(key) {
  const allResponses = [];
  const keys = Object.keys(data.responses).filter((k) => k !== key);

  keys.forEach((r) => {
    data.responses[r].forEach((item) => {
      if (!allResponses.includes(item)) {
        allResponses.push(item);
      }
    });
  });

  return allResponses;
}

export default function Chooser() {
  const [prompt, setPrompt] = useState(false);
  const [usedResponses, setUsedReponses] = useState([]);

  if (!prompt) {
    return (
      <Container maxWidth="md" sx={{ ...styles.container, alignItems: 'center' }}>
        <Stack gap={3}>
          {data.prompts.map((p) => {
            return (
              <Paper key={p.key} sx={{ ...styles.item, ...styles.promptItem }} onClick={() => setPrompt(p)}>
                <Typography variant="h5">{p.prompt}</Typography>
              </Paper>
            );
          })}
        </Stack>
      </Container>
    );
  }

  const responses = data.responses[prompt.key].filter((r) => !usedResponses.includes(r));
  const availableChoices = getRandomEntries(responses, getAllResponses(prompt.key));

  const handleChoice = (choice) => {
    setUsedReponses([...usedResponses, choice]);
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Stack sx={styles.choiceStack}>
        <Paper sx={styles.item}>
          <Typography variant="h4">{prompt.prompt}</Typography>
        </Paper>
        <Divider sx={{ my: 4 }} />
        <Stack direction="column" gap={1} sx={{ alignItems: 'end' }}>
          {usedResponses.map((r) => {
            return (
              <Paper sx={styles.item} key={r}>
                <Typography variant="h4">{r}</Typography>
              </Paper>
            );
          })}
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Stack direction="column" gap={1} sx={{ alignItems: 'end' }}>
          {usedResponses.length < 5 && availableChoices.map((a) => {
            const style = { ...styles.item, ...styles.promptItem, ...styles.choiceItem };

            return (
              <Paper sx={style} key={a} onClick={() => handleChoice(a)}>
                <Typography variant="h4">{a}</Typography>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}
