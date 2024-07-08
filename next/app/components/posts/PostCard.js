import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, TextField, Snackbar, Alert, Avatar, Divider } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
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
      await postService.deleteLike(post.id);
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
      await postService.commentPost(post.id, comment);
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
      await postService.updateComment(post.id, commentId, newContent);
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
          <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
            <Avatar alt={currentPost.user.username} src="/static/images/avatar/1.jpg" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {currentPost.user.username}
            </Typography>
          </Box>
        )}
        <Box mt={2} display="flex" alignItems="center">
          <Tooltip title="Like">
            <span>
              <IconButton
                color="primary"
                onClick={handleLike}
                disabled={currentPost.likes > 0}
              >
                <ThumbUpIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cancel Like">
            <span>
              <IconButton
                color="secondary"
                onClick={handleCancelLike}
                disabled={currentPost.likes === 0}
              >
                <ThumbDownIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {currentPost.likes} Likes
          </Typography>
          {!showUsername && (
            <>
              <Link href={`/posts/${currentPost.id}`} passHref>
                <Tooltip title="Edit Post">
                  <IconButton color="primary" sx={{ ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Delete Post">
                <IconButton color="secondary" onClick={handleDelete} sx={{ ml: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" alignItems="center">
          <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
          <TextField
            label="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ flexGrow: 1, ml: 2 }}
          />
          <Tooltip title="Send Comment">
            <IconButton color="primary" onClick={handleComment}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box mt={2}>
          <Typography variant="h6">Comments:</Typography>
          {currentPost.comments.map((comment) => (
            <Box key={comment.id} mt={1} display="flex" alignItems="center">
              <Avatar alt={comment.user.username} src="/static/images/avatar/3.jpg" />
              {editingCommentId === comment.id ? (
                <TextField
                  defaultValue={comment.content}
                  onBlur={(e) => handleCommentBlur(comment.id, e.target.value)}
                  fullWidth
                  autoFocus
                  sx={{ flexGrow: 1, ml: 2 }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, ml: 2 }}>
                  {comment.user.username}: {comment.content}
                </Typography>
              )}
              {userId === comment.user.id && (
                <>
                  <Tooltip title="Revise Comment">
                    <IconButton
                      color="primary"
                      onClick={() => setEditingCommentId(comment.id)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Comment">
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteComment(comment.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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