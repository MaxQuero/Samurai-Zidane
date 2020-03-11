<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',

}
</script>

<style>
  body{
    margin: 0px;
  }
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
  .form-wrapper, .form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .form {
    justify-content: space-between;
    width: 300px;
  }

  .login {
    margin-left: 20px;
  }

  .form-el {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
  }

  .buttons {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  .btn {
    color: white;
    font-size: 1rem;
    font-family: "Arial", sans-serif;
    border: none;
    padding: 8px;
    background: #3f8eff;
  }

  .other-action{
    text-decoration: none;
    color: black;
    padding: 8px;

    font-size: 1rem;

  }
</style>
