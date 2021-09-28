import React, { useEffect, useContext, useReducer, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Store } from "../../../utils/Store";
import axios from "axios";
import NextLink from "next/link";
import { getError } from "../../../utils/error";
import Layout from "../../../components/Layout";
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import useStyles from "../../../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  switch (action.type) {
    case `FETCH_REQUEST`:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case `FETCH_SUCCESS`:
      return { ...state, loading: false, error: "" };
    case `FETCH_FAIL`:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case `UPDATE_REQUEST`:
      return {
        ...state,
        loadingUpdate: true,
        errorUpdate: "",
      };
    case `UPDATE_SUCCESS`:
      return { ...state, loadingUpdate: false, errorUpdate: "" };

    case `UPDATE_FAIL`:
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: action.payload,
      };
    case `UPLOAD_REQUEST`:
      return { ...state, loadingUpload: true, errorUpload: "" };
    case `UPLOAD_SUCCESS`:
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case `UPLOAD_FAIL`:
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };

    default:
      state;
  }
}

function UserEdit({ params }) {
  const userId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: false,
    loadingUpdate: false,
    error: "",
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const [isAdmin, setIsAdmin] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { userInfo } = state;

  const classes = useStyles();

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: `FETCH_REQUEST` });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: `FETCH_SUCCESS` });
          setValue("name", data.name);
        } catch (e) {
          dispatch({ type: `FETCH_FAIL`, payload: getError(e) });
        }
      };

      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }) => {
    closeSnackbar();

    try {
      dispatch({ type: `UPDATE_REQUEST` });
     await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      enqueueSnackbar("User updated successfully", { variant: "success" });
      dispatch({ type: `UPDATE_SUCCESS` });
    } catch (err) {
      dispatch({ type: `UPDATE_FAIL`, payload: getError(err) });
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
    <Layout title="Edit User">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem  button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products" />
                </ListItem>
              </NextLink>
              <NextLink  href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users" />
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
                  Edit User
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
                {error && <Typography variant="body1">{error}</Typography>}
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
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.name)}
                            helperText={errors.name ? "Name is required" : ""}
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label="Is Admin"
                        control={
                          <Checkbox
                            onClick={(e) => setIsAdmin(e.target.checked)}
                            checked={isAdmin}
                            name="isAdmin"
                          />
                        }
                      />
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
                      {loadingUpdate && <CircularProgress />}
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}
export default dynamic(() => Promise.resolve(UserEdit), {
  ssr: false,
});
