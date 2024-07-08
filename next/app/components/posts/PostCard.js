import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Card, CardContent, Typography, Box, Button, IconButton, Tooltip, TextField, Snackbar, Alert } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { PostStatus } from '../../../src/post/Post';
import PostService from '../../../src/post/PostService';
import UserLogic from '../../../src/common/user/UserLogic';

function PostCard({ post, onDelete, showUsername }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPost, setCurrentPost] = useState(post);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userLogic = new UserLogic();
      const id = await userLogic.fetchId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

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

  const handleDelete = async () => {
    const postService = new PostService();
    try {
      await postService.deletePost(post.id);
      onDelete(post.id);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleLike = async () => {
    const postService = new PostService();
    try {
      await postService.likePost(post.id);
      setSuccess("Post liked successfully.");
      const updatedPost = await postService.fetchPostById(post.id);
      setCurrentPost(updatedPost);
    } catch (err) {
      setError("Failed to like post.");
      console.error(err);
    }
  };

  const handleCancelLike = async () => {
    const postService = new PostService();
    try {
      await postService.cancelLike(post.id);
      setSuccess("Like canceled successfully.");
      const updatedPost = await postService.fetchPostById(post.id);
      setCurrentPost(updatedPost);
    } catch (err) {
      setError("Failed to cancel like.");
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!comment) {
      setError("Comment cannot be empty.");
      return;
    }

    const postService = new PostService();
    try {
      await postService.commentOnPost(post.id, comment);
      setSuccess("Comment added successfully.");
      setComment("");
      const updatedPost = await postService.fetchPostById(post.id);
      setCurrentPost(updatedPost);
    } catch (err) {
      setError("Failed to add comment.");
      console.error(err);
    }
  };

  const handleReviseComment = async (commentId, newContent) => {
    const postService = new PostService();
    try {
      await postService.reviseComment(post.id, commentId, newContent);
      setSuccess("Comment revised successfully.");
      const updatedPost = await postService.fetchPostById(post.id);
      setCurrentPost(updatedPost);
    } catch (err) {
      setError("Failed to revise comment.");
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const postService = new PostService();
    try {
      await postService.deleteComment(post.id, commentId);
      setSuccess("Comment deleted successfully.");
      const updatedPost = await postService.fetchPostById(post.id);
      setCurrentPost(updatedPost);
    } catch (err) {
      setError("Failed to delete comment.");
      console.error(err);
    }
  };

  const handleCommentBlur = (commentId, newContent) => {
    setEditingCommentId(null);
    handleReviseComment(commentId, newContent);
  };

  return (
    <Card variant="outlined" className="m-2" sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {currentPost.title}
          </Typography>
          {getStatusIcon(currentPost.status)}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {currentPost.content}
        </Typography>
        {currentPost.url && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            <a href={currentPost.url} target="_blank" rel="noopener noreferrer">
              View Attachment
            </a>
          </Typography>
        )}
        {showUsername && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Posted by: {currentPost.user.username}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Likes: {currentPost.likes}
        </Typography>
        <Box mt={2}>
          <TextField
            label="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleComment}>
            Comment
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLike}
            startIcon={<ThumbUpIcon />}
            disabled={currentPost.likes > 0}
            sx={{ marginRight: 1 }}
          >
            Like
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancelLike}
            startIcon={<ThumbDownIcon />}
            disabled={currentPost.likes === 0}
            sx={{ marginRight: 1 }}
          >
            Cancel Like
          </Button>
          {!showUsername && (
            <>
              <Link href={`/posts/${currentPost.id}`} passHref>
                <Button variant="contained" color="primary" sx={{ marginRight: 1 }}>
                  Edit
                </Button>
              </Link>
              <Tooltip title="Delete Post">
                <IconButton color="secondary" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Comments:</Typography>
          {currentPost.comments.map((comment) => (
            <Box key={comment.id} mt={1}>
              {editingCommentId === comment.id ? (
                <TextField
                  defaultValue={comment.content}
                  onBlur={(e) => handleCommentBlur(comment.id, e.target.value)}
                  fullWidth
                  autoFocus
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {comment.user.username}: {comment.content}
                </Typography>
              )}
              {userId === comment.user.id && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditingCommentId(comment.id)}
                    sx={{ marginRight: 1 }}
                  >
                    Revise Comment
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete Comment
                  </Button>
                </>
              )}
            </Box>
          ))}
        </Box>
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

export default PostCard;