<template>
  <label
    :for="props.id"
    class="form-floating p-0 w-100"
  >
    <div
      class="input-panel position-relative border border-1 w-100 rounded-3 py-3 d-flex justify-content-start align-items-center flex-wrap gap-1"
      :class="{typing: typing, hastext: tags.length}"
    >
      <span
        v-for="(singleTag, i) in tags"
        :key="i"
        class="badge badge-pill bg-primary text-black rounded-5 p-1 px-2"
      >
        {{ singleTag }}
      <span
        class="ms-1 bg-danger text-white rounded-5 cursor-pointer"
        @click="deleteTag(singleTag)"
      >
      <i class="feather-x-circle" /></span></span>
      <input
        :id="props.id"
        v-model="tag"
        :type="props.type"
        class="border-0 outline-none flex-grow-1"
        @focusin="typing = true"
        @focusout="typing = false"
        :placeholder="tags.length ? $t('type_here')+'...' : ''"
        @keydown="addTag"
      >
      <span class="tag-input-label">
        {{ props.label }}
      </span>
    </div>
    <div
      v-if="errors.alreadyAdded"
      class="small text-danger"
    >
      {{ errors.alreadyAdded }}
    </div>
  </label>
</template>

<script setup>
import { watch, ref } from 'vue'
import {useI18n} from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
    modelValue: Array,
	id: String,
	label: String,
    type: String
})
const emit = defineEmits(['update:modelValue']);
const tags = ref([]);
const tag = ref(null);
const errors = ref({});
const typing = ref(false);
watch(()=> props.modelValue, (val)=>{
    tags.value = val;
});
const addTag = (e)=>{
    errors.value = {};
    if(e.which == 188 || e.which == 32 || e.which == 13){
        if(tag.value == null) return;
        if (tags.value.includes(tag.value)) return errors.value.alreadyAdded = 'This one is already added!';
        emit('update:modelValue', [...tags.value, tag.value]);
        tag.value = null;
    }
    if (e.which == 8 && tag.value == null ) {
        tags.value.splice((tags.value.length - 1), 1);
        emit('update:modelValue', tags.value);
    }
}
const deleteTag = (tag)=>{
    tags.value = tags.value.filter(item=> item != tag);
    emit('update:modelValue', tags.value);
}

</script>

<style lang="scss" scoped>
.input-panel{
    min-height: 50px;
    padding: 8px 12px;
    font-size: 0.95rem;
    input{
        height: 16px;
        outline: none;
        &:focus,&:active{
            outline: none;
        }
        &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            display: none;
          }
    }
    .tag-input-label{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 1rem 0.75rem;
        overflow: hidden;
        text-align: start;
        text-overflow: ellipsis;
        white-space: nowrap;
        pointer-events: none;
        border: 1px solid transparent;
        transform-origin: 0 0;
        transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
        display: flex;
        align-items: center;
        color: var(--text-disabled);
        transition: 0.35s;
    }
    &.typing{
        border-color: #a2b3f9 !important;
        .tag-input-label{
            width: initial;
            height: initial;
            top: -16px;
            left: 8px;
            padding: 0.3rem 0.75rem;
            margin: 0;
            color: var(--color-primary);
            font-size: 13px;
            opacity: 1;
            background-color: var(--bs-white);
            transform: none;
        }
    }
    &.hastext{
        border-color: var(--color-primary) !important;
        .tag-input-label{
            width: initial;
            height: initial;
            top: -16px;
            left: 8px;
            padding: 0.3rem 0.75rem;
            margin: 0;
            color: var(--color-primary);
            font-size: 13px;
            opacity: 1;
            background-color: var(--bs-white);
            transform: none;
        }
    }
    &:hover{
        border-color: var(--color-primary) !important;
    }
}
</style>
