<template>
  <div class="form-editor">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
        <h2 class='title'>{{ title }}</h2>
        <div class="row">
          <div class="col-md-8">
            <!-- <div class="shadow p-3 mb-5 bg-body rounded"> -->
            <form class="doc" @submit.prevent="checkForm">
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
                    <!-- <p class="lead" v-if="formFields.length">Текущие поля:</p> -->
                    <div 
                      class="field-item shadow-sm p-3 mb-2 bg-body rounded"
                      v-for="(field, index) in formFields"
                      :key="index"
                    >
                      <div class="row align-items-center h-100">
                        <div class="col-10">
                          <div class="form-group">
                            <!-- <label for="input1">{{ field.label }} | Тип: {{ field.dataType.label }}</label> -->
                            <label for="input1">{{ field.label }}</label>
                            <div 
                              class="field-input" 
                              v-if="field.formType === 'input'"
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
                              class="field-select" 
                              v-if="field.formType === 'select'"
                            >
                              <!-- <v-selectize 
                                :options="field.formTypes" 
                                :placeholder="field.placeholder"
                              /> -->
                              <b-form-select 
                                :options="[{id: 0, value: field.placeholder.toString(), text: field.placeholder.toString()}].concat(field.options)"
                                v-model="field.placeholder"
                                disabled
                              >
                              </b-form-select>
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
                        <div class="col-1">
                          <button 
                            type="button" 
                            class="btn btn-danger"
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
                          :options="formTypes" 
                          v-model="formType" 
                          placeholder="Выберете тип нового поля"
                        />
                      </div>
                    </div>
                    <hr>
                    <!-- INPUT -->
                    <div
                      v-if="formType.id === 'input'"
                      class="mt-3 mb-3"
                    >
                      <div class="form-group">
                        <label for="inputLabel">Наименование поля:</label>
                        <input 
                          type="text" 
                          id='inputLabel'
                          placeholder="label"
                          class="form-control"
                          v-model.trim="input.label" 
                        >
                      </div>
                      <div class="form-group">
                        <label for="inputPlaceholder">Плейсхолдер:</label>
                        <input 
                          type="text" 
                          id='inputPlaceholder'
                          placeholder="placeholder"
                          class="form-control"
                          v-model.trim="input.placeholder"
                        >
                      </div>
                      <div class="form-group">
                        <label for="form_training">Тип вводимой информации:</label>
                        <div class="form-selector">
                          <v-selectize 
                            :options="input.dataTypes" 
                            v-model="input.dataType" 
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
                      v-if="formType.id === 'select'"
                      class="mt-3 mb-3"
                    >
                      <div class="form-group">
                        <label for="selectLabel">Наименование поля:</label>
                        <input 
                          type="text" 
                          id='selectLabel'
                          placeholder="label"
                          class="form-control" 
                          v-model.trim="select.label" 
                        >
                      </div>
                      <div class="form-group">
                        <label for="selectPlaceholder">Плейсхолдер:</label>
                        <input 
                          type="text" 
                          id='selectPlaceholder'
                          placeholder="placeholder"
                          class="form-control"
                          v-model.trim="select.placeholder"
                        >
                      </div>
                      <p>Варианты выбора:</p>
                      <div
                        class="option-item shadow-sm p-2 ml-3 mb-1 bg-body rounded"
                        v-for="(option, index) in select.options"
                        :key="index"
                      >
                        <div class="row align-items-center h-100">
                          <div class="col-10">
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
                            placeholder="Введите новый вариант (Enter чтобы добавить)" 
                            v-model.trim="select.newOption"
                            @keydown.enter="addNewOption"
                          >
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
                    <div v-if="isFormTypeSelected">
                      <hr>
                      <button 
                        type="button" 
                        class="btn btn-outline-success w-100 mb-3"
                        @click="addNewField"
                      >
                        Завершить редактирование и добавить поле
                      </button>
                      <button 
                        type="button" 
                        class="btn btn-outline-primary w-100"
                        @click="stopEditing"
                      >
                        Назад
                      </button>
                    </div>
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
      formTypes: [
        {
          id: 'input',
          label: 'Однострочный ввод'
        },
        {
          id: 'select',
          label: 'Выпадающий список'
        }
      ],
      formType: [],
      isFormTypeSelected: false,
// input
      input: {
        formType: 'input',
        label: '',
        placeholder: '',
        isRequire: false,
        dataTypes: [
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
        dataType: {
          id: 'text',
          label: 'Текст'
        },
        formIsFull: false
      },
// select
      select: {
        formType: 'select',
        label: '',
        placeholder: '',
        newOption: '',
        options: [],
        selectedOption: [],
        isRequire: false,
        formIsFull: false
      },
//массив полей формы
      formFields: [
        // {
        //   formType: 'input',
        //   label: 'Ваше ФИО:',
        //   placeholder: 'Введите ФИО',
        //   isRequire: true,
        //   dataType: {
        //     id: 'text',
        //     label: 'Текст'
        //   }
        // },
        // {
        //   formType: 'input',
        //   label: 'Email:',
        //   placeholder: 'Введите email',
        //   isRequire: false,
        //   dataType: {
        //     id: 'email',
        //     label: 'Email'
        //   }
        // }
      ]
    }
  },
  validations: {
    formName: { required },
  },
  computed: {
    newFormIsFull() {
      return (!this.isFormTypeSelected && this.formFields.length > 0) ? true : false
    }
  },
  watch: {
    "formType"() {
      if (this.formType != '') {
        this.isFormTypeSelected = true
      }
    },
    "input.label"() {
      this.checkFormFull()
    },
    "input.placeholder"() {
      this.checkFormFull()
    }
  },
  methods: {
    deleteThisField(index) {
      this.formFields.splice(index, 1);
    },
    addNewField() {
      let newObj = {}
      if (this.formType.id === 'input') {
        newObj = _cloneDeep(this.input);
        this.input.label = '';
        this.input.placeholder = '';
      }
      if (this.formType.id === 'select') {
        newObj = _cloneDeep(this.select)
        this.select.label = '';
        this.select.placeholder = '';
        this.select.newOption ='';
        this.select.options = [];
        this.select.selectedOption = [];
        this.select.isRequire = false;
      }
      this.formFields.push(newObj)
      this.formType = [],
      this.isFormTypeSelected = false,
      console.log('Field was added');
    },
    // makeRequire() {
    //   if (this.formType.id === 'input') {
    //     this.input.isRequire = !this.input.isRequire;
    //   }
    //   if (this.formType.id === 'select') {
    //     this.select.isRequire = !this.select.isRequire;
    //   }
    // },
    checkFormFull() {
      return this.input.formIsFull = this.input.label && this.input.placeholder ? true : false
    },
    stopEditing() {
      this.formType = ''
      this.isFormTypeSelected = false
    },
    addNewOption() {
      let currentOptionIndex = this.select.options.length;
      this.select.options.push({
        id: currentOptionIndex,
        label: this.select.newOption,
        text: this.select.newOption
      });
      currentOptionIndex++;
      this.select.newOption = '';
    },
    deleteThisOption(index) {
      this.select.options.splice(index, 1);
    },
    checkForm() {
      this.$v.$touch()
      if (this.$v.$error) {
        console.log('Валидация не прошла!')
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
</style>