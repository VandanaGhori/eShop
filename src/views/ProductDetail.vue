<template>
  <div>
    <br /><br /><br />
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <img
            :src="product.image"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem"
            class="mb-2"
          />
        </b-col>

        <b-col>
          <h2 style="padding: 0px 0px 50px 0px">{{ product.title }}</h2>

          <b-link
            @click="
              $router.push({ name: 'Comments', params: { id: product._id } })
            "
            class="font-weight-bold text-lg-left h5"
            >Reviews</b-link
          >

          <br /><br />
          <p>{{ product.features }}</p>
        </b-col>

        <b-col>
          <h2>$ {{ product.price }}</h2>
          No Cost EMI

          <br /><br />

          <b-row>
            <b-col class="p-0">
              <b-button
                :disabled="qty <= 1"
                variant="outline-dark"
                @click="onChangeCartQty(product._id, qty - 1)"
                >-</b-button
              >
            </b-col>

            <b-col class="p-0">
              <b-input
                type="number"
                min="1"
                placeholder="Quantity"
                v-model="qty"
                disabled
              />
            </b-col>

            <b-col class="p-0">
              <b-button
                variant="outline-dark"
                @click="onChangeCartQty(product._id, qty + 1)"
                >+</b-button
              >
            </b-col>
          </b-row>

          <br />

          <!-- Showing User Friendly Message -->
          <div v-if="isInCart(product._id)">
            <h6>The product is in cart</h6>
          </div>
          <div v-else>
            <h6>The product is not in cart</h6>
          </div>

          <b-button
            v-if="!isInCart(product._id)"
            href="#"
            variant="info"
            @click="addToCartWithQty(product._id, qty)"
            >Add to Cart</b-button
          >
          <b-button
            v-else
            href="#"
            variant="info"
            @click="updateToCart(product._id, qty)"
            >Update to Cart</b-button
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { authHeader } from "../_helpers/auth-header.js";

export default {
  data() {
    return {
      qty: 1,
      product: null,
    };
  },
  mounted() {
    this.$http
      .get("http://localhost:9000/products/" + this.$route.params.id, null)
      .then((response) => {
        console.log(response);
        this.product = response.data;
      });
  },
  created: function () {
    let cartItem = this.$store.getters.cartItem(this.product._id);
    if (cartItem != null) {
      this.qty = cartItem.qty;
    } else {
      this.qty = 1;
    }
  },
  methods: {
    isInCart(id) {
      var p = this.$store.getters.cartItem(id);
      return p != null;
    },
    onChangeCartQty(id, qty) {
      this.qty = qty;
    },
    addToCartWithQty(pId, qty) {
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
        .post(
          "http://localhost:9000/cartItems",
          { email: user.email, pId: pId, qty: 1 },
          {
            headers: authHeader(),
          }
        )
        .then((response) => {
          if (response.data.success) {
            this.$store.dispatch("addToCartWithQty", { id: pId, qty: qty });
            this.$router.push("/shoppingCart");
          } else {
            this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
              // An error occurred
            });
          }
        });
    },
    updateToCart(pId, qty) {
      let user = JSON.parse(localStorage.getItem("user"));
      this.$http
        .put(
          "http://localhost:9000/cartItems",
          { email: user.email, pId: pId, qty: qty },
          {
            headers: authHeader(),
          }
        )
        .then((response) => {
          if (response.data.success) {
            this.$store.dispatch("changeQtyCart", { id: pId, qty: qty });
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