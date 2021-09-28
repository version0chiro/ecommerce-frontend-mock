import React, { useEffect, useContext, useReducer } from "react";
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
  CircularProgress,
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
import Cookies from "js-cookie";

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

function ProductEdit({ params }) {
  const productId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
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
          const { data } = await axios.get(`/api/admin/product/${productId}`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          dispatch({ type: `FETCH_SUCCESS` });
          setValue("name", data.name);
          setValue("slug", data.slug);
          setValue("price", data.price);
          setValue("description", data.description);
          setValue("image", data.image);
          setValue("category", data.category);
          setValue("brand", data.brand);
          setValue("countInStock", data.countInStock);
        } catch (e) {
          dispatch({ type: `FETCH_FAIL`, payload: getError(e) });
        }
      };

      fetchData();
    }
  }, []);

  const submitHandler = async ({
    name,
    slug,
    price,
    description,
    image,
    category,
    brand,
    countInStock,
  }) => {
    // e.preventDefault();
    closeSnackbar();

    try {
      dispatch({ type: `UPDATE_REQUEST` });
      const { data } = await axios.put(
        `/api/admin/product/${productId}`,
        {
          name,
          slug,
          price,
          description,
          image,
          category,
          brand,
          countInStock,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      enqueueSnackbar("Product updated successfully", { variant: "success" });
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

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      dispatch({ type: `UPLOAD_REQUEST` });
      const { data } = await axios.post(
        `/api/admin/upload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: `UPLOAD_SUCCESS` });
      setValue("image", data.secure_url);
      enqueueSnackbar("Image uploaded successfully", { variant: "success" });
    } catch {
      dispatch({ type: `UPLOAD_FAIL` });
      enqueueSnackbar("Image upload failed", { variant: "error" });
    }
  };
  return (
    <Layout title="Edit Product">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
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
            </List>
          </Card>
        </Grid>

        <Grid item md={10} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h1" component="h1">
                  Edit Product
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
                      <Controller
                        name="slug"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="slug"
                            label="Slug"
                            error={Boolean(errors.slug)}
                            helperText={errors.slug ? "Slug is required" : ""}
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="price"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Price"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.price)}
                            helperText={errors.slug ? "Price is required" : ""}
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="image"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="image"
                            label="Image"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.image)}
                            helperText={errors.image ? "Image is required" : ""}
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        color="primary"
                        component="label"
                      >
                        Upload Image
                        <input
                          type="file"
                          style={{ display: "none" }}
                          onChange={uploadHandler}
                        />
                        {loadingUpload && <CircularProgress />}
                      </Button>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="category"
                            label="Category"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.category)}
                            helperText={
                              errors.category ? "Category is required" : ""
                            }
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="brand"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="brand"
                            label="Brand"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.brand)}
                            helperText={errors.brand ? "Brand is required" : ""}
                            // onChange={(e) => setEmail(e.target.value)}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name="countInStock"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="countInStock"
                            label="Count In Stock"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.countInStock)}
                            helperText={
                              errors.countInStock
                                ? "Count In Stock is required"
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
                        name="description"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            id="description"
                            label="Description"
                            inputProps={{ type: "name" }}
                            error={Boolean(errors.description)}
                            helperText={
                              errors.description
                                ? "Description is required"
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
export default dynamic(() => Promise.resolve(ProductEdit), {
  ssr: false,
});
