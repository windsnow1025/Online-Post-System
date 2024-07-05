'use client';

import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {CssBaseline, CircularProgress, Snackbar, Alert, Typography, Grid} from "@mui/material";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import PostList from "../app/components/posts/PostList";
import PostService from "../src/service/PostService";
import Link from "next/link";
import Button from "@mui/material/Button";

function Index() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Online Post System";
    const fetchPosts = async () => {
      const postService = new PostService();
      try {
        const fetchedPosts = await postService.fetchApprovedPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      } finally {
        setFetchingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Online Post System"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <Typography variant="h5" component="div" className="m-2">
            Approved Posts
          </Typography>
          {fetchingPosts ? (
            <CircularProgress />
          ) : (
            <PostList posts={posts} showUsername={true} />
          )}
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
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
      </div>
    </ThemeProvider>
  );
}

export default Index;