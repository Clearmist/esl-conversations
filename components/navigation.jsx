'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import conversations from '../data/conversations.json';

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 2,
    clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
    backgroundColor: 'rgb(255 255 255 / 90%)',
    width: 80,
    height: 80,
  },
  link: {
    cursor: 'pointer',
    color: 'rgb(0 0 0 / 87%)',
    '&:hover': {
      backgroundColor: 'rgb(0 0 0 / 6%)',
    },
  },
};

export default function Navigation() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showConversationsSection, setShowConversationsSection] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleConversationsSection = () => {
    setShowConversationsSection(!showConversationsSection);
  };

  return (
    <Box sx={styles.container}>
      <IconButton aria-label="delete" size="large" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box>
            <List>
              <ListSubheader>Activities</ListSubheader>
              <ListItem sx={styles.link} onClick={() => router.push(`/action-verbs`)}>Action verbs</ListItem>
              <ListItem sx={styles.link} onClick={() => router.push(`/definitions`)}>Definitions</ListItem>
              <ListItem sx={styles.link} onClick={() => router.push(`/chooser`)}>Conversation chooser</ListItem>
              <ListItem sx={styles.link} onClick={() => router.push(`/madlib`)}>Madlib Game</ListItem>
            </List>
          </Box>
          <Divider />
          <List>
            <ListItem onClick={toggleConversationsSection} sx={{ cursor: 'pointer' }}>
              <Typography sx={{ flexGrow: 1 }}>Practice conversations</Typography>
              {showConversationsSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
          </List>
          {conversations.map((section, index) => {
            return (
              <Box key={section.title} sx={{ display: showConversationsSection ? 'inline' : 'none' }}>
                <List>
                  <ListSubheader>{section.title}</ListSubheader>
                  {section.entries.map((entry) => {
                    return (
                      <ListItem key={entry.stub} sx={styles.link} onClick={() => router.push(`/${entry.stub}`)}>
                        {entry.title}
                      </ListItem>
                    );
                  })}
                </List>
                {index + 1 < conversations.length ? <Divider /> : null}
              </Box>
            );
          })}
        </Box>
      </Drawer>
    </Box>
  );
}
