'use client';

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  ListItemButton
} from "@mui/material";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import PostService from "../src/post/PostService";
import Link from "next/link";
import PublicPostDiv from "../app/components/posts/PublicPostDiv";

function Index() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Online Post System";
    const fetchPosts = async () => {
      const postService = new PostService();
      try {
        const fetchedPosts = await postService.fetchApprovedPosts();
        setPosts(fetchedPosts);
        if (fetchedPosts.length > 0) {
          setSelectedPost(fetchedPosts[0]);
        }
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setFetchingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleUpdate = (updatedPost) => {
    setSelectedPost(updatedPost);
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Online Post System"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex m-2">
          <div className="grow">
            <Grid container spacing={2}>
              <Grid item xs={8}>
                {fetchingPosts ? (
                  <CircularProgress />
                ) : (
                  selectedPost && (
                    <PublicPostDiv post={selectedPost} onUpdate={handleUpdate} />
                  )
                )}
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5" component="div" className="m-2">
                  Approved Posts
                </Typography>
                <List>
                  {posts.map((post) => (
                    <ListItem
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar>{getInitials(post.user.username)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={post.title} secondary={post.user.username} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" className="m-2">
              <Grid item>
                <Link href="/posts" passHref>
                  <Button variant="contained" color="primary">
                    Manage My Posts
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </div>
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Index;