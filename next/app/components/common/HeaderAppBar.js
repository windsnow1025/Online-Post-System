import { AppBar, IconButton, Typography, Menu, MenuItem, Tooltip, Badge, List, ListItem, ListItemText } from "@mui/material";
import AuthDiv from "./user/AuthDiv";
import ThemeToggle from "./ThemeToggle";
import React, { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link';
import PostService from '../../../src/post/PostService';

const HeaderAppBar = ({
                        title,
                        useAuthDiv = true,
                        systemTheme,
                        setSystemTheme,
                        refreshKey,
                        infoUrl
                      }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [inboxAnchorEl, setInboxAnchorEl] = useState(null);
  const [unreadPosts, setUnreadPosts] = useState([]);

  useEffect(() => {
    const fetchUnreadPosts = async () => {
      const postService = new PostService();
      try {
        const fetchedPosts = await postService.fetchPosts();
        const unread = fetchedPosts.filter(post => !post.isRead);
        setUnreadPosts(unread);
      } catch (err) {
        console.log("Failed to fetch unread posts:", err);
      }
    };

    fetchUnreadPosts();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleInboxOpen = (event) => {
    setInboxAnchorEl(event.currentTarget);
  };

  const handleInboxClose = () => {
    setInboxAnchorEl(null);
  };

  const handleMarkAsRead = async (postId) => {
    const postService = new PostService();
    try {
      await postService.updateRead(postId);
      setUnreadPosts(unreadPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error("Failed to mark post as read:", err);
    }
  };

  return (
    <AppBar position="static" color="primary">
      <div className="flex-around p-2">
        <Tooltip title="Menu">
          <IconButton aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon
              fontSize="large"
              className="text-white"
            />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} href="/" onClick={handleMenuClose}>Home</MenuItem>
          <MenuItem component={Link} href="/posts" onClick={handleMenuClose}>Posts</MenuItem>
          <MenuItem component={Link} href="/admin" onClick={handleMenuClose}>Admin</MenuItem>
        </Menu>
        <Typography variant="h4">
          {title}
        </Typography>
        {infoUrl && (
          <Tooltip title="More Information">
            <IconButton
              component="a"
              href={infoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="information"
            >
              <InfoIcon fontSize="large" className="text-white" />
            </IconButton>
          </Tooltip>
        )}
        <div className="grow"></div>
        <Tooltip title="Inbox">
          <IconButton aria-label="inbox" onClick={handleInboxOpen}>
            <Badge badgeContent={unreadPosts.length} color="error">
              <MailIcon fontSize="large" className="text-white" />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={inboxAnchorEl}
          open={Boolean(inboxAnchorEl)}
          onClose={handleInboxClose}
        >
          {unreadPosts.length === 0 ? (
            <MenuItem disabled>No new messages</MenuItem>
          ) : (
            <List>
              {unreadPosts.map((post) => (
                <ListItem
                  button
                  key={post.id}
                  onClick={() => {
                    handleMarkAsRead(post.id);
                    handleInboxClose();
                  }}
                >
                  <ListItemText primary={post.title} secondary={post.comment} />
                </ListItem>
              ))}
            </List>
          )}
        </Menu>
        {useAuthDiv &&
          <div className="m-1 mx-2">
            <AuthDiv refreshKey={refreshKey} />
          </div>
        }
        <div className="m-1 mx-2">
          <ThemeToggle
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
        </div>
      </div>
    </AppBar>
  );
};

export default HeaderAppBar;