'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import { useAppState } from '../providers.jsx';
import { findEntryByStub } from '../../utils.js';
import data from '../../data/conversations.json';

const styles = {
  homeContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageContainer: {
    height: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'stretch',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 400,
  },
  image: {
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
  chat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem',
    padding: '1rem',
    background: 'url("/images/site/chat-background.png") repeat top left',
  },
  message: {
    position: 'relative',
    display: 'inline-block',
    background: 'rgb(255 255 255)',
    padding: '0.5rem 1rem',
    border: '3px solid transparent',
    borderRadius: '8px',
    maxWidth: '80%',
    wordWrap: 'break-word',
    color: 'rgb(10 10 10)',
    boxShadow: 'rgb(11 20 26 / 13%) 0px 1px 0.5px 0px',
    cursor: 'pointer',
  },
  messageRight: {
    alignSelf: 'flex-end',
    background: 'rgb(217 253 211)',
    textAlign: 'right',
  },
  highlightedMessage: {
    border: '3px solid rgb(124 205 255)',
  },
};

export default function StubPage({ params }) {
  const { helperLanguage } = useAppState();
  const [stub, setStub] = useState('home');
  const [page, setPage] = useState({});
  const [highlightedMessage, setHighlightedMessage] = useState(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    async function grabStub() {
      const p = await params;

      setStub(p.stub);
    }

    const listener = (event) => {
      const key = event.key;

      if (key === 'Escape') {
        setHighlightedMessage(null);
      } else if (key === 'ArrowDown') {
        let nextStep = highlightedMessage === null ? 1 : highlightedMessage + 1;

        if (nextStep > page.speech.length) {
          nextStep = null;
        }

        setHighlightedMessage(nextStep);
      } else if (key === 'ArrowUp') {
        let nextStep = highlightedMessage === null ? page.speech.length : highlightedMessage - 1;

        if (nextStep < 1) {
          nextStep = null;
        }

        setHighlightedMessage(nextStep);
      }
    };

    setPage(findEntryByStub(data, stub));

    document.addEventListener('keydown', listener);

    grabStub();

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [highlightedMessage, page, params, setStub, stub]);

  if (stub === 'home' || page === null) {
    return (
      <Box sx={styles.homeContainer}>
        <Image src="/images/site/home.webp" alt="Reading a book" width={500} height={500} priority />
      </Box>
    );
  }

  const handleClick = (messageNumber) => {
    setHighlightedMessage(messageNumber);
  };

  const widthStyle = matches ? { flex: '1 1 50%', maxWidth: '50%' } : {};

  return (
    <Stack sx={styles.pageContainer} direction={{ sm: 'column', md: 'row' }}>
      <Box sx={{ ...widthStyle, ...styles.imageContainer }}>
        <Image
          src={`/images/${page.img}`}
          alt="A scene representing this conversation."
          style={styles.image}
          fill
          priority
        />
      </Box>
      <Box sx={{ ...widthStyle, ...styles.chat }}>
        {page.speech.map((msg, index) => {
          const messageNumber = index + 1;
          let style = styles.message;

          if (msg.hasOwnProperty('right')) {
            style = { ...style, ...styles.messageRight };
          }

          if (messageNumber === highlightedMessage) {
            style = { ...style, ...styles.highlightedMessage };
          }

          return (
            <Box key={`${msg.eng}.${index}`} sx={style} onClick={() => handleClick(messageNumber)}>
              <Typography fontSize={24}>{msg.eng}</Typography>
              {msg.hasOwnProperty(helperLanguage) ? <Typography fontSize={18} data-lang={helperLanguage}>{msg[helperLanguage]}</Typography> : null}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
