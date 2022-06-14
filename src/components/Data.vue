<template>
  <div class="data">
    <div class="container-fluid main-content-wrapper">
      <h2>{{ title }}</h2>
      <div class="form-selector-panel">
        <label for="form-selector_label">Форма:</label>
        <div class="d-flex flex-row">
          <div class="form-selector flex-fill">
            <v-selectize
              :options="formsByStaffId" 
              v-model="selectedForm"
              placeholder="Выберите форму"
              label="type_name"
              :keys="['id', 'type_name']"
            />
          </div>
          <button 
            class="btn btn-sm btn-refresh ml-2" 
            style="height: 36px; border-color: #b8b8b8; background-color: #f9f9f9;"
            @click="resetFilters()"
            :disabled="!isFormSelected"
          >
            <font-awesome-icon :icon="['fas', 'retweet']" class="icon alt"/>
          </button>
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
      <div 
        v-if="isFormSelected && data.length === 0 && !loading"
        class="alert alert-info mt-3" 
        role="alert"
      >
        Заявок пока не поступило...
      </div>
      <div v-if="isFormSelected && data.length != 0 && !loading" class="table-and-nav">
        <table v-if="isFormSelected && !loading" class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <td 
                class="th-label"
                style="width: 100px"
              >
                <div class="sort-link" @click="toggleSortField('request_number')">
                  №
                  <span v-if="sortField === 'request_number'">
                    <font-awesome-icon :icon="sortOrder === 'ASC' ? ['fas', 'sort-down'] : ['fas', 'sort-up']" class="icon alt"/>
                  </span>
                </div>
                <input v-if="isFilterOn" class="form-control form-control-sm" v-model="fieldFilters['request_number']" @keyup="applyFieldFilter">
              </td>
              <td 
                class="th-label"
                style="width: 150px"
              >
                <div class="sort-link" @click="toggleSortField('status_id')">
                  Статус
                  <span v-if="sortField === 'status_id'">
                    <font-awesome-icon :icon="sortOrder === 'ASC' ? ['fas', 'sort-down'] : ['fas', 'sort-up']" class="icon alt"/>
                  </span>
                </div>
                <v-selectize
                  v-if="isFilterOn"
                  :options="modalStatuses" 
                  v-model="statusFilter"
                  placeholder="Выберите статус"
                  :theme="'w-100'"
                  style="width: 200px;"
                  label="status"
                  :keys="['id', 'status']"
                />
                <input v-if="isFilterOn" class="form-control form-control-sm invisible" @keyup="applyFieldFilter" style="height: 0">
              </td>
              <td 
                class="th-label"
                style="width: 150px"
              >
                <div class="sort-link" @click="toggleSortField('category_id')">
                  Категория
                  <span v-if="sortField === 'category_id'">
                    <font-awesome-icon :icon="sortOrder === 'ASC' ? ['fas', 'sort-down'] : ['fas', 'sort-up']" class="icon alt"/>
                  </span>
                </div>
                <v-selectize
                  v-if="isFilterOn"
                  :options="modalCategories" 
                  v-model="categoryFilter"
                  placeholder="Выберите категорию"
                  :theme="'w-100'"
                  style="width: 200px;"
                  label="category"
                  :keys="['id', 'category']"
                />
                <input v-if="isFilterOn" class="form-control form-control-sm invisible" @keyup="applyFieldFilter" style="height: 0">
              </td>
              <td 
                class="th-label"
                style="width: 150px"
              >
                <div class="sort-link" @click="toggleSortField('priority_id')">
                  Приоритет
                  <span v-if="sortField === 'priority_id'">
                    <font-awesome-icon :icon="sortOrder === 'ASC' ? ['fas', 'sort-down'] : ['fas', 'sort-up']" class="icon alt"/>
                  </span>
                </div>
                <v-selectize
                  v-if="isFilterOn"
                  :options="modalPriorities" 
                  v-model="priorityFilter"
                  placeholder="Выберите приоритет"
                  :theme="'w-100'"
                  style="width: 200px;"
                  label="priority"
                  :keys="['id', 'priority']"
                />
                <input v-if="isFilterOn" class="form-control form-control-sm invisible" @keyup="applyFieldFilter" style="height: 0">
              </td>
              <td 
                class="th-label"
                style="width: 130px"
              >
                <div class="sort-link" @click="toggleSortField('ts')">
                  Дата подачи
                  <span v-if="sortField === 'ts'">
                    <font-awesome-icon :icon="sortOrder === 'ASC' ? ['fas', 'sort-down'] : ['fas', 'sort-up']" class="icon alt"/>
                  </span>
                </div>
                <input v-if="isFilterOn" class="form-control form-control-sm" v-model="fieldFilters['ts']" @keyup="applyFieldFilter">
              </td>
              <td 
                v-for="(value, name, index) in this.header"
                :key="index"
                class="th-label"
                style="width: 100px"
              >
                <div class="sort-link" @click="toggleSortField(value.id)">
                  {{ value.label }}
                  <span v-if="sortField === value.id">
                    <font-awesome-icon :icon="sortOrder === 'ASC' ? ['fas', 'sort-down'] : ['fas', 'sort-up']" class="icon alt"/>
                  </span>
                </div>
                <input v-if="isFilterOn" class="form-control form-control-sm" v-model="fieldFilters[value.id]" @keyup="applyFieldFilter">
              </td>
              <td>
                <button 
                  v-if="!isFilterOn"
                  @click="isFilterOn = !isFilterOn"
                  type="button" 
                  class="btn btn-light btn-sm"
                >
                  <font-awesome-icon :icon="['fas', 'filter']" class="icon alt"/>
                  Фильтрация
                </button>
                <button 
                  v-if="isFilterOn"
                  @click="resetFilters()"
                  type="button" 
                  class="btn btn-light btn-sm mt-1"
                >
                  Очистить фильтры
                </button>
              </td>
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
              <td>{{ getCategoryById(row.category_id) }}</td>
              <td>{{ getPriorityById(row.priority_id) }}</td>
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
      </div>
      <transition name="fade">
        <ModalAnswer 
          v-if="isModalAnswerOpen"
          :requestNumber="modalRequestNumber"
          :requestData="modalData"
          :requestId="modalRequestId"
          :requestStatus="modalStatus"
          :requestCategory="modalCategory"
          :requestPriority="modalPriority"
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

export default {
  name: 'Data',
  components: { ModalAnswer, VSelectize },
  data() {
    return {
      loading: true,
      isFilterOn: false,
      filterBy: '',
      filterRule: '',
      fieldFilters: {},
      statusFilter: null,
      categoryFilter: null,
      priorityFilter: null,
      sortField: '',
      sortOrder: '',
      sortOrders: ['ASC', 'DESC'],
      timer: null,
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
      requestColors: ['table-light', 'table-info', 'table-primary', 'table-success', 'table-danger', 'table-dark'],
      modalRequestId: '',
      modalData: [],
      modalRequestNumber: '',
      modalStatus: null,
      modalCategory: null,
      modalPriority: null,
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
        this.resetFilters()
        return
      }
    },
    statusFilter() {
      console.log('статус фильтр')
      if (Object.keys(this.statusFilter).length != 0) {
        this.fieldFilters['status_id'] = this.statusFilter.id
      } else {
        delete this.fieldFilters['status_id']
      }
      // this.getData()
      this.applyFieldFilter()
    },
    categoryFilter() {
      if (Object.keys(this.categoryFilter).length != 0) {
        this.fieldFilters['category_id'] = this.categoryFilter.id
      } else {
        delete this.fieldFilters['category_id']
      }
      // this.getData()
      this.applyFieldFilter()
    },
    priorityFilter() {
      if (Object.keys(this.priorityFilter).length != 0) {
        this.fieldFilters['priority_id'] = this.priorityFilter.id
      } else {
        delete this.fieldFilters['priority_id']
      }
      // this.getData()
      this.applyFieldFilter()
    },
  },
  mounted() {
    this.getForms();
    this.getStatuses()
    this.getCategories()
    this.getPriorities()
    this.sortOrder = this.sortOrders[0]
  },
  methods: {
    toggleSortField(newSortField) {
      if (newSortField != this.sortField) {
        this.sortField = newSortField
        this.sortOrder = 'ASC'
      } else {
        this.sortOrder = this.sortOrders.filter(s => s != this.sortOrder)[0]
      }
      this.getData()
    },
    applyFieldFilter() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getData()
        // console.log(this.fieldFilters)
      }, 800);
    },
    resetFilters() {
      this.filterBy = ''
      this.filterRule = ''
      this.fieldFilters = {}
      this.statusFilter = {}
      this.categoryFilter = {}
      this.priorityFilter = {}
      this.isFilterOn = false
      // this.getData()
    },
    getForms() {
      axios
        .post('/getForms')
        .then((response) => {
          this.forms = JSON.parse(JSON.stringify(response.data));
          this.formsByStaffId = this.forms.filter(form => form.staff_id?.includes(this.currentStaffId))
          this.$forceUpdate();
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
      console.log('getData')
      this.loading = true

      let sortField = this.sortField ? this.sortField : null
      let sortOrder = this.sortField ? this.sortOrder : null
      let filters = {}
      let filtersJSON = {}

      if (Object.keys(this.fieldFilters).length != 0) {
        console.log(this.fieldFilters)
        for (let field in this.fieldFilters) {
          if (field == 'request_number' || field == 'status_id' || field == 'category_id' || field == 'priority_id' || field == 'ts') {
            filters[field] = this.fieldFilters[field]
          } else {
            filtersJSON[field] = this.fieldFilters[field]
          }
        }
      }

      filters = Object.keys(filters).length != 0 ? filters : null
      filtersJSON = Object.keys(filtersJSON).length != 0 ? filtersJSON : null

      let queryData = {
        id: this.selectedForm.id,
        filters: filters,
        filtersJSON: filtersJSON,
        sortField: sortField,
        sortOrder: sortOrder,
      }

      await axios
        .post('/getRequests', queryData)
        .then((response) => { 
          this.data = response.data
          this.loading = false
        })
    },
    getMaxCellsCount() {
      this.maxCellsCount = this.header.length;
      return this.maxCellsCount;
    },
    getColorForTableRow(row) {
      let index = this.modalStatuses.findIndex(status => status.id == row.status_id)
      let color = this.requestColors[index]
      return color
    },
    getStatusById(id) {
      return id === null ? '-' : this.modalStatuses.filter(s => s.id === id)[0].status
    },
    getCategoryById(id) {
      return id === null ? '-' : this.modalCategories.filter(c => c.id === id)[0].category
    },
    getPriorityById(id) {
      return id === null ? '-' : this.modalPriorities.filter(p => p.id === id)[0].priority
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
    showModalAnswer(indexRow) {
      this.modalRequestId = this.data[indexRow].id
      this.modalRequestNumber = this.data[indexRow].request_number
      this.modalStatus = this.data[indexRow].status_id
      this.modalCategory = this.data[indexRow].category_id
      this.modalPriority = this.data[indexRow].priority_id
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