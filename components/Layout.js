import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import useStyles from "../utils/styles";

import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
export default function Layout({ title, children, description }) {
  const classes = useStyles();
  return (
    <div>
      <Head>
        {" "}
        <title>{title ? `${title} - Mock App` : "Mock App"}</title>
        {description && <meta name="description" content={description} />}
      </Head>
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
    </div>
  );
}
