<template>
  <div class="root">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
          <div class="row">
            <div class="col-4">
              <div class="formList">
                <div 
                  class="forms"
                  v-for="(form, index) in forms"
                  :key="index"
                >
                  <div class="list-group list-group-flush">
                    <button 
                      type="button" 
                      class="list-group-item list-group-item-border list-group-item-action" 
                      aria-current="true"
                      @click="selectForm(index)" 
                      :class="checkSelectedForm(index) ? 'list-group-item-border-blue' : ''"
                    >
                    <!-- :class="isFormSelected ? 'list-group-item-border-blue' : ''" -->
                    <!-- :class="checkSelectedForm(form, index) != index ? 'list-group-item-border-blue' : ''" -->
                      {{ form.type_name }} 
                    </button>
                    <!-- {{ form.document_fields }} -->
                  </div>
                </div>
              </div>
              <button 
                type="button" 
                class="btn btn-primary mt-3" 
                aria-current="true"
                @click="createForm" 
              >
                Создать новую форму
              </button>
            </div>
            <div class="col-8">
              <div 
                v-if="!isFormSelected"
                class="alert alert-primary" 
                role="alert"
              >
                Форма не выбрана
              </div>
              <div 
                v-else
                class="form"
              >
                <div class="row justify-content-between h-100">
                  <div class="col-10">
                    <h2 class="title mb-3">{{ selectedForm.type_name }}</h2>
                  </div>
                  <div class="col-md nopadding">
                    <button 
                      type="button" 
                      class="btn btn-edit btn-primary"
                      @click="editThisForm(selectedForm)"
                      data-bs-toggle="tooltip" 
                      data-bs-placement="right" 
                      title="Редактировать форму"
                    >
                      <font-awesome-icon :icon="['far', 'edit']" class="icon alt"/>
                    </button>
                  </div>
                  <div class="col-md nopadding">
                    <button 
                      type="button" 
                      class="btn btn-edit btn-danger"
                      @click="deleteThisForm(selectedForm)"
                      data-bs-toggle="tooltip" 
                      data-bs-placement="right" 
                      title="Удалить форму"
                    >
                      <font-awesome-icon :icon="['far', 'trash-alt']" class="icon alt"/>
                    </button>
                  </div>
                </div>
                <form class="doc" @submit.prevent="checkForm">
                  <div class="fields">
                    <div 
                      class="field"
                      v-for="(field, index) in selectedForm.document_fields"
                      :key="index"
                    >
                      <!-- {{ field.fieldType }} -->
                      <div 
                        v-if="field.fieldType === 'input'" 
                        class="form-group"
                      >
                        <label for="fullName">{{ field.label }}</label>
                        <input 
                          type="text" 
                          id='fullName'
                          :placeholder="field.placeholder"
                          class="form-control"
                          :class="$v.form.fullName.$error ? 'is-invalid' : ''"
                          v-model.trim="form.fullName"
                        >
                        <!-- <p v-if="$v.form.fullName.$dirty && !form.fullName.required" class="invalid-feedback">
                          Обязательное поле
                        </p> -->
                      </div>
                      <div 
                        v-if="field.fieldType === 'select'" 
                        class="form-group"
                      >
                        <label for="form_training">{{ field.label }}</label>
                        <div class="form-selector">
                          <v-selectize 
                            :options="field.options" 
                            v-model="form.formSelected" 
                            :placeholder="field.placeholder"
                          />
                        </div>
                        <!-- <p v-if="$v.form.formSelected.$dirty && !form.formSelected.required" class="invalid-feedback">
                          Обязательное поле
                        </p> -->
                      </div>
                    </div>
                  </div>
                </form>
                <button type="submit" class="btn btn-outline-primary w-100 mt-4 mb-2">Отправить</button>
                <button type="button" class="btn btn-outline-warning w-100 mb-4" @click="unselectForm">Назад</button>
                <!-- <button 
                  type="button" 
                  class="btn btn-edit btn-primary"
                  @click="editThisForm(selectedForm)"
                  data-bs-toggle="tooltip" 
                  data-bs-placement="right" 
                  title="Редактировать форму"
                >
                  <font-awesome-icon :icon="['far', 'edit']" class="icon alt"/>
                </button>
                <button 
                  type="button" 
                  class="btn btn-edit btn-danger ml-5"
                  @click="deleteThisForm(selectedForm)"
                  data-bs-toggle="tooltip" 
                  data-bs-placement="right" 
                  title="Удалить форму"
                >
                  <font-awesome-icon :icon="['far', 'trash-alt']" class="icon alt"/>
                </button> -->
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
    <hr>
    <FormEditor 
      v-if="isAnyFormEditing && !isFormCreating"
      :formName="formName"
      :formFields="formFields"
      :saveButtonTitle="'Сохранить форму'"
      :backButtonTitle="'Прекратить редактирование'"
      @closeEditor="stopEditingForm"
      :key="1"
    />
    <FormEditor
      v-if="isFormCreating && !isAnyFormEditing"
      
      :formFields="[]"
      :saveButtonTitle="'Отправить форму'"
      :backButtonTitle="'Назад'"
      @closeEditor="stopCreatingForm"
      :key="2"
    />
  </div>
</template>

<script>
import FormEditor from './FormEditor.vue'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios';
// import VSelectize from '@isneezy/vue-selectize'

export default {
  mixins: [validationMixin],
  name: 'Backoffice',
  components: { FormEditor },
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
      selectedForm: {},
      selectedFormNonParse: {},
      isFormSelected: false,
      isFormCreating: false,
      editingForm: {},
      isAnyFormEditing: false,
      formName: '',
      formFields: [],
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
    forceUpdate(){
        this.$forceUpdate()
    },
    getForms() {
      axios.post('/getForms')
      .then((response) => {
        this.forms = JSON.parse(JSON.stringify(response.data));
        console.log(response.data);
      });
    },
    createForm() {
      this.stopEditingForm();
      this.isFormCreating = true;
    },
    selectForm(index) {
      this.selectedFormNonParse = this.forms[index]; //для метода checkSelectedForm

      let parsedObj = JSON.parse(JSON.stringify(this.forms[index]))
      this.selectedForm = parsedObj;
      this.isFormSelected = true;
    },
    unselectForm() {
      this.selectedFormNonParse = {};
      this.selectedForm = {};
      this.isFormSelected = false;
    },
    checkSelectedForm(index) {
      return this.forms.indexOf(this.selectedFormNonParse) == index ? true : false
    },
    editThisForm(selectedForm) {
      this.stopCreatingForm()
      this.isAnyFormEditing = true;
      console.log(`Редактируется форма:`)
      this.editingForm = selectedForm;
      console.log(this.editingForm)
      // console.log(this.editingForm.form_type)
      this.formName = this.editingForm.type_name;
      this.formFields = this.editingForm.document_fields;
    },
    stopEditingForm() {
      this.isAnyFormEditing = false;
      this.editingForm = {};
      this.formFields = [];
    },
    stopCreatingForm() {
      this.isFormCreating = false;
    },
    deleteThisForm(selectedForm) {
      console.log(selectedForm)
      const form = {
        id: this.selectedForm.id,
        formName: this.selectedForm.type_name,
        formFields: this.selectedForm.document_fields
      }
      console.log(form);
      axios.post('/deleteForm', form)
      this.forceUpdate()
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
  .list-group-item-border {
    border-bottom: 1px solid #dfdfdf !important;
  }
  .list-group-item-border-blue {
    /* border-bottom: 1px solid #a9ccff !important;
    border-left: 1px solid #a9ccff !important; */
    background-color: #f0f5ff;
  }
  .nopadding {
   padding: 0 !important;
   margin: 0 !important;
  }
</style>