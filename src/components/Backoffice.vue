<template>
  <div class="root">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
          <div class="row">
            <div class="col-md-8">
              <form class="doc" @submit.prevent="checkForm">
                <h2 class='title'>{{ title }}</h2>
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
                <!-- <div class="form-group">
                  <label for="form_training">Выберете форму обучения:</label>
                  <select 
                    name="form_training" 
                    id="form_training"
                    class="form-control"
                    :class="$v.form.formSelected.$error ? 'is-invalid' : ''"
                    placeholder="Выберете форму обучения (поиск по трем символам)"
                    v-model="form.formSelected"
                  >
                    <option
                      v-for="(form, index) in form.formOfTrain"
                      :value='form.value'
                      :key='index'
                    >
                      {{ form.label }}
                    </option>
                  </select>
                  <p v-if="$v.form.formSelected.$dirty && !form.formSelected.required" class="invalid-feedback">
                      Обязательное поле
                  </p>
                </div> -->
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
                    <!-- <div>Current Value: {{ form.formSelected }}</div> -->
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
                <!-- <div class="form-group">
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
                </div> -->
                <button type="submit" class="btn btn-outline-primary w-100">Отправить</button>
              </form>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
// import VSelectize from '@isneezy/vue-selectize'

export default {
  mixins: [validationMixin],
  name: 'Backoffice',
  data() {
    return {
      title: 'Заказать справку',
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
        // formsOfTrain: [
        //   'Очная форма обучения',
        //   'Заочная форма обучения'
        // ],
        formSelected: []
      }
    }
  },
  validations: {
    form: {
      fullName: { required },
      formSelected: { required },
      groupName: { required }
    }
  },
  methods: {
    checkForm() {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        console.log('Валидация прошла успешно!')
      }
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
</style>