import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import PostForm from "../../app/components/posts/PostForm";

function NewPost() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Create New Post"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <PostForm />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default NewPost;