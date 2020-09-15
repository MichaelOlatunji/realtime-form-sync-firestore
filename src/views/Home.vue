<template>
  <div class="home">
    <h1 class=""></h1>
    {{formData}}
    {{status}}
    <div class="grid justify-center pt-8 bg-blue-200 rounded-lg mx-8">
      <form class="w-full max-w-lg px-4" @submit.prevent="updateForm" @input="update">
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              First Name
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="John" v-model="formData.firstName" />
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
              Last Name
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe"  v-model="formData.lastName" />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Email
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="email" placeholder="xyz@example.com"  v-model="formData.email" />
            <!-- <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p> -->
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Phone
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="xxxxxxxxxx"  v-model="formData.phone" />
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
              Address
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="address"  v-model="formData.address" />
          </div>
        </div>
        <div class="flex flex-wrap justify-center pb-6">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4" @click="revertToInitial">
            Revert
          </button>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4">
            Submit
          </button>
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-4" @click="clearForm">
            Delete
          </button>
        </div>
      </form>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { IForm } from '../utils/formInterface';
import { debounce } from 'debounce';
import store from '../store/index';

@Options({
})

export default class Home extends Vue {
  initialState: IForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  }

  formData: IForm = this.initialState; 
  referenceState: IForm | null = null;

  get status(){
    return store.getters.getStatus;
  }

  updateForm(){
    return store.dispatch("updateForm", this.formData)
  }

  update(){
    this.debouncedUpdate()
  }

  debouncedUpdate = debounce(() => {
    Promise.resolve(this.updateForm())
    }, 1500);

  clearForm(){
    this.formData = { ...this.initialState }
    return store.dispatch("deleteForm")
  }

  revertToInitial(){
    store.commit("setSatus", "revert");
    this.formData = { ...this.referenceState };
  }

  async created(){
    await store.dispatch("bindForm");
    const data = (await store.dispatch("getForm")).data();
    if(!data){
      await store.dispatch("addForm", this.formData)
    }
    this.formData = { ...data };
    this.referenceState = { ...data };
    store.commit("setSatus", "synced")
  }
  
}
</script>
