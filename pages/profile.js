import React, { useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import axios from "axios";
import NextLink from "next/link";
import { getError } from "../utils/error";
import Layout from "../components/Layout";
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

function Profile() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { userInfo } = state;

  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      setValue("name", userInfo.name);
      setValue("email", userInfo.email);
    }
  }, []);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    // e.preventDefault();
    closeSnackbar();
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: "error",
      });
      // alert("Passwords do not match");
      return;
    }
    try {
     const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);

      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        getError(err),

        {
          variant: "error",
        }
      );
      // alert(err.message);
    }
  };
  return (
    <Layout title="Profile">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/profile" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Profile" />
                </ListItem>
              </NextLink>
              <NextLink href="/order-history" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Order History" />
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h1" component="h1">
                  Profile
                </Typography>
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          minLength: 3,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.name)}
                            helperText={
                              errors.name
                                ? errors.name.type === "minLength"
                                  ? "Name is not valid"
                                  : "Name is required"
                                : ""
                            }
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                          pattern:
                            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            inputProps={{ type: "email" }}
                            error={Boolean(errors.email)}
                            helperText={
                              errors.email
                                ? errors.email.type === "pattern"
                                  ? "Email is not valid"
                                  : "Email is required"
                                : ""
                            }
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => {
                            value === "" ||
                              value.length > 5 ||
                              "Password length is more than 5";
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.password)}
                            helperText={
                              errors.password ? "Password is not valid" : ""
                            }
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                          validate: (value) => {
                            value === "" ||
                              value.length > 5 ||
                              "Password length is more than 5";
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            inputProps={{ type: "password" }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={
                              errors.confirmPassword
                                ? "Confirm Password is not valid"
                                : ""
                            }
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        {" "}
                        Update{" "}
                      </Button>
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Profile), {
  ssr: false,
});
