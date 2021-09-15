<template>
  <div class="form-editor">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
        <h2 class='title'>{{ title }}</h2>
        <div class="row">
          <div class="col-md-8">
            <!-- <div class="shadow p-3 mb-5 bg-body rounded"> -->
            <form class="doc" @submit.prevent="addNewForm">
              <div>
                <input 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Введите название формы" 
                  aria-label=".form-control-lg example"
                  v-model.trim="formName"
                  :class="$v.formName.$error ? 'is-invalid' : ''"
                >
                <p v-if="$v.formName.$dirty && !formName.required" class="invalid-feedback">
                  Заполните название формы
                </p>
                <div class="form-fields mt-3">
                  <div class="shadow-sm p-3 bg-body rounded">
                    <form class="doc">
                      <!-- <p class="lead" v-if="formFields.length">Текущие поля:</p> -->
                      <div 
                        class="field-item shadow-sm p-3 mb-2 bg-body rounded"
                        v-for="(field, index) in formFields"
                        :key="index"
                      >
                        <div class="row justify-content-between align-items-center h-100">
                          <div class="col-9 col-sm-9 col-lg-10">
                            <div>
                              <div class="form-group">
                                <!-- <label for="input1">{{ field.label }} | Тип: {{ field.dataType.label }}</label> -->
                                <label for="input1">{{ field.label }}</label>
                                <div 
                                  class="field-input" 
                                  v-if="field.fieldType === 'input'"
                                >
                                  <input 
                                    :type="field.dataType" 
                                    id='inputl'
                                    :placeholder="field.placeholder"
                                    class="form-control"
                                    disabled
                                  >
                                </div>
                                <div 
                                  class="field-select form-check-label" 
                                  v-if="field.fieldType === 'select'"
                                >
                                  <v-selectize 
                                    :options="field.options" 
                                    :placeholder="field.placeholder"
                                    :disabled="true"
                                  />
                                </div>
                              </div>
                              <div class="form-check">
                                <input 
                                  type="checkbox" 
                                  class="form-check-input" 
                                  id="isRequire"
                                  :checked="field.isRequire"
                                  disabled
                                >
                                <label class="form-check-label" for="isRequire">{{ field.isRequire ? 'Обязательное' : 'Необязательное' }}</label>
                              </div>
                            </div>
                          </div>
                          <div class="col-1 col-md nopadding">
                            <button 
                              type="button" 
                              class="btn btn-edit btn-primary"
                              @click="editThisField(index)"
                              data-bs-toggle="tooltip" 
                              data-bs-placement="right" 
                              title="Редактировать поле"
                            >
                              <font-awesome-icon :icon="['far', 'edit']" class="icon alt"/>
                            </button>
                          </div>
                          <div class="col-1 col-md nopadding">
                            <button 
                              type="button" 
                              class="btn btn-delete btn-danger"
                              @click="deleteThisField(index)"
                              data-bs-toggle="tooltip" 
                              data-bs-placement="right" 
                              title="Удалить поле"
                            >
                              <font-awesome-icon :icon="['far', 'trash-alt']" class="icon alt"/>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div 
                        class="form-group" 
                          :class="formFields.length != 0  ? 'mt-5' : ''"
                      >
                        <p class="lead" v-if="formFields.length < 1">Добавьте в форму первое поле:</p>
                        <div class="form-selector">
                          <v-selectize
                            :options="fieldTypes" 
                            v-model.trim="fieldType" 
                            :disableSearch="true"
                            placeholder="Выберете тип нового поля"
                          />
                        </div>
                      </div>
                      <hr>
                      <!-- INPUT -->
                      <div
                        v-if="fieldType.id === 'input'"
                        class="mt-3 mb-3"
                      >
                        <div class="form-group">
                          <label for="inputLabel">Наименование поля:</label>
                          <input 
                            type="text" 
                            id='inputLabel'
                            placeholder="label"
                            class="form-control"
                            :class="$v.input.label.$error ? 'is-invalid' : ''"
                            v-model.trim="input.label" 
                          >
                          <p v-if="$v.input.label.$dirty && !$v.input.label.required" class="invalid-feedback">
                            Обязательное поле
                          </p>
                        </div>
                        <div class="form-group">
                          <label for="inputPlaceholder">Плейсхолдер:</label>
                          <input 
                            type="text" 
                            id='inputPlaceholder'
                            placeholder="placeholder"
                            class="form-control"
                            :class="$v.input.placeholder.$error ? 'is-invalid' : ''"
                            v-model.trim="input.placeholder"
                          >
                          <p v-if="$v.input.placeholder.$dirty && !$v.input.placeholder.required" class="invalid-feedback">
                            Обязательное поле
                          </p>
                        </div>
                        <div class="form-group">
                          <label for="form_training">Тип вводимой информации:</label>
                          <div class="form-selector">
                            <v-selectize 
                              :options="customSettings.inputDataTypes" 
                              v-model.trim="input.dataType"
                              placeholder="Выберете тип вводимой информации"
                            />
                          </div>
                        </div>
                        <div class="form-check">
                          <input 
                            type="checkbox" 
                            class="form-check-input" 
                            id="inputIsRequire"
                            v-model="input.isRequire"
                            :class="input.isRequire === true ? 'checked' : ''"
                          >
                          <label 
                            class="form-check-label" 
                            for="inputIsRequire"
                          >
                            Обязательное
                          </label>
                        </div>
                      </div>
                      <!-- SELECT -->
                      <div
                        v-if="fieldType.id === 'select'"
                        class="mt-3 mb-3"
                      >
                        <div class="form-group">
                          <label for="selectLabel">Наименование поля:</label>
                          <input 
                            type="text" 
                            id='selectLabel'
                            placeholder="label"
                            class="form-control" 
                            :class="$v.select.label.$error ? 'is-invalid' : ''"
                            v-model.trim="select.label" 
                          >
                          <p v-if="$v.select.label.$dirty && !$v.select.label.required" class="invalid-feedback">
                            Обязательное поле
                          </p>
                        </div>
                        <div class="form-group">
                          <label for="selectPlaceholder">Плейсхолдер:</label>
                          <input 
                            type="text" 
                            id='selectPlaceholder'
                            placeholder="placeholder"
                            class="form-control" 
                            :class="$v.select.placeholder.$error ? 'is-invalid' : ''"
                            v-model.trim="select.placeholder"
                          >
                          <p v-if="$v.select.placeholder.$dirty && !$v.select.placeholder.required" class="invalid-feedback">
                            Обязательное поле
                          </p>
                        </div>
                        <p>Варианты выбора:</p>
                        <div
                          class="option-item shadow-sm p-2 ml-3 mr-3 mb-1 bg-body rounded"
                          v-for="(option, index) in select.options"
                          :key="index"
                        >
                          <div class="container">
                            <div class="row align-items-center h-100">
                              <div class="col">
                                  {{ option.label }}
                              </div>
                              <div class="col-1">
                                <button 
                                  type="button" 
                                  class="btn btn-danger"
                                  @click="deleteThisOption(index)"
                                  data-bs-toggle="tooltip" 
                                  data-bs-placement="right" 
                                  title="Удалить"
                                >
                                  <font-awesome-icon :icon="['far', 'trash-alt']" class="icon alt"/>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group mt-3">
                          <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <button 
                                class="btn btn-outline-secondary" 
                                type="button" 
                                id="button-addon1"
                                @click="addNewOption"
                              >
                                Добавить
                              </button>
                            </div>
                            <input 
                              type="text" 
                              class="form-control" 
                              :class="$v.select.options.$error ? 'is-invalid' : ''"
                              placeholder="Введите новый вариант (Enter чтобы добавить)" 
                              v-model.trim="customSettings.selectNewOption"
                              @keydown.enter="addNewOption"
                            >
                            <p v-if="$v.select.options.$dirty && !$v.select.options.required" class="invalid-feedback">
                              Добавьте хотя бы один вариант
                            </p>
                          </div>
                        </div>
                        <div class="form-check">
                          <input 
                            type="checkbox" 
                            class="form-check-input" 
                            id="selectIsRequire"
                            v-model="select.isRequire"
                            :class="select.isRequire === true ? 'checked' : ''"
                          >
                          <label 
                            class="form-check-label" 
                            for="selectIsRequire"
                          >
                            Обязательное
                          </label>
                        </div>
                      </div>
                      <!-- FOOTER -->
                      <div v-if="isFieldTypeSelected">
                        <hr>
                        <button 
                          type="button" 
                          class="btn btn-outline-success w-100 mb-3"
                          @click="addNewField()"
                        >
                          Завершить редактирование и добавить поле
                        </button>
                        <button 
                          type="button" 
                          class="btn btn-outline-primary w-100"
                          @click="stopEditing(fieldType.id)"
                        >
                          Назад
                        </button>
                      </div>
                    </form>
                  </div>
                  <button 
                    type="submit" 
                    class="btn btn-outline-primary w-100 mt-4"
                    v-if="newFormIsFull"
                  >
                    Отправить форму
                  </button>
                </div>
              </div>
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
var _cloneDeep = require('lodash/cloneDeep');

export default {
  mixins: [validationMixin],
  name: 'FormEditor',
  data() {
    return {
      title: 'Редактор форм',
      formName: '',
      fieldTypes: [
        {
          id: 'input',
          label: 'Однострочный ввод'
        },
        {
          id: 'select',
          label: 'Выпадающий список'
        }
      ],
      fieldType: [],
      isFieldTypeSelected: false,
      customSettings: {
        inputDataTypes: [
          {
            id: 'text',
            label: 'Текст'
          },
          {
            id: 'number',
            label: 'Число'
          },
          {
            id: 'email',
            label: 'Email'
          },
        ],
        selectNewOption: '',
      },
// input
      input: {
        fieldType: 'input',
        label: '',
        placeholder: '',
        isRequire: false,
        dataType: {
          id: 'text',
          label: 'Текст'
        }
      },
// select
      select: {
        fieldType: 'select',
        label: '',
        placeholder: '',
        isRequire: false,
        options: [],
      },
//массив полей формы
      formFields: []
    }
  },
  validations: {
    formName: { required },
    input: {
      label: { required },
      placeholder: { required },
      dataType: { required }
    },
    select: {
      label: { required },
      placeholder: { required },
      options: { required }
    }
  },
  computed: {
    newFormIsFull() {
      return (!this.isFieldTypeSelected && this.formFields.length > 0) ? true : false
    }
  },
  watch: {
    "fieldType"() {
      if (this.fieldType === null) {
        this.fieldType = this.fieldTypes[0];
        this.stopEditing(this.fieldType.id);
      }
      if (this.fieldType != '') {
        this.resetValidation(this.fieldType.id);
        this.isFieldTypeSelected = true
      }
    },
  },
  methods: {
    editThisField(index) {
      console.log(index);
    },
    deleteThisField(index) {
      this.formFields.splice(index, 1);
    },
    addNewField() {
      let newObj = {}
      let fieldType = this.fieldType.id;

      this.checkNewField(fieldType);
      if (!this.$v[fieldType].$error) {
        newObj = _cloneDeep(this[fieldType]);
        this.resetField(fieldType);
      }
      else return

      this.formFields.push(newObj)
      this.fieldType = [],
      this.isFieldTypeSelected = false,
      console.log('Field was added.');
    },
    checkNewField(fieldType) {
      this.$v[fieldType].$touch();
      if (this.$v[fieldType].$error) {
        console.log(`Error: Invalid! ${fieldType}`)
      }
    },
    resetField(fieldType) {
      this[fieldType].label = '';
      this[fieldType].placeholder = '';
      this[fieldType].isRequire = false;

      if (fieldType === 'input') {
        this.input.dataType = {
          id: 'text',
          label: 'Текст'
        }
      }
      if (fieldType === 'select') {
        this.customSettings.selectNewOption ='';
        this.select.options = [];
      }
      this.resetValidation(fieldType);
    },
    resetValidation(fieldType) {
      this.$v[fieldType].$reset();
    },
    stopEditing(fieldType) {
      this.resetValidation(fieldType);
      this.fieldType = [];
      this.isFieldTypeSelected = false;
    },
    addNewOption() {
      if (this.customSettings.selectNewOption) {
        let currentOptionIndex = this.select.options.length;
        this.select.options.push({
          id: currentOptionIndex,
          label: this.customSettings.selectNewOption,
        });
        currentOptionIndex++;
        this.customSettings.selectNewOption = '';
      }
    },
    deleteThisOption(index) {
      this.select.options.splice(index, 1);
    },
    addNewForm(){
      this.checkNewForm();
      if (this.$v.formName.$error) return
      // fetch('http://localhost:8080/') 
      
      console.log('Form sent.')
      console.log(JSON.stringify(this.formName));
      console.log(JSON.stringify(this.formFields));
    },
    checkNewForm() {
      this.$v.formName.$touch()

      if (this.$v.formName.$error) {
        console.log('Error: Invalid! Имя формы пустое!')
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
    margin-bottom: 30px;
  }
  .form-group {
    margin-bottom: .7rem;
  }
  .form-check-label {
    /* чтобы после даблклика по label, текст не выделялся */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Chrome/Safari/Opera */
    -khtml-user-select: none;    /* Konqueror */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;           /* Non-prefixed version, currently
                                    not supported by any browser */
  }
  .nopadding {
   padding: 0 !important;
   margin: 0 !important;
  }
</style>