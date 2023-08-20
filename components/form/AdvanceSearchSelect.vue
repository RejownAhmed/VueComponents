<template>
  <div class="dropdown">
    <div class="dropdown-toggle w-100 text-start border border-1 mb-3 py-3 text-muted form-select" type="button"
      data-bs-toggle="dropdown">
      {{ selectedOption ? getDescendantProp(selectedOption, showKey) : $t('select_subscriber') }}
    </div>
    <div class="dropdown-menu">
      <div class="form-group mb-3">
        <input type="text" class="form-control" placeholder="Search" v-model="searchQuery" @input="search">
      </div>
      <div class="menu-container">
        <template v-if="options.length > 0">
          <a v-for="option in options" :key="option.id" class="dropdown-item cursor-pointer"
            @click="selectOption(option)">
            {{  getDescendantProp(option, showKey) }}
          </a>
        </template>
        <template v-else-if="!preloader">
          <NoData msg="Nothing found!"/>
        </template>
        <scroll-observer @intersect="fetchData" />
        <template v-if="preloader">
          <div class="position-relative w-100 p-3 d-flex justify-content-center align-items-center">
            <Spinner class="text-primary width-20 height-20"></Spinner>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ScrollObserver from '@/components/observer/ScrollObserver.vue'
import Spinner from '@/components/preloaders/Spinner.vue';
import useInfinityLoader from '@/composable/useInfinityLoader';

const { fetchUrl, perPage, modelValue, showKey, modelKey } = toRefs(defineProps({
  fetchUrl: {
    type: String,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  showKey: {
    type: String,
    default: 'id'
  },
  modelKey: {
    type: String,
    default: 'id'
  },
}));

const emits = defineEmits(['update:modelValue']);

const {
  data: options,
  pending: preloader,
  error,
  fetchData,
  searchValue: searchQuery,
  search,
} = useInfinityLoader(fetchUrl.value, 10);

const selectedOption = ref({})

const getDescendantProp = (obj, desc) => {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

function selectOption(option) {
  selectedOption.value = option
  emits('update:modelValue', getDescendantProp(option, modelKey.value));
}

</script>
