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
                @click="isFilterOn = !isFilterOn"
                type="button" 
                class="btn btn-light btn-sm"
              >
                <font-awesome-icon :icon="['fas', 'filter']" class="icon alt"/>
                Фильтрация
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
      statusFilter: {},
      categoryFilter: {},
      priorityFilter: {},
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
    statusFilter() {
      if (this.statusFilter) {
        this.fieldFilters['status_id'] = this.statusFilter.id
      } else {
        this.fieldFilters['status_id'] = null
      }
      this.getData()
    },
    categoryFilter() {
      if (this.categoryFilter) {
        this.fieldFilters['a.category_id'] = this.categoryFilter.id
      } else {
        this.fieldFilters['a.category_id'] = null
      }
      this.getData()
    },
    priorityFilter() {
      if (this.priorityFilter) {
        this.fieldFilters['a.priority_id'] = this.priorityFilter.id
      } else {
        this.fieldFilters['a.priority_id'] = null
      }
      this.getData()
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
      }, 800);
    },
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
      this.loading = true

      let sortField = this.sortField ? this.sortField : null
      let sortOrder = this.sortField ? this.sortOrder : null
      let filters = null

      if (Object.keys(this.fieldFilters).length != 0) {
        filters = this.fieldFilters
      }

      let queryData = {
        id: this.selectedForm.id,
        filters: filters,
        sortField: sortField,
        sortOrder: sortOrder,
      }

      console.log(queryData)

      await axios
        .post('/getRequests', queryData)
        .then((response) => { 
          this.data = response.data
          this.loading = false
          // this.addAnswerToData() 
        })
    },
    getMaxCellsCount() {
      this.maxCellsCount = this.header.length;
      return this.maxCellsCount;
    },
    // async addAnswerToData() {
    //   this.data.forEach( async (item, i) => {
    //     const result = await axios.post('/getAnswerByRequestNumber', { requestNumber: item.request_number })
    //     const answer = result.data
    //     console.log(answer)

    //     if (answer.length === 0) {
    //       this.$set(this.data[i], 'status_id', 'new')
    //       this.$set(this.data[i], 'category_id', '-')
    //       this.$set(this.data[i], 'priority_id', '-')
    //       this.$set(this.data[i], 'change_time', '-')
    //     } else {
    //       this.$set(this.data[i], 'status_id', answer[0].status_id)
    //       this.$set(this.data[i], 'category_id', answer[0].category_id)
    //       this.$set(this.data[i], 'priority_id', answer[0].priority_id)
    //       this.$set(this.data[i], 'change_time', answer[0].change_time)
    //     }

    //     if (i === this.data.length - 1) {
    //       this.loading = false
    //     }
    //   })
    // },
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
        return id === 'new' ? 'Новая' : this.modalStatuses.filter(s => s.id === id)[0].status
      }
    },
    getCategoryById(id) {
      if (id) {
        return id === '-' ? id : this.modalCategories.filter(c => c.id === id)[0].category
      }
    },
    getPriorityById(id) {
      if (id) {
        return id === '-' ? id : this.modalPriorities.filter(p => p.id === id)[0].priority
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
    updateData() {
      this.loading = true


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