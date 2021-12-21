<template>
  <div>
    <h2 class="pt-5 pb-4">Welcome to E-Shop</h2>

    <!-- All lists of products -->
    <b-container class="bv-example-row">
      <b-row>
        <div
          class="col-md-4"
          v-for="product in products"
          v-bind:key="product._id"
        >
          <b-card class="mb-2">
            <img
              :src="product.image"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem"
              class="mb-2"
            />
            <p>{{ product.title }}</p>
            <p>{{ product.description }}</p>

            <b-button href="#" variant="info" @click="addToCart(product._id)"
              >Add to Cart</b-button
            >
            <b-button
              href="#"
              variant="info"
              @click="
                $router.push({
                  name: 'ProductDetail',
                  params: { id: product._id },
                })
              "
              >Details</b-button
            >
          </b-card>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { authHeader } from "../_helpers/auth-header.js";

export default {
  data() {
    return {
      products: [],
    };
  },
  mounted() {
    this.$http.get("http://localhost:9000/products").then((response) => {
      this.products = response.data;
    });
  },
  methods: {
    addToCart(id) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user == null) {
        this.$bvModal
          .msgBoxOk("Please login to add item into cart.")
          .catch((err) => {
            // An error occurred
          });
        return;
      }
      this.$http
        .post("http://localhost:9000/cartItems", { email: user.email, pId: id, qty: 1 }, {
          headers: authHeader(),
        })
        .then((response) => {
          if (response.data.success) {
            this.$store.dispatch("addToCartWithQty", { id: id, qty: 1 });
            this.$router.push("/shoppingCart");
          } else {
            this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
              // An error occurred
            });
          }
        });
    },
  },
};
</script>