<template>
  <div>
    <br />
    <h3>Create an account</h3>
    <br />

    <b-card bg-variant="light" class="m-5 p-2 form_style m-auto">
      <b-form-group
        label="Name:"
        label-for="nested-name"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-input v-model="name" required id="nested-name"></b-form-input>
        <p class="error" v-if="showErrorName">{{ errorName }}</p>
      </b-form-group>

      <b-form-group
        label="Email:"
        label-for="nested-email"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-input v-model="email" id="nested-email"></b-form-input>
        <p class="error" v-if="showErrorEmail">{{ errorEmail }}</p>
      </b-form-group>

      <b-form-group
        label="Password :"
        label-for="nested-password"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-input
          type="password"
          v-model="password"
          id="nested-password"
        ></b-form-input>
        <p class="error" v-if="showErrorPassword">{{ errorPassword }}</p>
      </b-form-group>

      <b-form-group
        label="Confirm Password :"
        label-for="nested-cpassword"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-input
          v-model="cpassword"
          id="nested-cpassword"
          type="password"
        ></b-form-input>
        <p class="error" v-if="showErrorCpassword">{{ errorCpassword }}</p>
      </b-form-group>

      <b-form-group
        label="Address :"
        label-for="nested-address"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-textarea
          v-model="address"
          id="nested-address"
        ></b-form-textarea>
        <p class="error" v-if="showErrorAddress">{{ errorAddress }}</p>
      </b-form-group>

      <b-form-group
        label="City :"
        label-for="nested-city"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-input v-model="city" id="nested-city"></b-form-input>
        <p class="error" v-if="showErrorCity">{{ errorCity }}</p>
      </b-form-group>

      <b-form-group
        label="Province :"
        label-for="nested-province"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-select v-model="province" class="mb-3">
          <b-form-select-option value="Ontario">Ontario</b-form-select-option>
          <b-form-select-option value="British Columbia"
            >British Columbia</b-form-select-option
          >
          <b-form-select-option value="Alberta">Alberta</b-form-select-option>
          <b-form-select-option value="Nova Scotia"
            >Nova Scotia</b-form-select-option
          >
        </b-form-select>
        <p class="error" v-if="showErrorProvince">{{ errorProvince }}</p>
      </b-form-group>

      <b-form-group
        label="Country :"
        label-for="nested-country"
        label-cols-sm="3"
        label-align-sm="right"
      >
        <b-form-input type="text" value="Canada" class="mb-3" readonly>
        </b-form-input>
      </b-form-group>
      <b-form-group
        label="Gender :"
        label-cols-sm="3"
        label-align-sm="right"
        class="mb-0"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio-group
          class="pt-2"
          :options="['Male', 'Female', 'Other']"
          :aria-describedby="ariaDescribedby"
          v-model="gender"
        ></b-form-radio-group>
      </b-form-group>
      <p class="error" v-if="showErrorGender">{{ errorGender }}</p>

      <br />
      <b-button type="submit" @click="onSubmit" variant="info">Submit</b-button>
      <b-button type="reset" @click="onReset" variant="outline-info"
        >Reset</b-button
      >
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      address: "",
      city: "",
      province: "",
      country: "Canada",
      gender: "",
      showErrorName: false,
      showErrorEmail: false,
      showErrorPassword: false,
      showErrorCpassword: false,
      showErrorAddress: false,
      showErrorCity: false,
      showErrorProvince: false,
      showErrorCountry: false,
      showErrorGender: false,
      errorName: "",
      errorPassword: "",
      errorCpassword: "",
      errorEmail: "",
      errorAddress: "",
      errorProvince: "",
      errorCity: "",
      errorGender: "",
    };
  },
  methods: {
    onSubmit() {
      console.log("submitted");
      this.showErrorName = false;
      this.showErrorEmail = false;
      this.showErrorPassword = false;
      this.showErrorCpassword = false;
      this.showErrorAddress = false;
      this.showErrorCity = false;
      this.showErrorProvince = false;
      this.showErrorGender = false;

      if (this.name.trim().length == 0) {
        this.showErrorName = true;
        this.errorName = "Please enter Name";
        return;
      }

      var emailregex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+[\.][a-zA-Z0-9]+$/;
      if (!emailregex.test(this.email)) {
        this.showErrorEmail = true;
        this.errorEmail = "Please enter correct email ID eg: abc@xyz.com";
        return;
      }

      if (this.password.trim().length == 0) {
        this.showErrorPassword = true;
        this.errorPassword = "Please enter password";
        return;
      }
      var passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (!passRegex.test(this.password)) {
        this.showErrorPassword = true;
        this.errorPassword =
          "Password Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters";
        return;
      }
      if (this.cpassword.trim().length == 0) {
        this.showErrorCpassword = true;
        this.errorCpassword = "Please enter password for confirmation";
        return;
      }
      if (this.cpassword.trim() != this.password.trim()) {
        this.showErrorCpassword = true;
        this.errorCpassword = "Password Mismatch";
        return;
      }
      if (this.address.trim().length == 0) {
        this.showErrorAddress = true;
        this.errorAddress = "Please enter address";
        return;
      }
      if (this.city.trim().length == 0) {
        this.showErrorCity = true;
        this.errorCity = "Please enter city";
        return;
      }
      if (this.province == "") {
        this.showErrorProvince = true;
        this.errorProvince = "Please choose a province";
        return;
      }
      if (this.gender == "") {
        this.showErrorGender = true;
        this.errorGender = "Please select a gender";
        return;
      }

      var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        shippingAddress: this.address,
        city: this.city,
        province: this.province,
        country: this.country,
        gender: this.gender,
      };

      this.$http.post("http://localhost:9000/users", user).then((response) => {
        if (response.data.success) {
          var login = {
            email: this.email,
            password: this.password,
          };
          this.$http
            .post("http://localhost:9000/userlogin", login)
            .then((response) => {
              if (response.data.success) {
                localStorage.setItem(
                  "user",
                  JSON.stringify(response.data)
                );
                localStorage.setItem("jwt", response.data.token);

                this.$store.dispatch("login", {
                  username: this.email,
                  password: this.password,
                });
                this.$router.push("/userProfile");
              } else {
                this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
                  // An error occurred
                });
              }
            });
        } else {
          this.$bvModal.msgBoxOk(response.data.message).catch((err) => {
            // An error occurred
          });
        }
      });
    },
    onReset() {
      (this.name = ""),
        (this.email = ""),
        (this.address = ""),
        (this.password = ""),
        (this.cpassword = ""),
        (this.city = ""),
        (this.province = ""),
        (this.country = ""),
        (this.gender = "");
    },
  },
};
</script>

<style lang="scss">
.form_style {
  width: 800px;
  justify-content: center;
}
</style>