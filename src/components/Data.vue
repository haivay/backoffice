<template>
  <div class="data">
    <div class="container-fluid main-content-wrapper">
      <h2>{{ title }}</h2>
      <div>
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
        class="alert alert-primary mt-3" 
        role="alert"
      >
        Форма не выбрана...
      </div>
      <div v-if="isFormSelected && loading" class="text-center mt-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Загрузка...</span>
        </div>
      </div>
      <!-- <div v-if="isFormSelected && !loading" class="settings py-3">
        <div class="text-center mb-2">Фильтрация</div>
        <div class="row">
          <div class="col">
            <div class="form-selector">
              <v-selectize
                :options="header" 
                v-model="filterBy"
                placeholder="Выберите поле"
                label="label"
                :keys="['id', 'label']"
              />
            </div>
          </div>
          <div class="col">
            <input type="text" class="form-control" v-model="filterRule">
          </div>
        </div>
      </div> -->
      {{ sortBy }}
      <table v-if="isFormSelected && !loading" class="table table-hover">
        <thead class="thead-dark">
          <tr>
            <td 
              class="sort-link th-label" 
              @click="sortBy = { id: 'request_number', label: 'Номер заявки' }"
            >
              №
              <span v-if="sortBy.id === 'request_number' && sortOrder.id === 'asc'">
                <font-awesome-icon :icon="['fas', 'sort-down']" class="icon alt"/>
              </span>
              <span v-if="sortBy.id === 'request_number' && sortOrder.id === 'desc'">
                <font-awesome-icon :icon="['fas', 'sort-up']" class="icon alt"/>
              </span>
            </td>
            <td 
              class="sort-link th-label" 
              @click="sortBy = { id: 'status_id', label: 'Статус' }"
            >
              Статус
              <span v-if="sortBy.id === 'status_id' && sortOrder.id === 'asc'">
                <font-awesome-icon :icon="['fas', 'sort-down']" class="icon alt"/>
              </span>
              <span v-if="sortBy.id === 'status_id' && sortOrder.id === 'desc'">
                <font-awesome-icon :icon="['fas', 'sort-up']" class="icon alt"/>
              </span>
            </td>
            <td 
              class="sort-link th-label" 
              @click="sortBy = { id: 'ts', label: 'Время заявки' }"
            >
              Время заявки
              <span v-if="sortBy.id === 'ts' && sortOrder.id === 'asc'">
                <font-awesome-icon :icon="['fas', 'sort-down']" class="icon alt"/>
              </span>
              <span v-if="sortBy.id === 'ts' && sortOrder.id === 'desc'">
                <font-awesome-icon :icon="['fas', 'sort-up']" class="icon alt"/>
              </span>
            </td>
            <td 
              v-for="(value, name, index) in this.header"
              :key="index"
              class="sort-link th-label"
              @click="sortBy = { id: value.id, label: value.label }"
            >
              {{ value.label }}
              <span v-if="sortBy.id === value.id && sortOrder.id === 'asc'">
                <font-awesome-icon :icon="['fas', 'sort-down']" class="icon alt"/>
              </span>
              <span v-if="sortBy.id === value.id && sortOrder.id === 'desc'">
                <font-awesome-icon :icon="['fas', 'sort-up']" class="icon alt"/>
              </span>
            </td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, indexRow) in data"
            :key="indexRow"
            :class="getColorForTableRow(row)"
          >
            <th scope="row" class="border-right text-center">{{ row.request_number || '-' }}</th>
            <td>{{ getStatusById(row.status_id) }}</td>
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
      <nav v-if="isFormSelected && !loading">
        <ul class="pagination justify-content-center">
          <li class="page-item disabled">
            <a class="page-link">Предыдущая</a>
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Следующая</a>
          </li>
        </ul>
      </nav>
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
          @refreshData="getData"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import ModalAnswer from './ModalAnswer.vue'
import VSelectize from '@isneezy/vue-selectize'  
import axios from 'axios';
import _orderBy from 'lodash/orderBy'

export default {
  name: 'Data',
  components: { ModalAnswer, VSelectize },
  data() {
    return {
      loading: true,
      filterBy: '',
      filterRule: '',
      sortBy: '',
      sortOrder: '',
      sortOrders: [
        {
          id: 'asc',
          label: 'По возрастанию'
        },
        {
          id: 'desc',
          label: 'По убыванию'
        }
      ],
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
      this.loading = true
      if (this.selectedForm === null) {
        this.isFormSelected = false
        return
      }
      if (this.selectedForm != {}) {
        this.isFormSelected = true
        this.data = []
        this.header = this.selectedForm.document_fields;
        this.getData();
        return
      }
    },
    sortBy(newSortParameter, oldSortParameter) {
      if (newSortParameter.id != oldSortParameter.id) {
        this.sortOrder = this.sortOrders[0]
      } else {
        if (this.sortOrder.id == this.sortOrders[0].id) {
          this.sortOrder = this.sortOrders [1]
        } else {
          this.sortOrder = this.sortOrders [0]
        }
      }

      this.sortData()
    }
  },
  mounted() {
    this.getForms();
    this.getStatuses()
    this.getCategories()
    this.getPriorities()
    this.sortOrder = this.sortOrders[0]
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate()
    },
    getForms() {
      axios
        .post('/getForms')
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
    async getData() {
      await axios
        .post('/getRequests', { id: this.selectedForm.id })
        .then((response) => { 
          this.data = response.data
          this.addStatuses() 
        })
    },
    getMaxCellsCount() {
      this.maxCellsCount = this.header.length;
      return this.maxCellsCount;
    },
    async addStatuses() {
      this.data.forEach( async (item, i) => {
        const result = await axios.post('/getAnswerByRequestNumber', { requestNumber: item.request_number })
        const status = result.data

        if (status.length === 0) {
          this.$set(this.data[i], 'status_id', 'new')
        } else {
          this.$set(this.data[i], 'status_id', status[0].status_id)
        }

        if (i === this.data.length - 1) {
          this.loading = false
        }
      })
    },
    getColorForTableRow(row) {
      return {
        'table-info': row.status_id === 'accepted',
        'table-success': row.status_id === 'processed',
        'table-danger': row.status_id === 'rejected',
        'table-primary': row.status_id === 'inProcess',
        'table-light': row.status_id === 'new',
        'table-dark': row.status_id === 'closed'
      }
    },
    getStatusById(id) {
      if (id) {
        let status = this.modalStatuses.filter(s => s.id === id)[0].status
        return status
      }
    },
    getDateFromISO(dateIso) {
      let someDate = new Date(dateIso);
      var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      let date = someDate.toLocaleDateString('ru-RU', options)
      return date
    },
    getValue(row, n) {
      let resultValue = row.request_data[this.header[n].id]
      return (resultValue === undefined || resultValue === null)  ? '-' : resultValue 
    },
    sortData() {
      this.loading = true
      let field = this.sortBy.id
      
      if (field === 'request_number' || field === 'status_id' || field === 'ts') {
        this.data = _orderBy(this.data, field, this.sortOrder.id)
      } else {
        let fieldIndex = this.header.findIndex((h) => h.id === field)
        let have = false

        for (let i = 0; i < this.data.length; i++)  {
          if (this.data[i].request_data.data[fieldIndex]?.dataType === 'number') {
            have = true
            break
          }
        }
        
        if (have) {
          this.data = _orderBy(this.data, item => +item.request_data.data[fieldIndex].value, this.sortOrder.id)
        } else {
          this.data = _orderBy(this.data, item => item.request_data.data[fieldIndex].value, this.sortOrder.id)
        }
      }

      this.loading = false
    },
    showModalAnswer(indexRow) {
      this.modalRequestNumber = this.data[indexRow].request_number
      this.modalRequestId = this.data[indexRow].id;
      this.modalData = []
      let label = ''
      let value = ''

      label = this.header[indexRow]

      this.header.map(h => {
        label = h.label
        value = this.data[indexRow].request_data[h.id]
        
        let dataWithLabel = {
          label,
          value
        }

        this.modalData.push(dataWithLabel)
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
  .sort-link:hover {
    color: #8d9aa7;
    cursor: pointer;
  }
  .th-label {
    /* чтобы после даблклика по label, текст не выделялся */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;           /* Non-prefixed version, currently
                                    not supported by any browser */
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