'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';
import { blue, brown } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { toggleString } from '../../utils';
import data from '../../data/definitions.json';

const SCALE = 2;
const CONTAINER_WIDTH = 544;
const CONTAINER_HEIGHT = 320;
const SPRITE_SIZE = 20;

const parallaxImages = {
  cnz: 5,
  forest: 4,
  mgz: 6,
};

const parallaxSpeeds = {
  1: 0,
  2: 15,
  3: 12,
  4: 8,
  5: 5,
  6: 2,
}

const charFrames = {
  knuckles: {
    idle: {
      count: 17,
      speed: 4,
    },
    run: {
      count: 4,
      speed: 0.4,
    },
    walk: {
      count: 8,
      speed: 0.8,
    },
    dash: {
      count: 4,
      speed: 0.4,
      height: 48,
      width: 48,
    },
  },
  robotnik: {
    idle: {
      count: 4,
      speed: 1,
      width: 68,
      height: 60,
    },
    walk: {
      count: 3,
      speed: 0.7,
      width: 44,
      height: 55,
    },
    run: {
      count: 6,
      speed: 0.8,
      height: 60,
      width: 60,
    },
    dash: {
      count: 3,
      speed: 0.8,
      height: 68,
      width: 68,
    },
  },
  sonic: {
    idle: {
      count: 2,
      speed: 0.6,
    },
    run: {
      count: 4,
      speed: 0.4,
    },
    walk: {
      count: 8,
      speed: 0.8,
    },
    dash: {
      count: 4,
      speed: 0.7,
      height: 48,
      width: 48,
    },
  },
  tails: {
    idle: {
      count: 14,
      speed: 2,
    },
    run: {
      count: 4,
      speed: 0.4,
    },
    walk: {
      count: 8,
      speed: 0.8,
      width: 54,
    },
    dash: {
      count: 4,
      speed: 0.7,
      height: 48,
      width: 48,
    },
  },
};

const spriteSheets = [
  '/images/definitions/sprite-sheet-flicky-12.png',
  '/images/definitions/sprite-sheet-flicky-11.png',
  '/images/definitions/sprite-sheet-flicky-1.png',
  '/images/definitions/sprite-sheet-flicky-2.png',
  '/images/definitions/sprite-sheet-flicky-3.png',
  '/images/definitions/sprite-sheet-flicky-4.png',
  '/images/definitions/sprite-sheet-flicky-5.png',
  '/images/definitions/sprite-sheet-flicky-6.png',
  '/images/definitions/sprite-sheet-flicky-7.png',
  '/images/definitions/sprite-sheet-flicky-8.png',
  '/images/definitions/sprite-sheet-flicky-9.png',
  '/images/definitions/sprite-sheet-flicky-10.png',
];

const styles = {
  containerWithScore: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  score: {
    height: 60,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    px: 6,
  },
  stackContainer: {
    height: '100vh',
    alignItems: 'center',
  },
  parallaxContainer: {
    width: CONTAINER_WIDTH * SCALE,
    height: CONTAINER_HEIGHT * SCALE,
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #333',
  },
  parallaxLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1088,
    height: CONTAINER_HEIGHT * SCALE,
    backgroundRepeat: 'repeat-x',
    backgroundSize: `${CONTAINER_WIDTH * SCALE}px ${CONTAINER_HEIGHT * SCALE}px`,
  },
  characterContainer: {
    position: 'absolute',
    bottom: 0,
    left: '40%',
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    // Render above the parallax layers.
    zIndex: 10,
  },
  finish: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(13 72 7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 13,
    top: 0,
    cursor: 'pointer',
  },
  finishChar: {
    imageRendering: 'pixelated',
    backgroundRepeat: 'no-repeat',
  },
  cardDeckContainer: {
    position: 'relative',
    width: 300,
    height: CONTAINER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: 300,
    height: 160,
    borderRadius: 12,
    border: `1px solid ${brown[900]}`,
    backgroundColor: brown[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flickyContainer: {
    width: '100%',
    height: '100%',
    zIndex: 11,
    position: 'relative',
  },
  choiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  settingChoice: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  cardSetChoiceContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
  },
  cardSetChoice: {
    py: 1,
    px: 2,
    fontSize: 30,
    cursor: 'pointer',
    '&.active': {
      backgroundColor: blue[200],
    },
  },
  maxScore: {
    height: 200,
    width: 200,
    zIndex: 12,
    position: 'absolute',
    bottom: 0,
    left: '24%',
    p: 0,
    m: 0,
  },
};

function getRandomElements(arr, num) {
  if (num > arr.length) {
    return arr;
  }

  const shuffled = arr.slice();

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, num);
}

function Layer({ bgKey, layer, speed = 'stop' }) {
  const animationSpeed = speed === 'fast' ? (parallaxSpeeds[layer] * 2) : parallaxSpeeds[layer];
  const style = {
    backgroundImage: `url('/images/definitions/parallax/${bgKey}_${layer}.png')`,
    zIndex: layer,
    '@keyframes parallax-move-double': {
      from: {
        backgroundPosition: '0 0',
      },
      to: {
        backgroundPosition: `-${544 * SCALE * 2}px 0`,
      },
    }
  };

  if (speed !== 'stop') {
    style.animation = `parallax-move-double ${animationSpeed}s linear infinite`;
    style.animationDuration = `${animationSpeed}s`;
  }

  return <Box sx={{ ...styles.parallaxLayer, ...style }} className={`layer-${layer}`} />;
}

function Character({ char = 'sonic', action = 'idle' }) {
  const imageFile = `sprite-sheet-${char}-${action}`;
  const frameCount = charFrames[char][action].count;
  const frameWidth = (charFrames[char][action]?.width ?? 48) * SCALE;
  const frameHeight = (charFrames[char][action]?.height ?? 48) * SCALE;
  const totalWidth = frameCount * (frameWidth * 2);

  console.debug(`Showing ${char} ${action}.`);

  let kf = keyframes`
    from { background-position: 0 0; }
    to { background-position: -${totalWidth}px 0; }
  `;

  const style = {
    backgroundImage: `url('/images/definitions/${imageFile}.png')`,
    animation: `${kf} ${charFrames[char][action].speed}s steps(${frameCount}) infinite`,
    width: frameWidth * 2,
    height: frameHeight * 2,
  };

  return <Box sx={{ ...styles.characterContainer, ...style }} />;
}

function Finish({ char = 'sonic', onClick }) {
  const style = {
    backgroundImage: `url('/images/definitions/sprite-sheet-${char}-finish.png')`,
    width: '100%',
    height: '100%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  };

  return (
    <Box className="finishing-animation" sx={styles.finish} onClick={onClick}>
      <Box sx={{ ...styles.finishChar, ...style }} />
    </Box>
  );
}

function Flicky({ src, anchor }) {
  const { x: anchorX, y: anchorY } = anchor;

  const radius = SPRITE_SIZE;
  const minX = Math.max(0, anchorX - radius);
  const maxX = Math.min((CONTAINER_WIDTH * SCALE) - (SPRITE_SIZE * SCALE), anchorX + radius);
  const minY = Math.max(10, anchorY - radius);
  const maxY = Math.min((CONTAINER_HEIGHT * SCALE) - (SPRITE_SIZE * SCALE), anchorY + radius);
  const duration = 6 + Math.random() * 6;

  console.debug(`Flicky rendering ${src} at x:${anchorX}, y:${anchorY}`);

  return (
    <motion.div
      animate={{
        x: [0, maxX - anchorX, 0, minX - anchorX, 0],
        y: [0, minY - anchorY, 0, maxY - anchorY, 0],
      }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "easeInOut",
      }}
      style={{
        position: 'absolute',
        zIndex: 12,
        left: anchorX,
        top: anchorY,
      }}
    >
      <div
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${SPRITE_SIZE * SCALE * 2}px ${SPRITE_SIZE * SCALE}px`,
          animation: 'flicky-frames 0.5s steps(2) infinite',
          width: SPRITE_SIZE * SCALE,
          height: SPRITE_SIZE * SCALE,
          '@keyframes flicky-frames': {
            from: {
              backgroundPosition: '0 0',
            },
            to: {
              backgroundPosition: `-${SPRITE_SIZE * SCALE * 2}px 0`,
            },
          },
        }}
      />
    </motion.div>
  );
}

function FlickyContainer({ flickyCount }) {
  const anchorsRef = useRef(
    spriteSheets.map(() => ({
      x: Math.random() * ((CONTAINER_WIDTH * SCALE) - SPRITE_SIZE),
      y: Math.random() * ((CONTAINER_HEIGHT * SCALE) - SPRITE_SIZE),
    }))
  );

  if (flickyCount < 0) {
    return null;
  }

  const spritesToShow = spriteSheets.slice(0, flickyCount * 2);

  return (
    <Box sx={styles.flickyContainer} className="flickyContainer">
      {spritesToShow.map((src, i) => (
        <Flicky key={i} src={src} anchor={anchorsRef.current[i]} />
      ))}
    </Box>
  );
}

function Start({ char, selectedCardSets, setSelectedCardSets, setting, setChar, setSetting }) {
  useEffect(() => {
    setSelectedCardSets(JSON.parse(localStorage.getItem('selectedCardSets') ?? '[]'));
  }, [setSelectedCardSets]);

  const handleClick = (cardSetName) => {
    const newSets = [...selectedCardSets];

    toggleString(newSets, cardSetName);

    console.debug(`Toggling "${cardSetName}":`, newSets);

    localStorage.setItem('selectedCardSets', JSON.stringify(newSets));

    setSelectedCardSets(newSets);
  };

  return (
    <Box sx={styles.container}>
      <Stack direction="column" gap={4}>
        <Box sx={styles.choiceContainer}>
          <Box className="setting-choice" sx={styles.settingChoice}>
            {Object.keys(parallaxImages).map((settingChoice) => {
              const layerNumbers = Array.from({ length: parallaxImages[settingChoice] }, (_, i) => i + 1);
              const border = `5px solid ${settingChoice === setting ? blue[400] : 'black'}`;
              const style = {
                ...styles.parallaxContainer,
                width: 100,
                border,
                cursor: 'pointer',
              };

              return (
                <Box key={settingChoice} sx={style} onClick={() => setSetting(settingChoice)}>
                  {layerNumbers.map((layer) => <Layer key={layer} bgKey={settingChoice} layer={layer} />)}
                </Box>
              );
            })}
          </Box>
          <Box className="setting-choice" sx={styles.settingChoice}>
            {Object.keys(charFrames).map((characterChoice) => {
              const style = {
                backgroundImage: `url('/images/definitions/choice-${characterChoice}.webp')`,
                backgroundSize: 'cover',
                width: 100,
                aspectRatio: '10 / 7',
                border: `5px solid ${characterChoice === char ? blue[400] : 'black'}`,
                cursor: 'pointer',
              };

              return <Box key={characterChoice} sx={style} onClick={() => setChar(characterChoice)} />;
            })}
          </Box>
        </Box>
        <Box sx={styles.cardSetChoiceContainer}>
          {data.map((cardSet) => {
            const active = selectedCardSets.includes(cardSet.name);

            return (
              <Paper key={cardSet.name} className={active ? 'active' : ''} sx={styles.cardSetChoice} onClick={() => handleClick(cardSet.name)}>
                {cardSet.name}
              </Paper>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
}

function MaxScore({ show }) {
  if (!show) {
    return null;
  }

  return (
    <Box sx={styles.maxScore}>
      <img src="/images/definitions/amy.png" style={{ width: '100%', height: '100%' }} />
    </Box>
  )
}

export default function Definitions() {
  const [step, setStep] = useState(0);
  const [char, setChar] = useState('');
  const [action, setAction] = useState('idle');
  const [setting, setSetting] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState('stop');
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState([null, null, null, null, null, null, null, null, null, null]);
  const [selectedCardSets, setSelectedCardSets] = useState([]);
  const [showAmy, setShowAmy] = useState(false);

  const recordScore = (value) => {
    const newScore = [...score];

    newScore[step] = value;

    if (value === true) {
      if (action === 'idle') {
        setAction('walk');
        setAnimationSpeed('fast');
      } else if (action === 'walk') {
        setAction('run');
        setAnimationSpeed('fast');
      } else if (action === 'run') {
        setShowAmy(true);
        setAction('dash');
        setAnimationSpeed('fast');
      }
    } else if (value === false) {
      setShowAmy(false);

      if (action === 'dash') {
        setAction('run');
        setAnimationSpeed('fast');
      } else if (action === 'run') {
        setAction('walk');
        setAnimationSpeed('fast');
      } else if (action === 'walk') {
        setAction('idle');
        setAnimationSpeed('stop');
      }
    }

    setScore(newScore);
    setStep(step + 1);
    removeTopCard();
  };

  const handleReset = () => {
    setStep(0);
    setChar('');
    setAction('idle');
    setSetting('');
    setAnimationSpeed('stop');
    setCards([]);
    setScore([null, null, null, null, null, null, null, null, null, null]);
    setSelectedCardSets([]);
    setShowAmy(false);
  };

  useEffect(() => {
    const cardPile = [];

    data.filter((s) => selectedCardSets.includes(s.name)).forEach((cardSet) => {
      console.debug(`Adding ${cardSet.entries.length} entries from the ${cardSet.name} set.`);

      cardPile.push(...cardSet.entries);
    });

    setCards(getRandomElements(cardPile, 10));
  }, [selectedCardSets]);

  console.debug(`Step ${step} with ${cards.length} cards left.`);

  const removeTopCard = () => {
    if (cards.length > 0) {
      setCards((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const layerNumbers = Array.from({ length: parallaxImages[setting] }, (_, i) => i + 1);

  if (char === '' || setting === '') {
    return <Start char={char} setChar={setChar} setting={setting} setSetting={setSetting} selectedCardSets={selectedCardSets} setSelectedCardSets={setSelectedCardSets} />;
  }

  return (
    <Box sx={styles.containerWithScore}>
      <Stack direction="column" sx={styles.stackContainer}>
        <Box sx={styles.score}>
          {score.map((sc, index) => {
            let Icon = CircleOutlinedIcon;

            if (sc === true) {
              Icon = CheckCircleOutlinedIcon;
            } else if (sc === false) {
              Icon = CancelOutlinedIcon;
            }

            return (
              <Box key={`score_${index}`}>
                <Icon sx={{ fontSize: 50 }} />
              </Box>
            );
          })}
        </Box>
        <Paper elevation={10} sx={styles.parallaxContainer}>
          <FlickyContainer flickyCount={step} />
          {layerNumbers.map((layer) => <Layer key={layer} bgKey={setting} layer={layer} speed={animationSpeed} />)}
          {step === 10 ? <Finish char={char} onClick={handleReset} /> : <Character char={char} action={action} />}
        </Paper>
        <Box className="card-container" sx={styles.cardDeckContainer}>
          <AnimatePresence>
            {cards.map((card, index) => {
              return (
                <motion.div
                  key={`card_${card}`}
                  className="card"
                  style={styles.card}
                  initial={{ y: 0, scale: 1 }}
                  animate={{
                    y: -index * 2,
                    x: index * 2,
                  }}
                  exit={{ x: '100vw', opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <Typography sx={{ fontSize: 36 }}>{card}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, position: 'absolute', bottom: 4 }}>
                    <Button variant="outlined" onClick={() => recordScore(true)}>correct</Button>
                    <Button variant="outlined" onClick={() => recordScore(false)}>incorrect</Button>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </Stack>
      <MaxScore show={step !== 10 && showAmy} />
    </Box>
  );
}
