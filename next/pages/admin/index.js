'use client';

import React, {useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import AdminDiv from "../../app/components/posts/AdminDiv";

function Admin() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();

  useEffect(() => {
    document.title = "Admin";
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <div className="local-scroll-root">
        <HeaderAppBar
          title="Admin"
          systemTheme={systemTheme}
          setSystemTheme={setSystemTheme}
        />
        <div className="local-scroll-scrollable flex-around m-2">
          <AdminDiv/>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Admin;
