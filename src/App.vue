<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">E-Shop</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="$router.push('/')">Home</b-nav-item>
          <b-nav-item @click="$router.push('/shoppingCart')"
            >Shopping Cart</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <li
            v-if="isLoggedIn"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
            "
          >
            {{ username }}
          </li>
          <b-nav-item v-else href="#" @click="show = !show" class="m-2"
            >Login</b-nav-item
          >
          <b-nav-item @click="onClickUser">
            <b-avatar variant="dark"></b-avatar>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view> </router-view>

    <login :openModal="show" />
  </div>
</template>

<script>
import login from "./views/Login.vue";

export default {
  components: {
    login,
  },
  name: "app",
  data() {
    return {
      show: false,
    };
  },
  computed: {
    username() {
      return this.$store.getters.login.username;
    },
    isLoggedIn() {
      let username = this.username;
      return username != null && username.length > 0;
    },
  },
  methods: {
    onClickUser: function () {
      if (this.isLoggedIn) {
        this.$router.push("/userProfile");
      } else {
        this.$router.push("/register");
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
  margin: 20px;
}
</style>