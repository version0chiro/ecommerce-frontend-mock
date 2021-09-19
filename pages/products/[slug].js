import { useRouter } from "next/dist/client/router";
import React from "react";
import data from "../../utils/data";
import Layout from "../../components/Layout";
import NextLink from "next/link";
import { Link } from "@material-ui/core";

export default function ProductScreen() {
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((p) => p.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <Layout title={product.name}>
      <div>
        <NextLink href="/" passHref>
        <Link>Go Back</Link>
          {/* <a>Back to Home</a> */}
        </NextLink>
      </div>
    </Layout>
  );
}
