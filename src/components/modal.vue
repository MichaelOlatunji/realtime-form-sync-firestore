<template>
<div class="">
    <div :class="`${showModal ? '':'hidden'} modal fixed top-0 left-0 w-full h-full outline-none border-none add-overlay fade pt-4`" tabindex="-1" role="dialog">
        <div class="modal-dialog relative w-auto pointer-events-none max-w-lg my-8 mx-auto px-4 sm:px-0" role="document">
            <div class="relative flex flex-col w-full pointer-events-auto bg-blue-600 rounded-lg">
            <div class="flex items-center p-4 border-t border-gray-300">
                <p class="text-white text-sm mr-auto font-bold">Are you sure? All changes will be reverted</p>
                <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm mr-3 focus:outline-none" data-dismiss="modal" @click="confirm">confirm</button>
                <button type="button" class="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border border-gray-100 text-sm focus:outline-none" @click="cancel">cancel</button>
            </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { defineComponent } from 'vue'

const Modal = defineComponent({
    props: {
        showModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            proceed: false
        }
    },
    methods: {
        confirm(){
            this.$emit('onConfirm')
        },
        cancel(){
            this.$emit('onCancel')
        }
    }
})

export default Modal

</script>

<style scoped >
.modal {
  z-index: 1072;
}
.add-overlay{
    background: rgba(0,0,0,0.3)
}



</style>