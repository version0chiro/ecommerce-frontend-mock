import {
  Typography,
  ListItem,
  List,
  Button,
  TextField,
  Link,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

import { Store } from "../utils/Store";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, []);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      console.log(typeof data, JSON.stringify(data));
      Cookies.set("userInfo", JSON.stringify(data));
      router.push(redirect || "/");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <Layout title="Login">
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: "email" }}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: "password" }}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              {" "}
              Login{" "}
            </Button>
          </ListItem>

          <ListItem>
            Don&apos;t have an account? &nbsp;
            <NextLink href="/register" passHref>
              <Link> Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
