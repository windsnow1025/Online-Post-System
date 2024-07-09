import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, IconButton, Tooltip, TextField, Avatar, Snackbar, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import PostService from '../../../src/post/PostService';
import UserLogic from '../../../src/common/user/UserLogic';

function PublicPostDiv({ post, onUpdate }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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

  const handleLike = async () => {
    const postService = new PostService();
    try {
      await postService.likePost(post.id);
      setSuccess("Post liked successfully.");
      const updatedPost = await postService.fetchApprovedPostById(post.id);
      console.log(updatedPost);
      onUpdate(updatedPost);
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
      const updatedPost = await postService.fetchApprovedPostById(post.id);
      onUpdate(updatedPost);
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
      const updatedPost = await postService.fetchApprovedPostById(post.id);
      onUpdate(updatedPost);
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
      const updatedPost = await postService.fetchApprovedPostById(post.id);
      onUpdate(updatedPost);
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
      const updatedPost = await postService.fetchApprovedPostById(post.id);
      onUpdate(updatedPost);
    } catch (err) {
      setError("Failed to delete comment.");
      console.error(err);
    }
  };

  const handleCommentBlur = (commentId, newContent) => {
    setEditingCommentId(null);
    handleReviseComment(commentId, newContent);
  };

  const renderMedia = (url) => {
    const fileExtension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={url} alt="attachment" style={{ maxWidth: '100%', marginTop: '10px' }} />;
    } else if (['mp4', 'mkv', 'webm', 'ogg'].includes(fileExtension)) {
      return <video controls src={url} style={{ maxWidth: '100%', marginTop: '10px' }} />;
    } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
      return <audio controls src={url} style={{ width: '100%', marginTop: '10px' }} />;
    } else {
      return (
        <Typography variant="body2" color="primary" className="m-2">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Attachment
          </a>
        </Typography>
      );
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="div" className="m-2">
        {post.title}
      </Typography>
      <Box display="flex" alignItems="center" className="m-2">
        <Avatar alt={post.user.username} src="/static/images/avatar/1.jpg" />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {post.user.username}
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" className="m-2">
        {post.content}
      </Typography>
      {post.url && renderMedia(post.url)}
      <Box mt={2} display="flex" alignItems="center">
        <Tooltip title="Like">
          <span>
            <IconButton
              color="primary"
              onClick={handleLike}
              disabled={post.likes > 0}
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
              disabled={post.likes === 0}
            >
              <ThumbDownIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {post.likes} Likes
        </Typography>
      </Box>
      <Divider className="m-2" />
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
        {post.comments.map((comment) => (
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
    </Box>
  );
}

export default PublicPostDiv;