import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Snackbar,
  Alert, CssBaseline,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PostService from "../../src/service/PostService";
import { PostStatus } from "../../src/model/Post";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import {ThemeProvider} from "@mui/material/styles";
import useThemeHandler from "../../app/hooks/useThemeHandler";

function MyPosts() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();

  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handlePostDelete = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const postService = new PostService();

    try {
      await postService.deletePost(id);
      setSuccess("Post deleted successfully.");
      // Fetch posts again to update the list
      const fetchedPosts = await postService.fetchPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to delete post.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PostStatus.APPROVED:
        return <CheckCircleIcon color="success" />;
      case PostStatus.REJECTED:
        return <CancelIcon color="error" />;
      case PostStatus.PENDING:
      default:
        return <HourglassEmptyIcon color="warning" />;
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Online Post System"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <div>
            <Typography variant="h5" component="div" className="m-2">
              My Posts
            </Typography>
            {fetchingPosts ? (
              <CircularProgress/>
            ) : (
              posts.map((post) => (
                <Card key={post.id} variant="outlined" className="m-2">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" component="div">
                        {post.title}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        {getStatusIcon(post.status)}
                        <IconButton color="secondary" onClick={() => handlePostDelete(post.id)} disabled={loading}>
                          <DeleteIcon/>
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {post.content}
                    </Typography>
                    {post.url && (
                      <Typography variant="body2" color="primary">
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                          View Attachment
                        </a>
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))
            )}

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
              <Alert onClose={() => setError(null)} severity="error" sx={{width: '100%'}}>
                {error}
              </Alert>
            </Snackbar>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
              <Alert onClose={() => setSuccess(null)} severity="success" sx={{width: '100%'}}>
                {success}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MyPosts;