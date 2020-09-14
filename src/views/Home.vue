<template>
  <div class="home">
    <h1 class="">Home</h1>
    <input type="text" v-model="firstName" />
    <input type="text" v-model="lastName" />
    <input type="text" v-model="email" />
    <input type="text" v-model="phone" />
    <input type="text" v-model="address" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { IForm } from '../utils/formInterface'

@Options({
})

export default class Home extends Vue {
  public formData: IForm = {}

  
}
</script>
