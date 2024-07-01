'use client';

import React, {useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline, Link} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import useThemeHandler from "../app/hooks/useThemeHandler";
import HeaderAppBar from "../app/components/common/HeaderAppBar";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Windsnow1025";
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Windsnow1025"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Index;
