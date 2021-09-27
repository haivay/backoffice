<template>
  <div class="data">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
        <h2>{{ title }}</h2>
        <div class="form-group">
          <label for="form-selector_label">Форма:</label>
          <div class="form-selector">
            <v-selectize
              :options="forms" 
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
                {{ name }}
              </td>
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
                v-for="(value, name, indexCell) in JSON.parse(row.request_data.data)"
                :key="indexCell"
              >
                {{ getValue(value) }}
                <button 
                  v-if="isFile && value === ''"
                  type="button" 
                  class="btn btn-primary"
                  @click="downloadFile(indexRow)"
                >
                  Скачать
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
      selectedForm: null,
      isFormSelected: false,
      data: [],
      header: {},
      isFile: false
    }
  },
  watch: {
    "selectedForm"() {
      if (this.selectedForm != {}) {
        this.isFormSelected = true
        this.getData()
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
        this.forceUpdate();
      });
    },
    getData() {
      const form = {
        id: this.selectedForm.id
      }

      axios.post('/getData', form)
      .then((response) => {
        console.log(response.data)
        this.data = response.data
        this.header = JSON.parse(response.data[0].request_data.data)
        if ('file' in response.data[0].request_data) {
          this.isFile = true
        } else {
          this.isFile = false
        }
      });
    },
    getDateFromISO(dateIso) {
      let someDate = new Date(dateIso);
      var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      let date = someDate.toLocaleDateString('ru-RU', options)
      return date
    },
    getValue(value) {
      if (Array.isArray(value)) {
        return value.toString()
      } else if (value == {}) {
        return ''
      } else {
        return value.toString()
      }
    },
    downloadFile(index) {
      const file = {
        filename: this.data[index].request_data.file.filename
      }
      console.log(file.filename)

      // axios.post('/download', file)
      //   .then((response) => {
      //     console.log('response in data.vue')
      //     console.log(response)
      //   })
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
</style>