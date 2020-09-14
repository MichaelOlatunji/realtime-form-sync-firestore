<template>
  <div class="home">
    <h1 class="">Home</h1>
    {{formData}}
    <form @submit.prevent="updateForm" @input="update" class="p-6 bg-blue-100">
      <input type="text" v-model="formData.firstName" /><br /><br />
      <input type="text" v-model="formData.lastName" /><br /><br />
      <input type="email" v-model="formData.email" /><br /><br />
      <input type="text" v-model="formData.phone" /><br /><br />
      <input type="text" v-model="formData.address" /><br /><br />
      <button type="submit">submit</button>
    </form>
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
  formData: IForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  }

  updateForm(){
    return store.dispatch("updateForm", this.formData)
  }

  update(){
    return this.debouncedUpdate()
  }

  debouncedUpdate(){
    return debounce(() => this.updateForm(), 500);
  }

  delete(){
    return store.dispatch("deleteForm")
  }

  async created(){
    await store.dispatch("bindForm");
    const data = (await store.dispatch("getForm")).data();
    if(!data){
      await store.dispatch("addForm", this.formData)
    }
    this.formData = { ...data };
    store.commit("set_status", "synced")
  }
  
}
</script>
