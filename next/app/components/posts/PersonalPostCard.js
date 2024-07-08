import React from "react";
import Link from 'next/link';
import { Card, CardContent, Typography, Box, IconButton, Tooltip, Divider } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { PostStatus } from '../../../src/post/Post';
import PostService from '../../../src/post/PostService';

function PersonalPostCard({ post, onDelete }) {
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
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Attachment
          </a>
        </Typography>
      );
    }
  };

  return (
    <Card variant="outlined" className="m-2" sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {post.title}
          </Typography>
          {getStatusIcon(post.status)}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {post.content}
        </Typography>
        {post.url && renderMedia(post.url)}
        <Box mt={2} display="flex" alignItems="center">
          <Link href={`/posts/${post.id}`} passHref>
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
        </Box>
        <Divider sx={{ my: 2 }} />
      </CardContent>
    </Card>
  );
}

export default PersonalPostCard;