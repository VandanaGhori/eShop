<template>
  <div>
    <b-container class="bv-example-row mt-4">
      <b-row>
        <b-column>
          <b-card
            :title="product.title"
            :img-src="product.image"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 40rem; margin=20px 30px;"
            class="mb-4 mx-auto"
          >
            <b-card-text>{{ product.description }}</b-card-text>
            <label text="Rate &amp; Review"></label>
            <div>
              <b-form-rating variant="warning" v-model="rating"></b-form-rating>
            </div>

            <b-form-textarea
              id="textarea1"
              v-model="commentText"
              placeholder="Enter your experience"
              :rows="3"
              :max-rows="6"
            ></b-form-textarea>

            <label for="img" class="mt-4">Select product photo:</label>
            <input type="file" id="img" name="img" accept="image/*" />

            <p class="error mt-4" v-if="showError">{{ error }}</p>

            <b-button type="submit" @click="onSubmitComment" variant="primary" class="mt-3"
              >Post Comment</b-button
            >
          </b-card>
        </b-column>
        <b-column class="mx-auto">
          <h5 style="text-align: start">Reviews:</h5>

          <div v-if="comments.length > 0">
            <b-list-group style="width: 400px">
              <b-list-group-item
                v-for="comment in comments"
                v-bind:key="comments.indexOf(comment)"
              >
                <p style="text-align: start" class="m-0">{{ comment.text }}</p>
                <p style="text-align: end; color: rgb(204, 170, 0)" class="m-0">
                  {{ comment.rating }} star
                </p>
                <p
                  style="
                    text-align: end;
                    color: rgb(128, 128, 128);
                    font-size: 13px;
                  "
                  class="m-0"
                >
                  By {{ comment.user }}
                </p>
              </b-list-group-item>
            </b-list-group>
          </div>
          <div v-else>No reviews are added.</div>
        </b-column>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rating: 0,
      commentText: "",
      error: "",
      showError: false,
      product: null
    };
  },
  mounted() {
    this.$http
      .get("http://localhost:9000/products/" + this.$route.params.id, null)
      .then((response) => {
        this.product = response.data;
      });
  },
  computed: {
    productId() {
      return this.$route.params.id;
    },
    comments() {
      const id = this.productId;
      return this.$store.getters.comments.filter(function (comment) {
        return comment.pId == id;
      });
    },
    loggedInUser() {
      return this.$store.getters.login;
    },
    hasPurchased() {
      let user = this.loggedInUser;
      let pId = this.productId;
      if (user != null) {
        let purchasedProduct = this.$store.getters.purchasedProducts.find(
          (p) => p.pId == pId && p.uEmail == user.username
        );
        return purchasedProduct != null;
      }
      return false;
    },
  },
  methods: {
    onSubmitComment() {
      this.showError = false;

      if (this.loggedInUser == null) {
        this.error = "Please register/login to rate the product.";
        this.showError = true;
        return;
      }

      if (!this.hasPurchased) {
        this.error = "Only purchaser of the product can write a review.";
        this.showError = true;
        return;
      }

      if (this.rating == 0) {
        this.error = "Please give rating to the product by selecting stars.";
        this.showError = true;
        return;
      }
      if (this.commentText.length == 0) {
        this.error = "Please comment text.";
        this.showError = true;
        return;
      }

      this.$store.dispatch("addComment", {
        pId: this.productId,
        text: this.commentText,
        rating: this.rating,
        user: this.loggedInUser.username,
      });
      this.rating = 0;
      this.commentText = "";
    },
  },
};
</script>