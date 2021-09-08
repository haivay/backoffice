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
                <div class="form-group">
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
                  <!-- <div class="selectize-control single">
                    <div class="selectize-input items">
                      <input 
                        type="text" 
                        autocomplete="off" 
                        id="form_training-selectized" 
                        placeholder="Выберете форму обучения (поиск по трем символам)"
                      >
                    </div>
                    <div class="selectize-dropdown single">
                      <div class="selectize-dropdown-content">
                        <div class="option" data-selectable data-value='fullTime'>
                          Очная форма обучения
                        </div>
                        <div class="option" data-selectable data-value='correspondenceCourse'>
                          Заочная форма обучения
                        </div>
                      </div>
                    </div>
                  </div> -->
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
                <button type="submit" class="btn btn-primary">Отправить</button>
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

export default {
  mixins: [validationMixin],
  name: 'Backoffice',
  data() {
    return {
      title: 'Заказать справку',
      form: {
        fullName: '',
        groupName: '',
        formSelected: '',
        formOfTrain: [
          {
            label: 'Очная форма обучения',
            value: 'fullTime'
          },
          {
            label: 'Заочная форма обучения',
            value: 'correspondenceCourse'
          }
        ]
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
</style>