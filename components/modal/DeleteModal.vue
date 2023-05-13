<template>
    <div :id="'delete-' + modalId" class="modal fade" tabindex="-1" :aria-labelledby="`${'delete-' + modalId}-ModalLabel`"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body ">
                    <div>
                        <div class="text-left">
                            <i :class="[icon ? icon : 'feather-trash-2', 'text-danger display-1']" />
                        </div>
                        <div v-if="customImage" class="mb-3">
                            <img loading="lazy" :src="$image(customImage)" alt="">
                        </div>
                    </div>

                    <h5 class="font-weight-bold">
                        {{ title ? title : $t('delete_confirmation') }}
                    </h5>
                    <p class="mb-2">
                        {{ text ? text : $t('operation_cannot_undone') }}
                    </p>

                    <div class="d-flex gap-1 justify-content-end mt-4">
                        <a href="#" class="btn btn-white border" data-dismiss="modal" @click.prevent="cancelled">
                            {{ cancelBtnText ? cancelBtnText : $t('cancel') }}
                        </a>

                        <button type="submit" class="text-white btn btn-danger"
                            data-dismiss="modal" :disabled="preloader" @click.prevent="confirmed">
                            <template v-if="preloader">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                            </template>
                            <template v-else>
                                {{ confirmBtnText ? confirmBtnText : $t('delete') }}
                            </template>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import {useToast} from "vue-toastification";
import useEmitter from "@/composable/useEmitter";
import {urlGenerator} from "@/utilities/url";

const props = defineProps({
    modalId: {
        type: String,
        require: true
    },
    url: {
        type: String,
        required: true
    },
    tableId: String,
    title: String,
    icon: String,
    text: String,
    cancelBtnText: {
        type: String
    },
    confirmBtnText: {
        type: String
    },
    customImage: String
});
const emit = defineEmits(['cancelled', 'confirmed']);
const preloader = ref(false);
const toast = useToast();
const emitter = useEmitter();

const openModal = () => {
    let appModal = new Modal(document.getElementById('delete-' + props.modalId))
    appModal.show();
}
const closeModal = () => {
    let modal = Modal.getInstance(document.getElementById('delete-' + props.modalId));
    modal.hide();
}

const cancelled = () => {
    closeModal();
    emit('cancelled');
}

const confirmed = async () => {
    preloader.value = true;
    await axios.delete(urlGenerator(props.url)).then((response) => {
        closeModal();
        toast.success(response.data.message);
        emitter.emit('reload-' + props.tableId);
        emit('confirmed');
    }).catch((error) => {
        if(error.response?.data?.message) toast.error(error.response.data.message);
    }).finally(() => preloader.value = false);

}

onMounted(() => {
    openModal();
})

</script>


<style scoped>
.custom-img {
    width: 80px;
}
</style>
