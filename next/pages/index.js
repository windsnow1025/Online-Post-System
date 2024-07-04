'use client';

import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Button, Grid, Typography } from "@mui/material";
import Link from 'next/link';
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/HeaderAppBar";

function Index() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();

  useEffect(() => {
    document.title = "Online Post System";
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Online Post System"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Link href="/posts/approved" passHref>
                <Button variant="contained" color="primary">
                  View Approved Posts
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/posts/my-posts" passHref>
                <Button variant="contained" color="secondary">
                  View My Posts
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/posts/new" passHref>
                <Button variant="contained" color="success">
                  Create New Post
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Index;