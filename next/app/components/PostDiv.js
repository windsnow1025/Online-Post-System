import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  LinearProgress
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import FileService from "../../src/service/FileService";
import PostService from "../../src/service/PostService";
import { PostStatus } from "../../src/model/Post";

function PostDiv() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);

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

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const fileService = new FileService();

    try {
      const url = await fileService.upload(selectedFile);
      setFileUrl(url);
      setSuccess("File uploaded successfully.");
    } catch (err) {
      setError("Failed to upload file.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const postService = new PostService();

    try {
      await postService.createPost(title, content, fileUrl);
      setSuccess("Post created successfully.");
      setTitle("");
      setContent("");
      setFile(null);
      setFileUrl("");
      // Fetch posts again to include the new post
      const fetchedPosts = await postService.fetchPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to create post.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    <div>
      <Card variant="outlined" className="m-2">
        <CardContent>
          <Typography variant="h5" component="div">
            Create a New Post
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                Select File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {file && <Typography variant="body2" color="text.secondary" ml={2}>{file.name}</Typography>}
              {uploading && <LinearProgress />}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePostSubmit}
                disabled={loading}
                startIcon={<AddCircleOutlineIcon />}
              >
                Submit Post
              </Button>
            </Grid>
          </Grid>
          {loading && <CircularProgress />}
        </CardContent>
      </Card>

      <Typography variant="h5" component="div" className="m-2">
        Posts
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
                  <IconButton color="secondary" onClick={() => handlePostDelete(post.id)} disabled={loading}>
                    <DeleteIcon />
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

export default PostDiv;