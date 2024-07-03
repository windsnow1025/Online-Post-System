import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Grid,
  Button
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PostService from "../../src/service/PostService";
import { PostStatus } from "../../src/model/Post";

function AdminDiv() {
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const postService = new PostService();
      try {
        const fetchedPosts = await postService.fetchAllPosts();
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

  const handlePostStatusUpdate = async (id, status) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const postService = new PostService();

    try {
      await postService.updatePostStatus(id, status);
      setSuccess("Post status updated successfully.");
      // Fetch posts again to update the list
      const fetchedPosts = await postService.fetchPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to update post status.");
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
    <div>
      <Typography variant="h5" component="div" className="m-2">
        Admin - Manage Posts
      </Typography>
      {fetchingPosts ? (
        <CircularProgress />
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
              <Grid container spacing={2} className="mt-2">
                <Grid item>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handlePostStatusUpdate(post.id, PostStatus.APPROVED)}
                    disabled={loading || post.status === PostStatus.APPROVED}
                    startIcon={<CheckCircleIcon />}
                  >
                    Approve
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handlePostStatusUpdate(post.id, PostStatus.REJECTED)}
                    disabled={loading || post.status === PostStatus.REJECTED}
                    startIcon={<CancelIcon />}
                  >
                    Reject
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminDiv;