import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PostService from "../../../../src/post/PostService";
import { PostStatus } from "../../../../src/post/Post";

function AdminPostCard({ post, onStatusUpdate }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePostStatusUpdate = async (status) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const postService = new PostService();

    try {
      await postService.updatePostReview(post.id, status, comment);
      setSuccess("Post status updated successfully.");
      onStatusUpdate();
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
        <Typography variant="body2" color="text.secondary">
          Posted by: {post.user.username}
        </Typography>
        <TextField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Grid container spacing={2} className="mt-2">
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={() => handlePostStatusUpdate(PostStatus.APPROVED)}
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
              onClick={() => handlePostStatusUpdate(PostStatus.REJECTED)}
              disabled={loading || post.status === PostStatus.REJECTED}
              startIcon={<CancelIcon />}
            >
              Reject
            </Button>
          </Grid>
        </Grid>
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

export default AdminPostCard;