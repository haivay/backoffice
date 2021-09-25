<template>
  <div class="data">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
        <h2>{{ title }}</h2>
        <div class="form-group">
          <label for="form_training">Форма:</label>
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
        <div v-if="isFormSelected" class="table_container">
          <table class="table table-hover">
            <thead class="thead-dark">
              <tr>
                <td>№</td>
                <td>Время заявки</td>
                <td 
                  v-for="(head, index) in selectedForm.document_fields"
                  :key="index"
                >
                  {{ head.label }}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
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
      formName: 'formName1',
      formFields: [],
      selectedForm: null,
      selectedFormNonParse: {},
      isFormSelected: false,
    }
  },
  watch: {
    "selectedForm"() {
      if (this.selectedForm != {}) {
        this.isFormSelected = true
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
    }
  }
}
</script>

<style scoped>
  .body {
    font-family: "Bliss Pro",Helvetica,Arial,sans-serif;
  }
  .title {
    font-size: 30px;
    margin-bottom: 10px;
  }
  .form-group {
    margin-bottom: .7rem;
  }
  .list-group-item {
    word-break: break-all;
  }
  .list-group-item-border {
    border-bottom: 1px solid #dfdfdf !important;
  }
  .list-group-item-border-blue {
    background-color: #f0f5ff;
  }
  .textareaExample {
    resize: none;
  }
  .nopadding {
    padding: 0 !important;
    margin: 0 !important;
  }
</style>