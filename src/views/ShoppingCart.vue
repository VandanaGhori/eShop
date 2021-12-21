<template>
  <div>
    <h2 class="pt-5 pb-4">Shopping Cart</h2>

    <div v-if="inCart.length > 0">
      <b-card
        no-body
        class="overflow-hidden p-2 ml-5 mr-5 mt-2"
        v-for="item in inCart"
        v-bind:key="item.id"
      >
        <b-row no-gutters>
          <b-col md="1" align-self="center">
            <b-card-img
              :src="product(item.id).image"
              alt="Image"
              class="rounded-0"
            ></b-card-img>
          </b-col>
          <b-col md="6" align-self="center" class="p-3">
            <h5>{{ product(item.id).title }}</h5>
            {{ product(item.id).description }}
          </b-col>
          <b-col md="2" align-self="center">
            <b-row>
              <b-col class="p-0">
                <b-button
                  variant="outline-dark"
                  @click="onChangeQty(item.id, item.qty - 1)"
                  >-</b-button
                >
              </b-col>
              <b-col class="p-0">
                <b-input type="number" min="1" v-model="item.qty" disabled />
              </b-col>
              <b-col class="p-0">
                <b-button
                  variant="outline-dark"
                  @click="onChangeQty(item.id, item.qty + 1)"
                  >+</b-button
                >
              </b-col>
            </b-row>
          </b-col>
          <b-col md="2" align-self="center">
            <h5>${{ productPrice(item.id, item.qty) }}</h5>
          </b-col>
          <b-col md="1" align-self="center">
            <b-button variant="danger" @click="remove(item.id)"
              >Remove</b-button
            >
          </b-col>
        </b-row>
      </b-card>

      <b-row no-body class="overflow-hidden p-2 ml-5 mr-5 mt-2">
        <b-col md="7" class="p-3"> </b-col>
        <b-col md="2" class="p-3" style="text-align: end">
          <h5>Total</h5>
        </b-col>
        <b-col md="2" align-self="center">
          <h5>${{ totalPrice }}</h5>
        </b-col>
        <b-col md="1" class="p-3"> </b-col>
      </b-row>

      <b-row class="ml-5 mr-5 mt-4 mb-5">
        <b-col style="text-align: end">
          <b-button variant="outline-info" size="lg" @click="$router.push('/')"
            >Continue Shopping</b-button
          >
        </b-col>
        <b-col style="text-align: start">
          <b-button variant="info" size="lg" @click="showCheckoutModal"
            >Proceed to checkout</b-button
          >
        </b-col>
      </b-row>
    </div>
    <div v-else class="m-5">
      <p>Not any product is added to the cart.</p>

      <b-button
        variant="info"
        size="lg"
        class="mt-4 mb-5"
        @click="$router.push('/')"
        >Continue Shopping</b-button
      >
    </div>
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
    let inCart = this.inCart;
    var i;
    for (i = 0; i < inCart.length; i++) {
      this.$http
        .get("http://localhost:9000/products/" + inCart[i].id, null)
        .then((response) => {
          if (response != null && !response.hasOwnProperty("error")) {
            this.products.push(response.data);
          }
        });
    }
  },
  computed: {
    inCart() {
      return this.$store.getters.inCart;
    },
    totalPrice() {
      const sum = this.inCart
        .map((item) => this.productPrice(item.id, item.qty))
        .reduce((prev, curr) => prev + curr, 0);
      return sum;
    },
  },
  methods: {
    product(id) {
      var i;
      for (i = 0; i < this.products.length; i++) {
        if (this.products[i]._id == id) {
          return this.products[i];
        }
      }
      return null;
    },
    productPrice(id, qty) {
      let product = this.product(id);
      return product.price * qty;
    },
    onChangeQty(pId, qty) {
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
          } else {
            this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
              // An error occurred
            });
          }
        });
    },
    remove(pId) {
      let user = JSON.parse(localStorage.getItem("user"));
      this.$http
        .delete(
          "http://localhost:9000/cartItems?pId=" + pId + "&email=" + user.email,
          {
            headers: authHeader(),
          }
        )
        .then((response) => {
          if (response.data.success) {
            this.$store.dispatch("removeFromCart", pId);
          } else {
            this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
              // An error occurred
            });
          }
        });
    },
    showCheckoutModal() {
      this.$bvModal
        .msgBoxConfirm("You need to pay $" + this.totalPrice, {
          okTitle: "Pay",
        })
        .then((value) => {
          if (value === true) {
            this.onPurchaseComplete();
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    onPurchaseComplete() {
      let user = JSON.parse(localStorage.getItem("user"));

      let inCart = this.inCart;
      var i;
      for (i = 0; i < inCart.length; i++) {
        this.$store.dispatch("addPurchasedProduct", {
          pId: inCart[i].id,
          uEmail: user.email,
        });
      }

      this.$http
        .delete("http://localhost:9000/cartItemsUser/" + user.email, {
          headers: authHeader(),
        })
        .then((response) => {
          if (response.data.success) {
            this.$store.dispatch("clearCart");
            this.showCompleteCheckoutModal();
          } else {
            this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
              // An error occurred
            });
          }
        });
    },
    showCompleteCheckoutModal() {
      this.$bvModal.msgBoxOk("Thanks for shopping!").catch((err) => {
        // An error occurred
      });
    },
  },
};
</script>
