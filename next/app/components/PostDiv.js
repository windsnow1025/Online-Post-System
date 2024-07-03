import React, { useEffect, useState } from "react";
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Box, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FileService from "../../src/service/FileService";
import PostService from "../../src/service/PostService";

function PostDiv() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
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
      setLoading(false);
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

  return (
    <div>
      <Card variant="outlined" className="m-2">
        <CardContent>
          <Typography variant="h5" component="div">
            Create a New Post
          </Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Box mt={2}>
            <Button variant="contained" component="label">
              Select File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2" color="text.secondary" ml={2}>{file.name}</Typography>}
          </Box>
          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" color="secondary" onClick={handlePostSubmit} disabled={loading}>
              Submit Post
            </Button>
          </Box>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
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
                <IconButton color="secondary" onClick={() => handlePostDelete(post.id)} disabled={loading}>
                  <DeleteIcon />
                </IconButton>
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
    </div>
  );
}

export default PostDiv;