import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Snackbar, Alert } from "@mui/material";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import PostForm from "../../app/components/posts/PostForm";
import PostService from "../../src/service/PostService";

function EditPost() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const postService = new PostService();
        try {
          const fetchedPost = await postService.fetchPostById(id);
          setPost(fetchedPost);
        } catch (err) {
          setError("Failed to fetch post.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Edit Post"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          {loading ? (
            <CircularProgress />
          ) : (
            <PostForm post={post} />
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

export default EditPost;