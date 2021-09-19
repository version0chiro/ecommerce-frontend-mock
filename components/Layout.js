import React, { useContext } from "react";
import Head from "next/head";
import NextLink from "next/link";
import useStyles from "../utils/styles";

import {
  AppBar,
  Container,
  createMuiTheme,
  Link,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
} from "@material-ui/core";

import { Store } from "../utils/Store";

export default function Layout({ title, children, description }) {

  // eslint-disable-next-line no-unused-vars
  const {state, dispatch} = useContext(Store);
  const {darkMode} = state;
  // const  darkMode  = state;

  const theme = createMuiTheme({
    typography: {
      h1: {
        fontSize: "3rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      body1: {
        fontWeight: "normal",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();
  return (
    <div>
      <Head>
        {" "}
        <title>{title ? `${title} - Mock App` : "Mock App"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navebar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Cloth-Azon</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <NextLink href="/cart" passHref>
                <Link>Cart</Link>
              </NextLink>
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>

        <Container className={classes.main}>{children}</Container>

        <footer className={classes.footer}>
          <Typography>All rights reserved. Mock Website</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
