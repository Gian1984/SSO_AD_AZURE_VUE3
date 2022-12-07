<!--
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-50">
    <body class="h-full">
    ```
  -->
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/AGInsurance_logo.svg" alt="Your Company" />
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        {{ ' ' }}
        <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Register</a>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Sign in</button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500">Or continue with </span>
            </div>
          </div>

          <div class="mt-6 gap-3">
            <div>
              <a v-if="!account" @click="SignIn" target="_blank" class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-1 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50">
                <span class="sr-only">Sign in with Facebook</span>
                <img src="@/assets/logo-AG-Insurance-300x160.png" alt="AG Insurance logo" class="h-10" aria-hidden="true" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { PublicClientApplication } from '@azure/msal-browser';

export default {
  data() {
    return {
      account: undefined,
      signin: 'https://microsoft.com',
    };
  },
  async created() {
    this.$msalInstance = new PublicClientApplication(
        this.$store.state.msalConfig,
    );
  },
  mounted() {

    const accounts = this.$msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    this.account = accounts[0];
    this.$emitter.emit('login', this.account);
  },
  methods: {
    async SignIn() {
      await this.$msalInstance
          .loginPopup({})
          .then(() => {
            const myAccounts = this.$msalInstance.getAllAccounts();
            this.account = myAccounts[0];
            this.$emitter.emit('login', this.account);
            let home = import.meta.env.BASE_URL
            window.location.href = home
          })
          .catch(error => {
            console.error(`error during authentication: ${error}`);
          });
    },
  },
};




</script>
