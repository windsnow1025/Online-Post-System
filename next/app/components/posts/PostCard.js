import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function PostCard({ post }) {
  return (
    <Card variant="outlined" className="m-2">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {post.title}
          </Typography>
          <CheckCircleIcon color="success" />
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