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
                  :key="form.id"
                >
                  <div class="list-group list-group-flush">
                    <button 
                      type="button" 
                      class="list-group-item list-group-item-border list-group-item-action" 
                      aria-current="true"
                      @click="selectForm(index)" 
                      :class="checkSelectedForm(index) ? 'list-group-item-border-blue' : ''"
                    >
                      {{ form.type_name }}
                    </button>
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
                v-if="!isFormSelected && !isAnyFormEditing && !isFormCreating"
                class="alert alert-primary" 
                role="alert"
              >
                Форма не выбрана
              </div>
              <div 
                v-else-if="isFormSelected && !isAnyFormEditing && !isFormCreating"
                class="form"
              >
                <div class="row justify-content-between h-100">
                  <div class="col-10">
                    <h2 class="title mb-3">{{ selectedForm.type_name | formNameLength(selectedForm.type_name) }}</h2>
                  </div>
                  <div class="col-md nopadding">
                    <button 
                      type="button" 
                      class="btn btn-edit btn-primary"
                      @click="editThisForm(selectedForm.id)"
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
                      @click="openModal"
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
                      <!-- INPUT -->
                      <div 
                        v-if="field.fieldType === 'input'" 
                        class="form-group"
                      >
                        <label :for="field.fieldType + index.toString()">{{ field.label }}</label>
                        <input 
                          :type="field.dataType" 
                          :id="field.fieldType + index.toString()"
                          :placeholder="field.placeholder"
                          class="form-control"
                          v-model.trim="field.value"
                        >
                        <!-- <p v-if="$v.form.fullName.$dirty && !form.fullName.required" class="invalid-feedback">
                          Обязательное поле
                        </p> :class="$v.form.input1.$error ? 'is-invalid' : ''"  v-model.trim="form.inputs[index]" -->
                      </div>
                      <!-- TEXTAREA -->
                      <div 
                        v-if="field.fieldType === 'textarea'" 
                        class="form-group"
                      >
                        <label :for="field.fieldType + index.toString()">{{ field.label }}</label>
                        <textarea 
                          :id="field.fieldType + index.toString()"
                          :placeholder="field.placeholder"
                          class="form-control textareaExample" 
                          rows="5"
                          v-model.trim="field.value"
                        >
                        </textarea>
                        <!-- <p v-if="$v.form.fullName.$dirty && !form.fullName.required" class="invalid-feedback">
                          Обязательное поле
                        </p> :class="$v.form.input1.$error ? 'is-invalid' : ''" -->
                      </div>
                      <!-- SELECT -->
                      <div 
                        v-if="field.fieldType === 'select'" 
                        class="form-group"
                      >
                        <label :for="field.fieldType + index.toString()">{{ field.label }}</label>
                        <div class="form-selector">
                          <v-selectize 
                            :placeholder="field.placeholder"
                            :options="field.options" 
                            :create-item="maybeCreate(field)"
                            :multiple="field.isMultiple"
                            v-model="field.value[0]" 
                          />
                        </div>
                        <!-- <p v-if="$v.form.formSelected.$dirty && !form.formSelected.required" class="invalid-feedback">
                          Обязательное поле
                        </p> -->
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn-outline-primary w-100 mt-4 mb-2"
                    :class="isAnyFormEditing ? 'disabled' : ''"
                  >
                    Отправить
                  </button>
                </form>
                
                <button 
                  type="button" 
                  class="btn btn-outline-secondary w-100 mb-4" 
                  @click="unselectForm"
                >
                  Назад
                </button>
              </div>
              <div 
                v-else
                class="form-editor"
              >
                <!-- добавить форму -->
                <FormEditor
                  v-if="isFormCreating && !isAnyFormEditing"
                  :title="'Создание формы'"
                  :formName="formName"
                  :saveButtonTitle="'Добавить форму'"
                  :backButtonTitle="'Назад'"
                  v-model="formName"
                  @update="getForms"
                  @closeEditor="stopCreatingForm"
                  :key="1"
                />
                <!-- редактировать форму -->
                <FormEditor 
                  v-if="isAnyFormEditing && !isFormCreating"
                  :title="'Редактирование формы'"
                  :id="editingForm.id"
                  :formName="editingForm.type_name"
                  :formFields="editingForm.document_fields"
                  :saveButtonTitle="'Сохранить изменения'"
                  :backButtonTitle="'Прекратить редактирование'"
                  v-model="editingForm.type_name"
                  @update="getForms"
                  @closeEditor="stopEditingForm"
                  :key="2"
                />
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
        <Modal 
          v-if="isModalOpen"
          :title="'Подтвердите действие'"
          @close="isModalOpen = false"
          @deleteForm="deleteThisForm"
        />
    </div>
  </div>
</template>

<script>
import FormEditor from './FormEditor.vue'
import Modal from './Modal.vue'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import VSelectize from '@isneezy/vue-selectize'
import axios from 'axios';
var _cloneDeep = require('lodash/cloneDeep');

export default {
  mixins: [validationMixin],
  name: 'Backoffice',
  components: { FormEditor, Modal, VSelectize },
  data() {
    return {
      title: 'Backoffice',
      forms: [],
      formName: '',
      formFields: [],
      selectedForm: {},
      selectedFormNonParse: {},
      isFormSelected: false,
      isModalOpen: false,
      isFormCreating: false,
      editingForm: {},
      isAnyFormEditing: false,
    }
  },
  mounted() {
    this.getForms();
  },
  filters: {
    formNameLength(name) {
      if (name.split('').length < 35) {
        return name
      } else {
        name = name.split('').slice(0, 35).concat(['...']).join('')
        return name
      }
    }
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
    forceUpdate() {
      this.$forceUpdate()
    },
    getForms() {
      axios.post('/getForms')
      .then((response) => {
        this.forms = JSON.parse(JSON.stringify(response.data));
        this.forceUpdate();
        this.stopEditingForm();
        this.stopCreatingForm();
      });
    },
    createForm() {
      this.stopEditingForm();
      this.unselectForm();
      this.isFormCreating = true;
    },
    selectForm(index) {
      this.stopCreatingForm();
      this.stopEditingForm();
      this.selectedFormNonParse = this.forms[index]; //для метода checkSelectedForm
      this.selectedForm = JSON.parse(JSON.stringify(this.forms[index]))
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
    editThisForm() {
      this.stopCreatingForm()
      this.editingForm = _cloneDeep(this.selectedForm)
      this.unselectForm();
      this.isAnyFormEditing = true;
    },
    stopCreatingForm() {
      this.isFormCreating = false;
      this.formName = ''
      this.formFields = []
    },
    stopEditingForm() {
      this.isAnyFormEditing = false;
    },
    maybeCreate(field) {
      if (field.isAddable) return this.createContact
      return false
    },
    createOption (label) {
      const option = {label}
      return option
    },
    openModal() {
      this.isModalOpen = true;
    },
    deleteThisForm() {
      console.log(`Removed: ${this.selectedForm.type_name}`)
      const form = {
        id: this.selectedForm.id,
      }
      axios.post('/deleteForm', form)
      this.getForms();
      this.unselectForm();
    },
    checkForm() {
      // валидация
      //
      // this.$v.form.$touch()
      // if (this.$v.form.$error) {
      //   console.log('Валидация не прошла!')
      //   return
      // }

      let fields = this.selectedForm.document_fields;

      for (let field of fields) {
        if (field.fieldType === 'select') {
          let flatted = field.value.flat();
          let selected = [];
          for (let option of flatted) {
            if (typeof option === 'object') selected.push(option.label)
            if (typeof option === 'string') selected.push(option)
          }
          console.log(`${field.label} ${selected}`)
        } else {
          console.log(`${field.label} ${field.value}`)
        }
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