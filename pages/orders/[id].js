import {
  Grid,
  TableContainer,
  Typography,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Button,
  ListItem,
  Card,
  List,
  CircularProgress,
} from "@material-ui/core";
import Image from "next/image";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import useStyles from "../../utils/styles";
import CheckoutWizard from "../../components/CheckoutWizard";
import { useSnackbar } from "notistack";
import { getError, onError } from "../../utils/error";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

function reducer(state, action) {
  switch (action.type) {
    case `FETCH_REQUEST`:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case `FETCH_SUCCESS`:
      return { ...state, loading: false, order: action.payload, error: "" };
    case `FETCH_FAIL`:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      state;
  }
}

function Order({ params }) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const router = useRouter();
  const classes = useStyles();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: "",
    }
  );

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    isDelivered,
    deliveredAt,
    paidAt,
  } = order;
  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      loadPaypalScript();
    }
  }, [order, successPay]);

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        enqueueSnackbar("Payment Successful", { variant: "success" });
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        onError(getError(err), enqueueSnackbar, closeSnackbar);
      }
    });
  }

  function onError(err) {
    console.log(err);
    enqueueSnackbar(err, { variant: "error" });
  }
  const styles = useStyles();
  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={3} />
      <Typography component="h1" variant="h1">
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography component="h1" className={styles.error} variant="h1">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </ListItem>
                <ListItem>
                  Status :
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : "not delivered"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>

                <ListItem>
                  Status :{isPaid ? `Paid at ${paidAt}` : "not paid"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <NextLink
                                href={`/products/${item.slug}`}
                                passHref
                              >
                                <Link>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                  />
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <Typography>{item.name}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h2">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={6}>
                      <Typography>Items: </Typography>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <Typography align="right">${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={6}>
                      <Typography>Tax: </Typography>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={6}>
                      <Typography>Shipping: </Typography>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={6}>
                      <Typography>
                        <strong>Total:</strong>{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <Typography align="right">
                        <strong>${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
export default dynamic(() => Promise.resolve(Order), { ssr: false });
