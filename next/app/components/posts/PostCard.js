import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { PostStatus } from '@/src/model/Post';

function PostCard({ post }) {
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
      </CardContent>
    </Card>
  );
}

export default PostCard;