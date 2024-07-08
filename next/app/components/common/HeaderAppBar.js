import { AppBar, IconButton, Typography, Menu, MenuItem, Tooltip, Badge } from "@mui/material";
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
          <IconButton component={Link} href="/inbox" aria-label="inbox">
            <Badge badgeContent={unreadPosts.length} color="error">
              <MailIcon fontSize="large" className="text-white" />
            </Badge>
          </IconButton>
        </Tooltip>
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