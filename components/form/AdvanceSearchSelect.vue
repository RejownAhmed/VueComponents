<template>
  <div class="dropdown">
    <div class="dropdown-toggle w-100 text-start border border-1 mb-3 py-3 text-muted form-select" type="button"
      data-bs-toggle="dropdown">
      {{ selectedOption ? selectedOption : $t('select_subscriber') }}
    </div>
    <div class="dropdown-menu">
      <div class="form-group mb-3">
        <input type="text" class="form-control" placeholder="Search" v-model="searchQuery" @input="search">
      </div>
      <div class="menu-container">
        <template v-if="preloader == 'search'">
          <div class="position-relative w-100 p-3 d-flex justify-content-center align-items-center">
            <Spinner class="text-primary width-20 height-20"></Spinner>
          </div>
        </template>
        <template v-else>
          <template v-if="options.length > 0">
            <a v-for="option in options" :key="option.id" class="dropdown-item cursor-pointer"
              @click="selectOption(option)">
              {{  getDescendantProp(option, props.showKey) }}
            </a>
          </template>
        </template>
        <template v-if="preloader == 'fetch'">
          <div class="position-relative w-100 p-3 d-flex justify-content-center align-items-center">
            <Spinner class="text-primary width-20 height-20"></Spinner>
          </div>
        </template>
        <scroll-observer @intersect="fetchData"></scroll-observer>
      </div>
    </div>
  </div>
</template>

<script setup>
import Axios from '@/services/axios';
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import ScrollObserver from '@/components/observer/ScrollObserver.vue'
import Spinner from '@/components/preloaders/Spinner.vue';
import { delay } from '@/utilities/helpers';
import { debounce as _debounce } from 'lodash';

const props = defineProps({
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
  showKey: String
})

const emits = defineEmits(['update:modelValue'])

const options = ref([])
const selectedOption = ref('')
const searchQuery = ref('')
const lastPage = ref(1);
const currentPage = ref(0);
const preloader = ref('search');

const getDescendantProp = (obj, desc) => {
          var arr = desc.split(".");
          while(arr.length && (obj = obj[arr.shift()]));
          return obj;
      }

function fetchData() {
  if (currentPage.value > lastPage.value) return;
  currentPage.value++;
  preloader.value = 'fetch';
  getData('fetch');
}

const search = _debounce(() => {
  preloader.value = 'search';
  currentPage.value = 1;
  getData('search')
}, 500)
const getData = (getType = 'search') => {
  Axios.get(`${props.fetchUrl}?page=${currentPage.value}&per_page=${props.perPage}&search=${searchQuery.value}`)
    .then(async ({ data }) => {
      await delay(1000);
      lastPage.value = data.last_page
      if (getType == 'fetch') {
        options.value = options.value.concat(data.data)
      } else {
        options.value = data.data
      }
    }).catch(error => console.log(error)).finally(() => preloader.value = null)
}
function selectOption(option) {
  selectedOption.value = option.full_name
  emits('update:modelValue', option.id);
}

onMounted(() => getData());
</script>
