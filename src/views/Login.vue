<template>
  <div>
    <b-modal ref="loginModalRef" title="Login" hide-footer>
      <b-form>
        <label for="input-email">Username:</label>
        <b-form-input
          type="email"
          id="input-email"
          placeholder="Enter email"
          v-model="username"
          required
        ></b-form-input>
        <p class="error" v-if="showErrorUsername">{{ errorUsername }}</p>
        <br />

        <label for="input-password">Password:</label>
        <b-form-input
          type="password"
          id="input-password"
          placeholder="Enter password"
          v-model="password"
          required
          aria-describedby="password-help-block"
        ></b-form-input>
        <p class="error" v-if="showErrorPassword">{{ errorPassword }}</p>
        <br />

        <p class="error" v-if="showErrorLogin">
          Incorrect username or passowrd
        </p>

        <b-button type="button" @click="onSubmit" variant="primary"
          >Login</b-button
        >
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { authHeader } from "../_helpers/auth-header.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      fullName: "",
      showErrorUsername: false,
      showErrorPassword: false,
      errorUsername: "",
      errorPassword: "",
      showErrorLogin: false,
    };
  },
  props: {
    openModal: {
      default: false,
    },
  },
  watch: {
    openModal(newVal) {
      this.$refs.loginModalRef.show();
      this.username = "";
      this.password = "";
      this.showErrorUsername = false;
      this.showErrorPassword = false;
      this.showErrorLogin = false;
    },
  },
  methods: {
    onSubmit() {
      console.log("submitted");
      this.showErrorUsername = false;
      this.showErrorPassword = false;
      this.showErrorLogin = false;
      if (this.username.trim().length == 0) {
        this.showErrorUsername = true;
        this.errorUsername = "Please enter username";
        return;
      }

      var emailregex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+[\.][a-zA-Z0-9]+$/;
      if (!emailregex.test(this.username)) {
        this.showErrorUsername = true;
        this.errorUsername = "Please enter correct email ID";
        return;
      }

      if (this.password.trim().length == 0) {
        this.showErrorPassword = true;
        this.errorPassword = "Please enter password";
        return;
      }

      var login = {
        email: this.username,
        password: this.password,
      };
      this.$http
        .post("http://localhost:9000/userlogin", login)
        .then((response) => {
          if (response.data.success) {
            console.log(response.data)
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("jwt", response.data.token);

            this.$store.dispatch("login", {
              username: this.username,
              password: this.password,
            });

            this.$http
              .get("http://localhost:9000/cartItems/" + this.username, {
                headers: authHeader(),
              })
              .then((response) => {
                if (!response.hasOwnProperty("error")) {
                  var i;
                  for (i = 0; i < response.data.length; i++) {
                    var cart = response.data[i];
                    this.$store.dispatch("addToCartWithQty", {
                      id: cart.pId,
                      qty: cart.qty,
                    });
                  }
                }
                this.$refs.loginModalRef.hide();
                this.$router.push("/userProfile");
              });
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

<style lang="scss">
.error {
  font-size: 13px;
  color: red;
}
</style>