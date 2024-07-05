import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  LinearProgress
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/router';
import FileService from "../../../src/service/FileService";
import PostService from "../../../src/service/PostService";

function PostForm({ post }) {
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(post ? post.url : "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

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
      if (post) {
        await postService.updatePost(post.id, title, content, fileUrl);
        setSuccess("Post updated successfully.");
      } else {
        await postService.createPost(title, content, fileUrl);
        setSuccess("Post created successfully.");
        setTitle("");
        setContent("");
        setFile(null);
        setFileUrl("");
      }
      router.push('/posts');
    } catch (err) {
      setError("Failed to submit post.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" className="m-2">
      <CardContent>
        <Typography variant="h5" component="div">
          {post ? "Edit Post" : "Create a New Post"}
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
          <Grid item xs={12} container spacing={2}>
            <Grid item>
              <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                Select File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePostSubmit}
                disabled={loading}
                startIcon={<AddCircleOutlineIcon />}
              >
                {post ? "Update Post" : "Submit Post"}
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {file && <Typography variant="body2" color="text.secondary" ml={2}>{file.name}</Typography>}
            {uploading && <LinearProgress />}
          </Grid>
        </Grid>
        {loading && <CircularProgress />}
      </CardContent>
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
    </Card>
  );
}

export default PostForm;