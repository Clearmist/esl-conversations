'use client';

import { useCallback , useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppState } from '../providers.jsx';
import data from '../../data/action-verbs.json';

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(255 255 255)',
  },
  pagesArea: {
    minHeight: 100,
    py: 2,
    display: 'flex',
    gap: 4,
    justifyContent: 'center',
    backgroundColor: 'rgb(245 241 235)',
    boxShadow: 'rgb(11 20 26 / 13%) 0px 2px 5px 0px',
  },
  playArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    py: 2,
  },
  cell: {
    flexGrow: 1,
    aspectRatio: 1,
    maxWidth: '100vw',
    backgroundRepeat: 'no-repeat',
  },
  cellSmall: {
    width: 100,
    height: 100,
    flexGrow: 0,
  },
  cellBookend: {
    aspectRatio: 1,
    height: '80%',
    cursor: 'pointer',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundImage: `url('/images/action-verbs/static.start.webp')`,
  },
  cardContainer: {
    minHeight: 132,
    py: 2,
    display: 'flex',
    gap: 4,
    justifyContent: 'center',
    backgroundColor: 'rgb(245 241 235)',
    boxShadow: 'rgb(11 20 26 / 13%) 0px -2px 5px 0px',
    flexAlign: 'end',
  },
  card: {
    minWidth: 'max-content',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.15s ease-in-out',
    textWrap: 'nowrap',
    '&:hover': {
      transform: 'scale3d(1.25, 1.25, 1)',
    },
  },
  captionContainer: {
    display: 'flex',
    gap: 1.4,
  },
  caption: {
    borderBottom: '4px solid transparent',
    fontSize: 30,
    letterSpacing: 0.8,
  },
  captionBlank: {
    borderBottom: '4px solid rgb(147 188 255)',
    width: 220,
  },
  button: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgb(255 255 255 / 50%)',
    border: '1px solid black',
    '&: hover': {
      backgroundColor: 'rgb(255 255 255)',
    },
  },
  buttonLeft: {
    left: '1em'
  },
  buttonRight: {
    right: '1em'
  },
  carouselContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    overflow: 'hidden',
    height: '100vh',
  },
  carouselTrack: {
    display: 'flex',
    transition: 'transform 0.8s ease-in-out',
  },
  carouselImage: {
    flexShrink: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100vh',
    aspectRatio: 1,
  },
  carouselText: {
    position: 'absolute',
    bottom: 10,
    width: '90%',
    px: 2,
    py: 1,
    ml: 2,
  },
};

function getRandomObjects(arr, exclude) {
  // Filter out objects whose "name" key is in the exclude array.
  const filtered = arr.filter((obj) => !exclude.includes(obj.name));

  // Shuffle with Fisher–Yates.
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, 4);
}

function buildBackgroundImages(details) {
  const backgroundImages = [];
  const backgroundPositions = [];
  const backgroundSizes = [];

  if (details.player !== null) {
    backgroundImages.push(`url('/images/action-verbs/player.${details.player.name}.webp')`);

    if (details.player.position === 'static') {
      backgroundPositions.push('left center');
      backgroundSizes.push('50%');
    } else if (details.player.position === 'below' || details.relativeness?.name === 'below') {
      backgroundPositions.push('bottom center');
      backgroundSizes.push('50%');
    } else if (details.relativeness?.name === 'above') {
      backgroundPositions.push('top center');
      backgroundSizes.push('50%');
    } else if (details.relativeness?.name === 'beside') {
      backgroundPositions.push('40% center');
    }
  }

  if (details.object !== null) {
    backgroundImages.push(`url('/images/action-verbs/object.${details.object.name}.webp')`);

    if (details.player.position === 'static') {
      backgroundPositions.push('right center');
      backgroundSizes.push('50%');
    } else if (details.player.position === 'below' || details.relativeness?.name === 'below') {
      backgroundPositions.push('top center');
      backgroundSizes.push('50%');
    } else if (details.relativeness?.name === 'above') {
      backgroundPositions.push('bottom center');
      backgroundSizes.push('50%');
    } else if (details.relativeness?.name === 'beside') {
      backgroundPositions.push('60% center');
    }
  }

  const style = {
    backgroundImage: backgroundImages.length > 0 ? backgroundImages.join(', ') : 'none',
    backgroundPosition: backgroundPositions.length > 0 ? backgroundPositions.join(', ') : 'center',
    backgroundSize: backgroundSizes.length > 0 ? backgroundSizes.join(', ') : 'contain',
  }

  return style;
}

function ImageBox({ details, size }) {
  const style = buildBackgroundImages(details);

  return (
    <Paper className="image-box" elevation={6} sx={{ ...styles.cell, ...(size === 'small' ? styles.cellSmall : {}), ...style }} />
  );
}

function Caption({ details }) {
  const hasPlayer = details.player !== null;
  const hasRelativeness = details.relativeness !== null;
  const hasObject = details.object !== null;
  const blankStyle = { ...styles.caption, ...styles.captionBlank };

  if (!hasPlayer) {
    return (
      <Box sx={styles.captionContainer}>
        <Typography sx={styles.caption}>He</Typography>
        <Typography sx={blankStyle}></Typography>
      </Box>
    );
  }

  if (details.player.position === 'static' || details.player.position === 'below') {
    return (
      <Box sx={styles.captionContainer}>
        <Typography sx={styles.caption}>He</Typography>
        <Typography sx={styles.caption}>{details.player.language.eng}</Typography>
        <Typography sx={styles.caption}>a</Typography>
        {!hasObject && <Typography sx={blankStyle}></Typography>}
        {!hasObject && <Typography sx={styles.caption}>.</Typography>}
        {hasObject && <Typography sx={styles.caption}>{details.object.language.eng}.</Typography>}
      </Box>
    );
  }

  if (!hasRelativeness) {
    return (
      <Box sx={styles.captionContainer}>
        <Typography sx={styles.caption}>He</Typography>
        <Typography sx={styles.caption}>{details.player.language.eng}</Typography>
        <Typography sx={blankStyle}></Typography>
      </Box>
    );
  }

  if (!hasObject) {
    return (
      <Box sx={styles.captionContainer}>
        <Typography sx={styles.caption}>He</Typography>
        <Typography sx={styles.caption}>{details.player.language.eng}</Typography>
        <Typography sx={styles.caption}>{details.relativeness.language.eng}</Typography>
        <Typography sx={styles.caption}>a</Typography>
        <Typography sx={blankStyle}></Typography>
        <Typography sx={styles.caption}>.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.captionContainer}>
      <Typography sx={styles.caption}>He</Typography>
      <Typography sx={styles.caption}>{details.player.language.eng}</Typography>
      <Typography sx={styles.caption}>{details.relativeness.language.eng}</Typography>
      <Typography sx={styles.caption}>a</Typography>
      <Typography sx={styles.caption}>{details.object.language.eng}.</Typography>
    </Box>
  );
}

function MotionElement({ animate, children, ready, ref, reset }) {
  return (
    <motion.div
      ref={ref}
      initial={{ y: 0 }}
      animate={animate ? { y: "-150vh" } : {}}
      transition={{ duration: 1, ease: "easeInOut" }}
      onAnimationComplete={() => {
        // Check if element is above viewport
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();

          if (rect.bottom <= 0) {
            reset?.();
          } else {
            ready?.();
          }
        }
      }}
      style={styles.cell}
    >
      {children}
    </motion.div>
  );
}

function ImageCarousel({ cells }) {
  const { helperLanguage } = useAppState();
  const [activeIndex, setActiveIndex] = useState(0);

  const imageSet = [
    '/images/action-verbs/static.start.webp',
    ...cells,
    '/images/action-verbs/static.finish.webp',
  ];

  const prev = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? imageSet.length - 1 : prevIndex - 1
    );
  }, [imageSet.length]);

  const next = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === imageSet.length - 1 ? 0 : prevIndex + 1
    );
  }, [imageSet.length]);

  useEffect(() => {
    const listener = (event) => {
      const key = event?.key;

      if (key === 'ArrowLeft') {
        prev();
      } else if (key === 'ArrowRight') {
        next();
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [prev, next]);

  return (
    <Box sx={styles.carouselContainer}>
      <Box sx={{ ...styles.carouselTrack, transform: `translateX(-${activeIndex * 100}%)` }}>

        {imageSet.map((src, index) => {
          let style = {};

          if (typeof src === 'string') {
            style.backgroundImage = `url('${src}')`;
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = 'center';
            style.backgroundSize = 'contain';
          } else {
            style = { ...buildBackgroundImages(src), backgroundRepeat: 'no-repeat' };
          }

          return (
            // <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box key={index}sx={{ ...styles.carouselImage, ...style }}>
              {typeof src === 'string' ? (
                <Paper sx={styles.carouselText}>
                  <Typography variant="h5">{data.bookends[index === 0 ? 'start' : 'end'].eng}</Typography>
                  <Typography variant="body1">{data.bookends[index === 0 ? 'start' : 'end'][helperLanguage]}</Typography>
                </Paper>
              ) : (
                <Paper sx={styles.carouselText}>
                  <Caption details={src} />
                </Paper>
              )}
            </Box>
          );
        })}

      </Box>
      <IconButton onClick={prev} aria-label="left" size="large" sx={{ ...styles.button, ...styles.buttonLeft }}>
        <ChevronLeftIcon fontSize="inherit" />
      </IconButton>
      <IconButton onClick={next} aria-label="right" size="large" sx={{ ...styles.button, ...styles.buttonRight }}>
        <ChevronRightIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}

export default function ActivityPage() {
  const { helperLanguage } = useAppState();
  const [cells, setCells] = useState([]);
  const [currentCellIndex, setCurrentCellIndex] = useState(0);
  const [currentCell, setCurrentCell] = useState({
    player: null,
    relativeness: null,
    object: null,
  });
  const [currentKey, setCurrentKey] = useState('player');
  const [usedActions, setUsedActions] = useState([]);
  const [usedObjects, setUsedObjects] = useState([]);
  const [cardsActions, setCardsActions] = useState([]);
  const [cardsObjects, setCardsObjects] = useState([]);
  const [animate, setAnimate] = useState(false);
  const motionReference = useRef(null);

  useEffect(() => {
    setCardsObjects(getRandomObjects(data.object, usedObjects));
    setCardsActions(getRandomObjects(data.player, usedActions));
  }, [setCardsActions, setCardsObjects, usedObjects, usedActions]);

  const reset = () => {
      setCurrentCell({
        player: null,
        relativeness: null,
        object: null,
      });

      setCurrentCellIndex(currentCellIndex + 1);

      setAnimate(false);
  };

  const ready = () => {
    setCurrentKey('player');
  }

  const handleCardChosen = (name) => {
    const newCell = { ...currentCell };

    if (currentKey === 'player') {
      newCell.player = data.player.filter((p) => p.name === name)[0];

      setUsedActions([...usedActions, name]);
      setCurrentCell(newCell);
      setCurrentKey(newCell.player.position === 'dynamic' ? 'relativeness' : 'object');
    } else if (currentKey === 'relativeness') {
      newCell.relativeness = data.relativeness.filter((p) => p.name === name)[0];

      setCurrentCell(newCell);
      setCurrentKey('object');
    } else if (currentKey === 'object') {
      newCell.object = data.object.filter((p) => p.name === name)[0];

      setUsedObjects([...usedObjects, name]);
      setCurrentCell(newCell);

      const newCells = [...cells];

      newCells.push(newCell);

      setCells(newCells);

      // Hide the cards while the animation is playing.
      setCurrentKey('pause');

      setAnimate(true);
    }
  };

  const start = () => {
    setCurrentCellIndex(1);
  };

  let cards = [];

  if (currentKey === 'player') {
    // The user must select a player card.
    cards = cardsActions;
  } else if (currentKey === 'relativeness') {
    cards = data.relativeness;
  } else if (currentKey === 'object') {
    cards = cardsObjects;
  }

  if (currentCellIndex === 0) {
    return (
      <Box sx={styles.container} className="page-container" onClick={start}>
        <Box sx={styles.pagesArea}>
          {cells.map((c, index) => <ImageBox key={`cell_${index}`} size="small" details={c} />)}
        </Box>
        <Box sx={styles.playArea}>
          <Paper className="image-box image-box-start" elevation={6} sx={styles.cellBookend} />
          <Box sx={{ ...styles.captionContainer, flexDirection: 'column' }}>
            <Typography variant="h5">{data.bookends.start.eng}</Typography>
            <Typography variant="body1">{data.bookends.start[helperLanguage]}</Typography>
          </Box>
        </Box>
        <Box sx={styles.cardContainer}></Box>
      </Box>
    )
  }

  if (currentCellIndex === 5) {
    return <ImageCarousel cells={cells} />;
  }

  return (
    <Box sx={styles.container} className="page-container">
      <Box sx={styles.pagesArea}>
        {cells.map((c, index) => <ImageBox key={`cell_${index}`} size="small" details={c} />)}
      </Box>
      <Box sx={styles.playArea}>
        <MotionElement ref={motionReference} animate={animate} ready={ready} reset={reset}>
          <ImageBox details={currentCell} />
        </MotionElement>
        <Caption details={currentCell} />
      </Box>
      <Box sx={styles.cardContainer}>
        {cards.map((card) => {
          return (
            <Card variant="outlined" sx={styles.card} key={card.name} onClick={() => handleCardChosen(card.name)}>
              <CardContent>
                <Typography variant="h5">
                  {card.language.eng}
                </Typography>
                <Typography variant="body1">
                  {card.language[helperLanguage]}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
