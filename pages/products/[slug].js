import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import NextLink from "next/link";
import Image from "next/image";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";

import Rating from "@material-ui/lab/Rating";
import useStyles from "../../utils/styles";
import db from "../../utils/db";
import Product from "../../models/Product";
import axios from "axios";
import { Store } from "../../utils/Store";
import { useRouter } from "next/dist/client/router";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";

export default function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { product } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setLoading(false);
      enqueueSnackbar("Review submitted successfully", {
        variant: "success",
      });
      fetchReviews();
      setRating(0);
      setComment("");

    } catch (e) {
      setLoading(false);
      enqueueSnackbar(getError(e), {
        variant: "error",
      });
    }

  };
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  if (!product) {
    return <div>Product Not Found</div>;
  }
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= 0) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Go Back</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly />
              <Link href="#reviews">
                <Typography> ({product.numReviews}) review</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography>
                Description:
                {product.description}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      ${product.countInStock > 0 ? "In Stock" : "Unavailable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Customer Reviews
          </Typography>
        </ListItem>
        <ListItem>
          {reviews.length === 0 && <ListItem>No review</ListItem>}
          {reviews.map((review) => (
            <ListItem key={review._id}>
              <Grid container>
                <Grid item className={classes.reviewItem}>
                  <Typography>
                    <strong>{review.name}</strong>
                  </Typography>
                  <Typography>{review.createdAt.substring(0, 10)}</Typography>
                </Grid>
                <Grid item>
                  <Rating value={review.rating} readOnly></Rating>
                  <Typography>{review.comment}</Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </ListItem>
        <ListItem>
          {userInfo ? (
            <div className={classes.reviewForm}>
              <form onSubmit={submitHandler} className={classes.reviewForm}>
                <List>
                  <ListItem>
                    <Typography>
                      <strong>{userInfo.name}</strong> Write a review
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <TextField
                      multiline
                      variant="outlined"
                      fullWidth
                      name="review"
                      label="Comment"
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <Rating
                      name="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    />
                  </ListItem>
                  <ListItem>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      label="Comment"
                      classNme={classes.submit}
                    >
                      Submit
                    </Button>
                    {loading && <CircularProgress />}
                  </ListItem>
                </List>
              </form>
            </div>
          ) : (
            <Typography>
              Please{" "}
              <Link href={`/login?redirect=/products/${product.slug}`}>
                <a>Login</a>
              </Link>{" "}
              to leave a review
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug },'-reviews').lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
