import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Snackbar, Alert, Typography, Card, CardContent, Button } from "@mui/material";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import PostService from "../src/post/PostService";

function Inbox() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnreadPosts = async () => {
      const postService = new PostService();
      try {
        const fetchedPosts = await postService.fetchPosts();
        const unread = fetchedPosts.filter(post => !post.isRead);
        setPosts(unread);
      } catch (err) {
        setError("Failed to fetch unread posts.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadPosts();
  }, []);

  const handleMarkAsRead = async (postId) => {
    const postService = new PostService();
    try {
      await postService.updateRead(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError("Failed to mark post as read.");
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Inbox"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <Typography variant="h5" component="div" className="m-2">
            Unread Messages
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            posts.map((post) => (
              <Card key={post.id} variant="outlined" className="m-2">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comment: {post.comment}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMarkAsRead(post.id)}
                    className="mt-2"
                  >
                    Mark as Read
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
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

export default Inbox;