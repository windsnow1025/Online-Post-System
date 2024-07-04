import React from "react";
import { Grid } from "@mui/material";
import PostCard from "./PostCard";

function PostList({ posts }) {
  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid item key={post.id} xs={12} sm={6} md={4}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default PostList;