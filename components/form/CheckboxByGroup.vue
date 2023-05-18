<template>
  <div class="w-100 px-3">
    <div class="d-inline form-check">
      <label
        class="form-check-label d-flex align-items-center gap-2 flex-nowrap"
      >
        <input
          class="form-check-input m-0"
          type="checkbox"
          v-model="isAllSelected"
          @click="toggleSelectAll"
        />
        {{ $t("select_all") }}
      </label>
    </div>
    <div class="row mt-4">
        <div
          v-for="groupName in Object.keys(checklistGroups)"
          :key="groupName"
          class="col-4"
        >
          <div class="form-check mb-2">
            <label
              class="form-check-label bg-success text-white px-3 py-2 rounded-2 d-flex align-items-center gap-2 flex-nowrap"
            >
              <input
                class="form-check-input m-0 bg-success-light rounded-circle"
                type="checkbox"
                :value="groupName"
                :id="`checkbox-selectHeader-${groupName}`"
                v-model="selectedGroups"
                @change="toggleGroup(groupName)"
              />
              {{ $t(groupName) }}
            </label>
          </div>
          <div class="ms-3 px-1">
            <div
              v-for="checklist in checklistGroups[groupName]"
              :key="checklist.id"
            >
              <label class="cursor-pointer">
                <input
                  type="checkbox"
                  :value="checklist.id"
                  v-model="selectedchecklistIds"
                  @click="togglechecklist(checklist)"
                />
                {{ checklist[props.titleKey] }}
              </label>
            </div>
          </div>
          <br />
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  checklists: {
    type: Array,
    required: true,
  },
  groupKey: {
    type: String,
    default: "group_name",
  },
  titleKey: {
    type: String,
    default: "translated_name",
  },
  modelValue: Array,
});

const emit = defineEmits(["update:modelValue"]);

const checklistGroups = ref([]);
const selectedGroups = ref([]);
const selectedchecklistIds = ref([]);
const isAllSelected = ref(false);

watch(
  () => props.checklists,
  (newchecklists) => {
    checklistGroups.value = newchecklists.reduce((groups, checklist) => {
      if (!groups[checklist[props.groupKey]]) {
        groups[checklist[props.groupKey]] = [];
      }
      groups[checklist[props.groupKey]].push(checklist);
      return groups;
    }, []);
    Object.keys(checklistGroups.value).forEach((key) => {
      selectGroups(key);
    });
  }
);

watch(
  () => props.modelValue,
  (value) => {
    selectedchecklistIds.value = [...value];
    const groups = checklistGroups.value;
    Object.keys(groups).forEach((key) => {
      selectGroups(key);
    });
  }
);

const togglechecklist = (checklist) => {
  const checklistIndex = selectedchecklistIds.value.findIndex(
    (selectedchecklistId) => selectedchecklistId === checklist.id
  );
  if (checklistIndex === -1) {
    selectedchecklistIds.value.push(checklist.id);
  } else {
    selectedchecklistIds.value.splice(checklistIndex, 1);
  }
  emit("update:modelValue", selectedchecklistIds.value);
};

const selectGroups = (key) => {
  const groupchecklistIds = checklistGroups.value[key].map((gf) => gf.id);

  if (
    groupchecklistIds.length ===
    selectedchecklistIds.value.filter((id) => groupchecklistIds.includes(id))
      .length
  ) {
    selectedGroups.value.push(key);
  } else {
    selectedGroups.value = selectedGroups.value.filter((g) => g != key);
  }

  if (
    Array.from(new Set(selectedGroups.value)).length ===
    Object.keys(checklistGroups.value).length
  ) {
    isAllSelected.value = true;
  } else {
    isAllSelected.value = false;
  }
};

const toggleGroup = (groupName)=> {
  const groupchecklists = checklistGroups.value[groupName];

  const selectedGroupchecklists = groupchecklists.filter((checklist) => {
    return selectedchecklistIds.value.includes(checklist.id);
  });

  if (selectedGroupchecklists.length === groupchecklists.length) {
    selectedchecklistIds.value = selectedchecklistIds.value.filter((id) => {
      return !groupchecklists.map((f) => f.id).includes(id);
    });
    selectedGroups.value = selectedGroups.value.filter((g) => g != groupName);
  } else {
    groupchecklists.forEach((checklist) => {
      if (!selectedchecklistIds.value.includes(checklist.id)) {
        selectedchecklistIds.value.push(checklist.id);
      }
    });
    selectedGroups.value.push(groupName);
  }
  if (
    Array.from(new Set(selectedGroups.value)).length ===
    Object.keys(checklistGroups.value).length
  ) {
    isAllSelected.value = true;
  } else {
    isAllSelected.value = false;
  }

  emit("update:modelValue", selectedchecklistIds.value);
};

const toggleSelectAll = ()=> {
  if (isAllSelected.value) {
    selectedchecklistIds.value = [];
    selectedGroups.value = [];
  } else {
    selectedchecklistIds.value = props.checklists.map((checklist) => checklist.id);
    selectedGroups.value = Object.keys(checklistGroups.value);
  }

  emit("update:modelValue", selectedchecklistIds.value);
}
</script>
