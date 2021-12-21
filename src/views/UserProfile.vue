<template>
  <div>
    <br />
    <h3>User Profile</h3>
    <br />

    <b-form
      label-cols-lg="2"
      label-size="lg"
      label-class="font-weight-bold pt-0"
      class="mb-2 mx-auto"
    >
      <b-card class="mb-2">
        <b-container class="bv-example-row">
          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Name :</b-col>
            <b-col class="userValue">{{ user.name }}</b-col>
            <b-col></b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Email :</b-col>
            <b-col class="userValue">{{ user.email }}</b-col>
            <b-col></b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Password :</b-col>
            <b-col class="userValue" col lg="3">
              <p
                v-if="passwordEdit == false"
                style="font-size: 25px"
                class="m-0"
              >
                ******
              </p>
              <div v-if="passwordEdit == true">
                <b-form-input type="password" v-model="password"></b-form-input>
                <p class="error" v-if="showErrorPassword">
                  Password must contain at least one number and one uppercase
                  and lowercase letter, and at least 6 or more characters
                </p>
              </div>
            </b-col>
            <b-col sm="1">
              <div v-if="passwordEdit == false" @click="openPasswordEdit()">
                <b-button size="sm" variant="outline-info">Edit</b-button>
              </div>
              <div v-if="passwordEdit == true" @click="savePassword()">
                <b-button size="sm" variant="info">Save</b-button>
              </div>
            </b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Shipping Address :</b-col>
            <b-col class="userValue" col lg="3">
              <div v-if="addressEdit == false">{{ user.shippingAddress }}</div>
              <div v-if="addressEdit == true">
                <textarea v-model="address"></textarea>
                <p class="error" v-if="showErrorAddress">
                  Please enter address
                </p>
              </div>
            </b-col>
            <b-col sm="1">
              <div v-if="addressEdit == false" @click="openAddressEdit()">
                <b-button size="sm" variant="outline-info">Edit</b-button>
              </div>
              <div v-if="addressEdit == true" @click="saveAddress()">
                <b-button size="sm" variant="info">Save</b-button>
              </div>
            </b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">City :</b-col>
            <b-col class="userValue">{{ user.city }}</b-col>
            <b-col></b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Province :</b-col>
            <b-col class="userValue">{{ user.province }}</b-col>
            <b-col></b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Country :</b-col>
            <b-col class="userValue">{{ user.country }}</b-col>
            <b-col></b-col>
          </b-row>

          <b-row style="padding-top: 20px">
            <b-col col lg="6" class="userTitle">Gender :</b-col>
            <b-col class="userValue">{{ user.gender }}</b-col>
            <b-col></b-col>
          </b-row>
        </b-container>
      </b-card>
      <br />
    </b-form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      user: null,
      showAddress: false,
      showPassword: false,
      addressEdit: false,
      address: "",
      passwordEdit: false,
      password: "",
      showErrorPassword: false,
      showErrorAddress: false,
    };
  },
  mounted() {
    let userSession = JSON.parse(localStorage.getItem('user'));
    console.log(userSession);
    this.$http
      .get("http://localhost:9000/users/" + userSession.email)
      .then((response) => {
        this.user = response.data;
        console.log(this.user);
      });
  },
  methods: {
    openAddressEdit() {
      this.addressEdit = true;
      this.address = this.user.shippingAddress;
    },
    saveAddress() {
      this.showErrorAddress = false;
      if (this.address.trim().length == 0) {
        this.showErrorAddress = true;
        return;
      }

      let user = this.user;
      user.shippingAddress = this.address;

      this.$http.put("http://localhost:9000/users/"+ user._id, user).then((response) => {
        if (response.data.success) {
          this.addressEdit = false;
        } else {
          this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
            // An error occurred
          });
        }
      });

    },
    openPasswordEdit() {
      this.passwordEdit = true;
      this.password = this.user.password;
    },
    savePassword() {
      this.showErrorPassword = false;
      if (this.password.trim().length == 0) {
        this.showErrorPassword = true;
        return;
      }
      var passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (!passRegex.test(this.password)) {
        this.showErrorPassword = true;
        return;
      }
      let user = this.user;
      user.password = this.password;
      

      this.$http.put("http://localhost:9000/users/"+ user._id, user).then((response) => {
        if (response.data.success) {
          this.passwordEdit = false;
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
.form_style {
  width: 800px;
  align-self: center;
}
.userTitle {
  text-align: end;
}
.userValue {
  text-align: start;
}
.userButton {
  align-items: start;
}
</style>

