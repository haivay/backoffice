<template>
  <div class="data">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
        <h2>{{ title }}</h2>
        <div class="form-group">
          <label for="form-selector_label">Форма:</label>
          <div class="form-selector">
            <v-selectize
              :options="formsByStaffId" 
              v-model="selectedForm"
              placeholder="Выберете форму"
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
          <thead class="thead-dark">
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
              <th scope="row">{{ indexRow + 1 }}</th>
              <td>{{ getDateFromISO(row.ts) }}</td>
              <td
                v-for="n in getMaxCellsCount()"
                :key="n"
              >
                {{ getValue(row, n-1) }}
              </td>
              <td class="w100">
                <button 
                  @click="showModalRequestData(indexRow)"
                  type="button" 
                  class="btn btn-light btn-sm"
                >
                  Открыть
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VSelectize from '@isneezy/vue-selectize'  
import axios from 'axios';

export default {
  name: 'Data',
  components: { VSelectize },
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
  created() {
    this.getForms();
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate()
    },
    getForms() {
      axios.post('/getForms')
      .then((response) => {
        this.forms = JSON.parse(JSON.stringify(response.data));
        this.formsByStaffId = this.forms.filter(form => form.staff_id.includes(this.currentStaffId))
        this.forceUpdate();
      });
    },
    getData() {
      const form = {
        id: this.selectedForm.id
      }

      axios.post('/getData', form)
      .then((response) => {
        this.data = response.data
        
        // this.reorganizeData();
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
        return value.value.toString()
      } else if (value.value == {}) {
        return 'is file'
      } else {
        return value.value.toString()
      }
    },
    showModalRequestData(indexRow) {
      console.log(indexRow)
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
</style>