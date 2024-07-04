import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Button, Grid, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import Link from 'next/link';
import useThemeHandler from "../../app/hooks/useThemeHandler";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import PostList from "../../app/components/posts/PostList";
import PostService from "../../src/service/PostService";

function PostManagement() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const postService = new PostService();
      try {
        const fetchedPosts = await postService.fetchPosts();
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
          title="Post Management"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <Typography variant="h5" component="div" className="m-2">
            My Posts
          </Typography>
          {fetchingPosts ? (
            <CircularProgress />
          ) : (
            <PostList posts={posts} />
          )}
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
          <Grid container spacing={2} justifyContent="center" className="m-2">
            <Grid item>
              <Link href="/posts/new" passHref>
                <Button variant="contained" color="primary">
                  Create New Post
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default PostManagement;