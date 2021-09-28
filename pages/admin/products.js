import React, { useEffect, useContext, useReducer } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Store } from "../../utils/Store";
import axios from "axios";
import NextLink from "next/link";
import { getError } from "../../utils/error";
import Layout from "../../components/Layout";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import useStyles from "../../utils/styles";
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
      return { ...state, loading: false, products: action.payload, error: "" };
    case `FETCH_FAIL`:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "CREATE_REQUEST":
      return {
        ...state,
        loadingCreate: true,
      };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return {
        ...state,
        loadingCreate: false,
      };

    default:
      state;
  }
}
function AdminDashboard() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const classes = useStyles();
  const [{ loading, error, products, loadingCreate }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      products: [],
      error: "",
    }
  );

  useEffect(() => {
    if (!userInfo) {
      console.log("something");
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const createHandler = async () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        `/api/admin/products`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      enqueueSnackbar("Product created", { variant: "success" });
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
      return;
    }
  };
  return (
    <Layout title="Product History">
      <Grid container spacing={1}>
        <Grid item md={2} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders" />
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
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
                <Grid container alignItems="center">
                  <Grid item md={6} xs={6}>
                    <Typography variant="h1" component="h1">
                      Products
                    </Typography>
                  </Grid>
                  <Grid align="right" item md={6} xs={6}>
                    <Button
                      onClick={createHandler}
                      color="primary"
                      variant="contained"
                    >
                      Create
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography
                    component="h1"
                    className={classes.error}
                    variant="h1"
                  >
                    {error}
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell> PRICE</TableCell>
                          <TableCell> CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>{product._id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Details
                                </Button>
                              </NextLink>
                              {"  "}
                              <Button size="small" variant="contained">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), {
  ssr: false,
});
