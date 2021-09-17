<template>
  <div class="root">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
          <div class="row">
            <div class="col-4">
              <div class="formList">
                <div 
                  class="form"
                  v-for="(form, index) in forms"
                  :key="index"
                >
                  <div class="list-group list-group-flush">
                    <button 
                      type="button" 
                      class="list-group-item list-group-item-action" 
                      aria-current="true"
                    >
                      {{ form.type_name }} 
                    </button>
                    <!-- {{ form.document_fields }} -->
                  </div>
                </div>
              </div>
            </div>
            <div class="col-8">
              <div 
                v-if="selectedForm != {}"
                class="alert alert-primary" 
                role="alert"
              >
                Форма не выбрана
              </div>
              <!-- <h2 class='title'>{{ title }}</h2>
              <form class="doc" @submit.prevent="checkForm">
                <div class="form-group">
                  <label for="fullName">Ваше полное имя (ФИО):</label>
                  <input 
                    type="text" 
                    id='fullName'
                    placeholder="Введите ФИО"
                    class="form-control"
                    :class="$v.form.fullName.$error ? 'is-invalid' : ''"
                    v-model.trim="form.fullName"
                  >
                  <p v-if="$v.form.fullName.$dirty && !form.fullName.required" class="invalid-feedback">
                    Обязательное поле
                  </p>
                </div>
                <div class="form-group">
                    <label for="form_training">Выберете форму обучения:</label>
                    <div class="form-selector">
                      <v-selectize 
                        :options="form.formsOfTrain" 
                        v-model="form.formSelected" 
                        placeholder="Выберете форму обучения (поиск по трем символам)"
                      />
                    </div>
                    <p v-if="$v.form.formSelected.$dirty && !form.formSelected.required" class="invalid-feedback">
                      Обязательное поле
                    </p>
                </div>
                <div class="form-group">
                  <label for="groupName">Название группы:</label>
                  <input 
                    type="text" 
                    id='groupName'
                    placeholder="Введите название группы (пример: ПИб-21)"
                    class="form-control"
                    :class="$v.form.groupName.$error ? 'is-invalid' : ''"
                    v-model.trim="form.groupName"
                  >
                  <p v-if="$v.form.groupName.$dirty && !form.groupName.required" class="invalid-feedback">
                    Обязательное поле
                  </p>
                </div>
                <div class="form-group">
                  <label for="dateFrom">С какого числа справка:</label>
                  <div class="input-group date">
                    <input type="text" class="form-control">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary input-group-addon">
                        <span class="fa fa-calendar">

                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="dateTo">До какого числа справка:</label>
                  <div class="input-group date">
                    <input type="text" class="form-control">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary input-group-addon">
                        <span class="fa fa-calendar">

                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="btn-group">Выберите способ получения:</label>
                  <div class="btn-group btn-group-toggle w-100" data-toggle="buttons" role="group" aria-label="Basic example">
                    <label 
                      class="btn btn-outline-primary"
                      :class="{active: form.isActive}"
                    >
                      <input 
                        type="radio" 
                        name="options" 
                        id="way_to_get_option1" 
                        value="option1" 
                        v-model="form.wayToGetOption"
                      > Лично в отделе бухгалтерии
                    </label>
                    <label 
                      class="btn btn-outline-primary"
                      :class="{active: !form.isActive}"
                    >
                      <input 
                        type="radio" 
                        name="options" 
                        id="way_to_get_option2" 
                        value="option2" 
                        v-model="form.wayToGetOption" 
                      > В виде скан-копии по электронной почте
                    </label>
                  </div>
                </div>
                <div 
                  class="form-group"
                  v-if="!form.isActive"
                >
                  <label for="email">Введите электронную почту:</label>
                  <input 
                    type="email" 
                    id='email'
                    placeholder="Введите email"
                    class="form-control"
                    :class="$v.form.email.$error ? 'is-invalid' : ''"
                    v-model.trim="form.email"
                  >
                  <p v-if="$v.form.email.$dirty && !form.email.email" class="invalid-feedback">
                    Некорректный email
                  </p>
                </div>
                <button type="submit" class="btn btn-outline-primary w-100">Отправить</button>
              </form> -->
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios';
// import VSelectize from '@isneezy/vue-selectize'

export default {
  mixins: [validationMixin],
  name: 'Backoffice',
  data() {
    return {
      title: 'Backoffice',
      forms: [],
      // forms: [
      //   {
      //     id: '5dc9f2e2-f5eb-4fda-85a7-7dde8f3bd8a7',
      //     type_name: 'Тестовый ввод',
      //     document_fields: [ [Object], [Object] ]
      //   },
      //   {
      //     id: '5f044367-4b5a-421a-b5a1-d14b624b81e8',
      //     type_name: 'Тестовая форма',
      //     document_fields: [ [Object], [Object] ]
      //   }
      // ],
      selectedForm: [],
      form: {
        fullName: '',
        groupName: '',
        formsOfTrain: [
          {
            id: 'fullTime',
            label: 'Очная форма обучения'
          },
          {
            id: 'correspondenceCourse',
            label: 'Заочная форма обучения'
          }
        ],
        formSelected: [],
        wayToGetOption: 'option1',
        isActive: true,
        email: ''
      }
    }
  },
  created() {
    this.getForms();
  },
  computed: {},
  watch: {
    'form.wayToGetOption'(newOption) {
      this.form.isActive = newOption === 'option1' ? true : false
    }
  },
  validations: {
    form: {
      fullName: { required },
      formSelected: { required },
      groupName: { required },
      email: { required, email }
    }
  },
  methods: {
    getForms() {
      axios.post('/getForms')
      .then((response) => {
        this.forms = response.data;
        console.log(response.data);
      });
      console.log(`this.forms after json metds: ${this.forms}`)
    },
    checkForm() {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        console.log('Валидация не прошла!')
      }
    },
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.125) !important;
  }
</style>