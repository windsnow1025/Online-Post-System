import React from "react";
import { Grid } from "@mui/material";
import PersonalPostCard from "./PersonalPostCard";

function PersonalPostList({ posts, onDelete }) {
  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid item key={post.id} xs={12} sm={6} md={4}>
          <PersonalPostCard post={post} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}

export default PersonalPostList;