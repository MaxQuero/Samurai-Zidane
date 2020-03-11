<template>
  <div class="form-wrapper">
    <form class="form" @submit.prevent="login">
      <div class="form-el">
        <label>Username:</label>
        <input type="text" name="username" v-model="form.username"/>

      </div>
      <div class="form-el">
        <label>Password:</label>
        <input type="password" name="password" v-model="form.password" />
      </div>
      <div class="buttons">
        <input class="btn" type="submit" value="Submit" />
        <router-link class="other-action" :to="{name: 'register'}">Register</router-link>
      </div>
    </form>
  </div>
</template>

<script>
  import URLCall from "../shared/URLCall";
  export default {
    name: "Login",
    data: function(){
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      login: function () {
        URLCall.post("/login", this.form)
          .then((res) => {
            console.log(res);
            if(res.data.success === true) {

              this.$router.push({name: 'battlefield', params: { user: res.data.user }});
            } else {
                [this.form.username, this.form.password, this.form.passwordConfirm] = '';

            }
          })
          .catch((errors) => {
            console.log(errors);
          });
      },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
