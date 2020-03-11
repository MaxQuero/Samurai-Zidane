<template>
  <div class="register">
    <form @submit.prevent="register">
      <div>
        <label>Username:</label>
        <input type="text" name="username" v-model="form.username" />
        <br/>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" v-model="form.password"/>
      </div>
      <div>
        <label>Confirm Password:</label>
        <input class="password-confirm" type="password" name="password-confirm" v-model="form.passwordConfirm" />
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
    <router-link :to="{name: 'login'}">Login</router-link>

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
