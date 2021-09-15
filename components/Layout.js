import React from "react";
import Head from "next/head";

import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
export default function Layout({ children }) {
  return (
    <div>
      <Head>
        {" "}
        <title>Mock App</title>
      </Head>
      <AppBar postion="static">
        <Toolbar>
          <Typography>Mock Website</Typography>
        </Toolbar>
      </AppBar>

      <Container>{children}</Container>

      <footer>
          <Typography>
              All rights reserved. Mock Website
          </Typography>
      </footer>
    </div>
  );
}
