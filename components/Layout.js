import React from "react";
import Head from "next/head";

import useStyles from "../utils/styles";

import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div>
      <Head>
        {" "}
        <title>Mock App</title>
      </Head>
      <AppBar postion="static" className={classes.navebar}>
        <Toolbar>
          <Typography>Mock Website</Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.main}>{children}</Container>

      <footer className={classes.footer}>
        <Typography>All rights reserved. Mock Website</Typography>
      </footer>
    </div>
  );
}
