<template>
  <div class="data">
    <div class="container-fluid main-content-wrapper">
      <h2>{{ title }}</h2>
      <div class="form-group">
        <label for="form-selector_label">Форма:</label>
        <div class="form-selector">
          <v-selectize
            :options="formsByStaffId" 
            v-model="selectedForm"
            placeholder="Выберите форму"
            label="type_name"
            :keys="['id', 'type_name']"
          />
        </div>
      </div>
      <div 
        v-if="!isFormSelected" 
        class="alert alert-primary" 
        role="alert"
      >
        Форма не выбрана...
      </div>
      <table v-if="isFormSelected" class="table">
        <thead class="thead-dark ">
          <tr>
            <td>№</td>
            <td>Время заявки</td>
            <td 
              v-for="(value, name, index) in this.header"
              :key="index"
            >
              {{ value.label }}
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, indexRow) in data"
            :key="indexRow"
          >
            <th scope="row" class="border-right text-center">{{ row.request_number || '-' }}</th>
            <td>{{ getDateFromISO(row.ts) }}</td>
            <td
              v-for="n in getMaxCellsCount()"
              :key="n"
            >
              {{ getValue(row, n-1) }}
            </td>
            <td class="w100">
              <button 
                @click="showModalAnswer(indexRow)"
                type="button" 
                class="btn btn-light btn-sm"
              >
                Открыть
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <transition name="fade">
        <ModalAnswer 
          v-if="isModalAnswerOpen"
          :requestNumber="modalRequestNumber"
          :requestData="modalData"
          :requestId="modalRequestId"
          :statuses="modalStatuses"
          :categories="modalCategories"
          :priorities="modalPriorities"
          @close="isModalAnswerOpen = false"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import ModalAnswer from './ModalAnswer.vue'
import VSelectize from '@isneezy/vue-selectize'  
import axios from 'axios';

export default {
  name: 'Data',
  components: { ModalAnswer, VSelectize },
  data() {
    return {
      title: 'Данные из форм',
      forms: [],
      formsByStaffId: [],
      selectedForm: null,
      isFormSelected: false,
      data: [],
      header: [],
      maxCellsCount: 0,
      isFile: false,
      currentStaffId: 'eda81559-403b-46c8-9afd-35e93fbef1cc', // моковый id сотрудника
      isModalAnswerOpen: false,
      modalTitle: '',
      modalData: [],
      modalRequestId: '',
      modalStatuses: [],
      modalCategories: [],
      modalPriorities: [],
    }
  },
  watch: {
    "selectedForm"() {
      if (this.selectedForm != {}) {
        this.isFormSelected = true
        this.header = this.selectedForm.document_fields;
        this.getData();
      }
      if (this.selectedForm === null) {
        this.isFormSelected = false
      }
    }
  },
  mounted() {
    this.getForms();
    this.getStatuses()
    this.getCategories()
    this.getPriorities()
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate()
    },
    getForms() {
      axios.post('/getForms')
      .then((response) => {
        this.forms = JSON.parse(JSON.stringify(response.data));
        this.formsByStaffId = this.forms.filter(form => form.staff_id?.includes(this.currentStaffId))
        this.forceUpdate();
      });
    },
     getStatuses() {
      axios
        .post('/getStatuses')
        .then(response => this.modalStatuses = response.data)
    },
    getCategories() {
      axios
        .post('/getCategories')
        .then(response => this.modalCategories = response.data)
    },
    getPriorities() {
      axios
        .post('/getPriorities')
        .then(response => this.modalPriorities = response.data)
    },
    getData() {
      const form = {
        id: this.selectedForm.id
      }

      axios.post('/getData', form)
      .then((response) => {
        this.data = response.data
      });
    },
    getMaxCellsCount() {
      this.maxCellsCount = this.header.length;
      return this.maxCellsCount;
    },
    getDateFromISO(dateIso) {
      let someDate = new Date(dateIso);
      var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      let date = someDate.toLocaleDateString('ru-RU', options)
      return date
    },
    getValue(row, n) {
      let resultValue = null;
      for (let data of row.request_data.data) {
        if (data.id === this.header[n].id) {
          resultValue = this.getStringValue(data)
        }
      }
      return resultValue === null ? '-' : resultValue 
    },
    getStringValue(value) {
      if (Array.isArray(value.value)) {
        return Array.isArray(value) 
        ? value.join(', ') 
        : value.value.toString()
      } else if (value.fieldType === 'date') {
        return value.value.split('-').reverse().join('.')
      } else if (value.value == {}) {
        return 'is file'
      } else {
        return value.value.toString()
      }
    },
    showModalAnswer(indexRow) {
      this.modalRequestNumber = this.data[indexRow].request_number
      this.modalRequestId = this.data[indexRow].id;
      this.modalData = []

      let requestData = this.data[indexRow].request_data.data
      let label = ''
      let value = ''

      requestData.map(d => {
        for (const h of this.header) {
          if (h.id === d.id) {
            label = h.label
            // value = Array.isArray(d.value) ? d.value.join(', ') : d.value
            value = this.convertValue(d)

            let dataWithLabel = {
              value,
              label
            }
            this.modalData.push(dataWithLabel)
          }
        }
      })

      this.isModalAnswerOpen = true
    },
    convertValue(data) {
      if (Array.isArray(data.value)) {
        return data.value.join(', ')
      }
      if (data.fieldType === 'date') {
        return data.value.split('-').reverse().join('.')
      }
      return data.value
    },
    downloadFile(index) {
      const file = this.data[index].request_data.file
      console.log(JSON.parse(JSON.stringify(file)))

      axios.post('/download', file)
      .then((response) => {
        console.log('/download response in data.vue:')
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>
  .body {
    font-family: "Bliss Pro",Helvetica,Arial,sans-serif;
  }
  .thead-dark {
    color: #495057;
    background-color: #e9ecef;
  }
  .w100 {
    width: 100px;
  }
  .fade-enter-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>