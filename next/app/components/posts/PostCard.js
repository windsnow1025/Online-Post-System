import React from "react";
import Link from 'next/link';
import { Card, CardContent, Typography, Box, Button, IconButton } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DeleteIcon from '@mui/icons-material/Delete';
import { PostStatus } from '../../../src/post/Post';
import PostService from '../../../src/post/PostService';

function PostCard({ post, onDelete, showUsername }) {
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

  return (
    <Card variant="outlined" className="m-2">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {post.title}
          </Typography>
          {getStatusIcon(post.status)}
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
        {showUsername && (
          <Typography variant="body2" color="text.secondary">
            Posted by: {post.user.username}
          </Typography>
        )}
        {!showUsername && (
          <Box mt={2} display="flex" justifyContent="space-between">
            <Link href={`/posts/${post.id}`} passHref>
              <Button variant="contained" color="primary">
                Edit
              </Button>
            </Link>
            <IconButton color="secondary" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;