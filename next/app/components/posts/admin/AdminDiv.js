import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import PostService from "../../../../src/post/PostService";
import AdminPostCard from "./AdminPostCard";

function AdminDiv() {
  const [posts, setPosts] = useState([]);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState(null);

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

  const handleStatusUpdate = async () => {
    const postService = new PostService();
    try {
      const fetchedPosts = await postService.fetchAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch posts.");
      console.error(err);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="div" className="m-2">
        Manage Posts
      </Typography>
      {fetchingPosts ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <AdminPostCard key={post.id} post={post} onStatusUpdate={handleStatusUpdate} />
        ))
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminDiv;