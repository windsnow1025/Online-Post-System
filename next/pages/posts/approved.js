import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert, CssBaseline,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PostService from "../../src/service/PostService";
import {ThemeProvider} from "@mui/material/styles";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../app/hooks/useThemeHandler";

function ApprovedPosts() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();

  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
              Approved Posts
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
                      <CheckCircleIcon color="success"/>
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
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ApprovedPosts;