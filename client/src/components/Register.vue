<template>
  <div class="form-wrapper">
    <form class="form" @submit.prevent="register">
      <div class="form-el">
        <label>Username:</label>
        <input type="text" name="username" v-model="form.username" />
      </div>
      <div class="form-el">
        <label>Password:</label>
        <input type="password" name="password" v-model="form.password"/>
      </div>
      <div class="form-el">
        <label>Confirm Password:</label>
        <input class="password-confirm" type="password" name="password-confirm" v-model="form.passwordConfirm" />
      </div>
      <div class="buttons">
        <input class="btn" type="submit" value="Submit" />
        <router-link class="other-action" :to="{name: 'login'}">Login</router-link>

      </div>
    </form>

  </div>

</template>

<script>
  import URLCall from "../shared/URLCall";
  export default {

  name: "Register",
  data: function(){
    return {
      form: {
        username: '',
        password: '',
        passwordConfirm: ''
      }
    }
  },
  methods : {
    register: function () {
      URLCall.post("/register", this.form)
        .then(() => {
          console.log(this.form);
          if (this.form.password === this.form.passwordConfirm) {
            this.$router.push('/');
            console.log("registered")
          } else {
            alert('les mots de passes ne correspondent pas');
          }
        })
        .catch((errors) => {
          console.log(errors);
          console.log("Cannot register")
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
