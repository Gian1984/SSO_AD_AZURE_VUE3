<template>

  <main>
    <div class="bg-gray-900 pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14">
      <div class="mx-auto max-w-7xl lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8">
          <div class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
            <div class="lg:py-24">
              <h1 class="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                <span class="block">100 Years</span>
                <span class="block text-indigo-400">At your side</span>
              </h1>
              <p class="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui Lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.</p>
            </div>
          </div>
          <div class="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0">
            <div class="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
              <!-- Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ -->
              <img class="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none" src="https://tailwindui.com/img/component-images/cloud-illustration-indigo-400.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white">
      <div class="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
        <div class="mx-auto max-w-2xl px-4 lg:max-w-none">
          <div class="grid grid-cols-1 items-center gap-y-10 gap-x-16 lg:grid-cols-2">
            <div>
              <h2 class="text-4xl font-bold tracking-tight text-gray-900">We built our business on great customer service</h2>
              <p class="mt-4 text-gray-500">At the beginning at least, but then we realized we could make a lot more money if we kinda stopped caring about that. Our new strategy is to write a bunch of things that look really good in the headlines, then clarify in the small print but hope people don't actually read it.</p>
            </div>
            <div class="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg bg-gray-100">
              <img src="https://tailwindui.com/img/ecommerce-images/incentives-07-hero.jpg" alt="" class="object-cover object-center" />
            </div>
          </div>
          <div class="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3">
            <div v-for="incentive in incentives" :key="incentive.name" class="sm:flex lg:block">
              <div class="sm:flex-shrink-0">
                <img class="h-16 w-16" :src="incentive.imageSrc" alt="" />
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                <h3 class="text-sm font-medium text-gray-900">{{ incentive.name }}</h3>
                <p class="mt-2 text-sm text-gray-500">{{ incentive.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>

</template>

<script setup>
const incentives = [
  {
    name: 'Free shipping',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-shipping-simple.svg',
    description: "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
  },
  {
    name: '10-year warranty',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-warranty-simple.svg',
    description: "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
  },
  {
    name: 'Exchanges',
    imageSrc: 'https://tailwindui.com/img/ecommerce/icons/icon-exchange-simple.svg',
    description:
        "If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
  },
]
</script>

<script>
import customTokenCredential from '../CustomTokenProvider';
import { BlobServiceClient } from '@azure/storage-blob';
import { PublicClientApplication } from '@azure/msal-browser';
import { mapMutations } from 'vuex';
const storageAccountName = 'cmatskasbackup';
export default {
  name: 'HelloWorld',
  data() {
    return {
      account: undefined,
      containers: [],
    };
  },
  async created() {
    this.$emitter.on(
        'login',
        async function (account) {
          this.account = account;
          console.log(this.account);
          console.log('Getting storage data');
          await this.getAzureStorageData();
        }.bind(this),
    )
    this.$emitter.on('logout', () => {
      console.log('logging out');
      this.account = undefined;
    });
  },
  methods: {
    ...mapMutations(['setAccessToken']),
    async getAzureStorageData() {
      if(this.$store.state.accessToken == ''){
        await this.getAccessToken();
      }
      let tokenCredential = new customTokenCredential(this.$store.state.accessToken);
      const blobClient = new BlobServiceClient(
          `https://${storageAccountName}.blob.core.windows.net`,
          tokenCredential,
      );
      let i = 1;
      const iter = blobClient.listContainers();
      let containerItem = await iter.next();
      while (!containerItem.done) {
        console.log(`Container ${i++}: ${containerItem.value.name}`);
        this.containers.push({
          id: containerItem.value.properties.etag,
          name: containerItem.value.name,
        });
        containerItem = await iter.next();
      }
    },
    async getAccessToken(){
      let request = {
        scopes: ['https://storage.azure.com/user_impersonation'],
      };
      const msalInstance = new PublicClientApplication(
          this.$store.state.msalConfig,
      );
      try {
        let tokenResponse = await msalInstance.acquireTokenSilent(request);
        this.$store.commit('setAccessToken', tokenResponse.accessToken);
      } catch (error) {
        console.error( 'Silent token acquisition failed. Using interactive mode' );
        let tokenResponse = await msalInstance.acquireTokenPopup(request);
        console.log(`Access token acquired via interactive auth ${tokenResponse.accessToken}`)
        this.$store.commit('setAccessToken',tokenResponse.accessToken);
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
}
</style>
