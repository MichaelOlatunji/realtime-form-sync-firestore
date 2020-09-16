<template>
  <div class="home pt-8">
    <h1 class="uppercase font-bold pb-4 text-2xl">Realtime form</h1>
    <div class="grid justify-center pt-8 bg-blue-200 rounded-lg mx-8">
      <div class="grid justify-center pb-8">
        <div class="bg-green-400 py-3 text-white font-bold text-center px-6 rounded" v-if="status === 'synced'">
          Form data synced with Firestore
        </div>
        <div class="bg-blue-400 py-3 text-white font-bold text-center px-6 rounded" v-else-if="status === 'loading'">Loading...</div>
        <div class="bg-yellow-400 py-3 text-white font-bold text-center px-6 rounded" v-else-if="status === 'revert'">
          Form data is reverted to original data
        </div>
        <div class="bg-red-400 py-3 text-white font-bold text-center px-6 rounded" v-else-if="status === 'deleted'">
          Form data is deleted from firestore
        </div>
        <div class="bg-red-400 py-3 text-white font-bold text-center px-6 rounded" v-else-if="status === 'error'">
          Failed to write to Firestore. {{ errorMessage }}
        </div>
      </div>
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
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4" @click="showRevertModal">
            Revert
          </button>
          <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4">
            Submit
          </button>
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-4" @click="showDeleteModal">
            Delete
          </button>
        </div>
      </form>
      
    </div>
    <modal :showModal="displayModal" @onconfirm="revertToInitial" @oncancel="cancelRevertModal" />
    <modal :showModal="displayDeleteModal" @onconfirm="clearForm" @oncancel="cancelDeleteModal" />
    
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { IForm } from '../utils/formInterface';
import { debounce } from 'debounce';
import store from '../store/index';
import modal from '../components/modal.vue';

@Options({
  components: {
    modal
  }
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
  displayModal = false;
  displayDeleteModal = false;

  get status(){
    return store.getters.getStatus;
  }

  get errorMessage(){
    return store.getters.getErrorMessage;
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

  async clearForm(){
    this.formData = { ...this.initialState }
    await store.dispatch("deleteForm");
    this.displayDeleteModal = false;
  }

  revertToInitial(){
    store.commit("setStatus", "revert");
    this.formData = { ...this.referenceState };
    this.displayModal = false;
  }

  showRevertModal(){
    this.displayModal = true
  }

  showDeleteModal(){
    this.displayDeleteModal = true;
  }

  cancelRevertModal(){
    this.displayModal = false;
  }

  cancelDeleteModal(){
    this.displayDeleteModal = false;
  }

  async created(){
    await store.dispatch("bindForm");
    const data = (await store.dispatch("getForm")).data();
    if(!data){
      await store.dispatch("addForm", this.formData)
    }
    this.formData = { ...data };
    this.referenceState = { ...data };
    store.commit("setStatus", "synced")
  }
  
}
</script>
