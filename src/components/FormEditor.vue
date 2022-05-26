<template>
  <div class="form-editor">
    <div class="row">
      <div class="col-md mx-auto">
        <h2 class="title">{{ title }}</h2>
        <div>
          <input 
            class="form-control form-control-lg" 
            type="text" 
            placeholder="Введите название формы" 
            aria-label=".form-control-lg example"
            :value="formName"
            @input="$emit('input', $event.target.value)" 
            :class="v$.formName.$error ? 'is-invalid' : ''"
          >
          <p v-if="v$.formName.$dirty && v$.formName.required.$invalid" class="invalid-feedback">
            Заполните название формы
          </p>
          <div class="form-fields mt-3 shadow-sm p-3 bg-body rounded">
            <div class="row">
              <div class="col-sm-12 col-lg-8">
                <div 
                  class="field-items"
                  v-if="renderFieldItems"
                  @dragenter.prevent
                  @dragover.prevent
                >
                  <div 
                    class="field-item shadow-sm p-3 mb-2 bg-body rounded"
                    v-for="(field, index) in formFields"
                    :key="index"
                    :class="checkDropOver(index) ? 'borderForDragOver' : ''"
                    draggable="true"
                    @dragstart="startDragOnFormFields($event, index)"
                    @dragover="dragOver(index)"
                    @dragend="dragOverId = -1"
                    @drop="onDropFormFields($event, index, formFields)"
                  >
                    <div class="row justify-content-between align-items-center h-100">
                      <div class="col-auto nopadding reorder">
                        <button 
                          type="button" 
                          class="btn btn-grab"
                          data-bs-toggle="tooltip" 
                          data-bs-placement="right" 
                          title="Нажать и держать для перетаскивания"
                        >
                          <font-awesome-icon :icon="['fas', 'grip-lines']" class="icon alt"/>
                        </button>
                      </div>
                      <div class="col">
                        <div>
                          <div class="form-group">
                            <label v-if="field.fieldType != 'checkbox'" for="input1">{{ field.label }}</label>
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
                              class="field-textarea" 
                              v-if="field.fieldType === 'textarea'"
                            >
                              <!-- <label for="exampleFormControlTextarea1">Example textarea</label> -->
                              <textarea 
                                class="form-control textareaExample" 
                                id="Textarea1" 
                                size="sm"
                                :placeholder="field.placeholder"
                                disabled
                              >
                              </textarea>
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
                            <div 
                              class="field-checkbox custom-control custom-checkbox mt-3" 
                              v-if="field.fieldType === 'checkbox'"
                            >
                              <input 
                                type="checkbox" 
                                class="custom-control-input" 
                                id="checkboxl"
                                disabled
                              >
                              <label class="custom-control-label" for="checkboxl">{{ field.label }}</label>
                            </div>
                            <div 
                              class="field-date" 
                              v-if="field.fieldType === 'date'"
                            >
                              <b-form-datepicker 
                                class="mb-2"
                                :placeholder="field.placeholder"
                                :disabled="true"
                              ></b-form-datepicker>
                            </div>
                            <div 
                              class="field-file" 
                              v-if="field.fieldType === 'file'"
                            >
                              <input 
                                :type="field.fieldType"  
                                class="form-control-file" 
                                id="file1"
                                disabled
                              >
                            </div>
                          </div>
                          <div v-if="field.fieldType != 'checkbox'" class="form-check">
                            <input 
                              type="checkbox" 
                              class="form-check-input" 
                              id="isRequire"
                              :checked="field.isRequire"
                              disabled
                            >
                            <label 
                              class="form-check-label" 
                              for="isRequire"
                            >
                              {{ field.isRequire ? 'Обязательное' : 'Необязательное' }}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-auto nopadding">
                        <button 
                          type="button" 
                          class="btn btn-outline-primary"
                          @click="editThisField(index)"
                          data-bs-toggle="tooltip" 
                          data-bs-placement="right" 
                          title="Редактировать поле"
                        >
                          <font-awesome-icon :icon="['far', 'edit']" class="icon alt" />
                        </button>
                      </div>
                      <div class="col-auto">
                        <button 
                          type="button" 
                          class="btn btn-outline-danger"
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
                <hr v-if="isFieldTypeSelected">
                <!-- поля -->
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
                      :class="v$.input.label.$error ? 'is-invalid' : ''"
                      v-model.trim="input.label" 
                    >
                    <p v-if="v$.input.label.$dirty && v$.input.label.required.$invalid" class="invalid-feedback">
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
                      :class="v$.input.placeholder.$error ? 'is-invalid' : ''"
                      v-model.trim="input.placeholder"
                    >
                    <p v-if="v$.input.placeholder.$dirty && v$.input.placeholder.required.$invalid" class="invalid-feedback">
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
                <!-- TEXTAREA -->
                <div
                  v-if="fieldType.id === 'textarea'"
                  class="mt-3 mb-3"
                >
                  <div class="form-group">
                    <label for="textareaLabel">Наименование поля:</label>
                    <input 
                      type="text" 
                      id='textareaLabel'
                      placeholder="label"
                      class="form-control"
                      :class="v$.textarea.label.$error ? 'is-invalid' : ''"
                      v-model.trim="textarea.label" 
                    >
                    <p v-if="v$.textarea.label.$dirty && v$.textarea.label.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                  <div class="form-group">
                    <label for="textareaPlaceholder">Плейсхолдер:</label>
                    <input 
                      type="text" 
                      id='textareaPlaceholder'
                      placeholder="placeholder"
                      class="form-control"
                      :class="v$.textarea.placeholder.$error ? 'is-invalid' : ''"
                      v-model.trim="textarea.placeholder"
                    >
                    <p v-if="v$.textarea.placeholder.$dirty && v$.textarea.placeholder.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="textareaIsRequire"
                      v-model="textarea.isRequire"
                      :class="textarea.isRequire === true ? 'checked' : ''"
                    >
                    <label 
                      class="form-check-label" 
                      for="textareaIsRequire"
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
                      :class="v$.select.label.$error ? 'is-invalid' : ''"
                      v-model.trim="select.label" 
                    >
                    <p v-if="v$.select.label.$dirty && v$.select.label.required.$invalid" class="invalid-feedback">
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
                      :class="v$.select.placeholder.$error ? 'is-invalid' : ''"
                      v-model.trim="select.placeholder"
                    >
                    <p v-if="v$.select.placeholder.$dirty && v$.select.placeholder.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                  <p>Варианты выбора:</p>
                  <div 
                    class="option-items"
                    v-if="renderOptionItems"
                    @dragenter.prevent
                    @dragover.prevent
                  >
                    <div
                      class="option-item"
                      v-for="(option, index) in select.options"
                      :key="index"
                      draggable="true"
                      @dragstart="startDragOnSelectOptions($event, option)"
                      @dragover="dragOver(index)"
                      @dragend="dragOverId = -1"
                      @drop="onDrop($event, index, select.options)"
                    >
                      <div class="container">
                        <div 
                          class="row align-items-center h-100 shadow-sm p-2 ml-3 mr-3 mb-1 bg-body rounded"
                          :class="checkDropOver(index) ? 'borderForDragOver' : ''"
                        >
                          <div class="col-1 nopadding reorder">
                            <button 
                              type="button" 
                              class="btn btn-grab"
                              data-bs-toggle="tooltip" 
                              data-bs-placement="right" 
                              title="Нажать и держать для перетаскивания"
                            >
                              <font-awesome-icon :icon="['fas', 'grip-lines']" class="icon alt"/>
                            </button>
                          </div>
                          <div class="col nopadding">
                              {{ option.label }}
                          </div>
                          <div class="col-1 nopadding">
                            <button 
                              type="button" 
                              class="btn btn-outline-danger"
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
                  </div>
                  <div class="form-group mt-3">
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button" 
                          id="button-addon1"
                          tabindex="-1"
                          @click="addNewOption"
                        >
                          Добавить
                        </button>
                      </div>
                      <input 
                        type="text" 
                        class="form-control" 
                        :class="v$.select.options.$error ? 'is-invalid' : ''"
                        placeholder="Введите новый вариант (Enter чтобы добавить)" 
                        v-model.trim="customSettings.selectNewOption"
                        @keydown.enter="addNewOption"
                      >
                      <p v-if="v$.select.options.$dirty && v$.select.options.required.$invalid" class="invalid-feedback">
                        Добавьте хотя бы один вариант
                      </p>
                    </div>
                  </div>
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="selectIsMultiple"
                      v-model="select.isMultiple"
                      :class="select.isMultiple === true ? 'checked' : ''"
                    >
                    <label 
                      class="form-check-label" 
                      for="selectIsMultiple"
                    >
                      Возможность выбрать несколько вариантов
                    </label>
                  </div>
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="selectIsAddable"
                      v-model="select.isAddable"
                      :class="select.isAddable === true ? 'checked' : ''"
                    >
                    <label 
                      class="form-check-label" 
                      for="selectIsAddable"
                    >
                      Возможность пользователю добавлять свои варианты
                    </label>
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
                <!-- CHECKBOX -->
                <div
                  v-if="fieldType.id === 'checkbox'"
                  class="mt-3 mb-3"
                >
                  <div class="form-group">
                    <label for="checkboxLabel">Наименование поля:</label>
                    <input 
                      type="text" 
                      id='checkboxLabel'
                      placeholder="label"
                      class="form-control"
                      :class="v$.checkbox.label.$error ? 'is-invalid' : ''"
                      v-model.trim="checkbox.label" 
                    >
                    <p v-if="v$.checkbox.label.$dirty && v$.checkbox.label.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                </div>
                <!-- DATE -->
                <div
                  v-if="fieldType.id === 'date'"
                  class="mt-3 mb-3"
                >
                  <div class="form-group">
                    <label for="dateLabel">Наименование поля:</label>
                    <input 
                      type="text" 
                      id='dateLabel'
                      placeholder="label"
                      class="form-control"
                      :class="v$.date.label.$error ? 'is-invalid' : ''"
                      v-model.trim="date.label" 
                    >
                    <p v-if="v$.date.label.$dirty && v$.date.label.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                  <div class="form-group">
                    <label for="datePlaceholder">Плейсхолдер:</label>
                    <input 
                      type="text" 
                      id='textareaPlaceholder'
                      placeholder="placeholder"
                      class="form-control"
                      :class="v$.date.placeholder.$error ? 'is-invalid' : ''"
                      v-model.trim="date.placeholder"
                    >
                    <p v-if="v$.date.placeholder.$dirty && v$.date.placeholder.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="dateIsRequire"
                      v-model="date.isRequire"
                      :class="date.isRequire === true ? 'checked' : ''"
                    >
                    <label 
                      class="form-check-label" 
                      for="dateIsRequire"
                    >
                      Обязательное
                    </label>
                  </div>
                </div>
                <!-- FILE -->
                <div
                  v-if="fieldType.id === 'file'"
                  class="mt-3 mb-3"
                >
                  <div class="form-group">
                    <label for="fileLabel">Наименование поля:</label>
                    <input 
                      type="text" 
                      id='fileLabel'
                      placeholder="label"
                      class="form-control"
                      :class="v$.file.label.$error ? 'is-invalid' : ''"
                      v-model.trim="file.label" 
                    >
                    <p v-if="v$.file.label.$dirty && v$.file.label.required.$invalid" class="invalid-feedback">
                      Обязательное поле
                    </p>
                  </div>
                </div>
                <!-- FOOTER -->
                <div v-if="isFieldTypeSelected">
                  <hr>
                  <button 
                    type="button" 
                    class="btn btn-outline-success w-100 mb-3"
                    @click="addNewField(indexOfEditingField)"
                  >
                    Сохранить
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-primary w-100"
                    @click="stopEditing(fieldType.id)"
                  >
                    Назад
                  </button>
                </div>
              </div>
              <div class="col-sm-12 col-lg-4">
                <div class="form-selector"
                  v-if="showStaffSelect"
                >
                  <!-- <p class="lead">Ответственные за форму сотрудники:</p> -->
                  <div class="row pr-3">
                    <div class="col">
                      <v-selectize
                        :options="staff"
                        :multiple="true"
                        v-model="selectedStaff"
                        placeholder="Выберите сотрудника"
                      />
                    </div>
                    <div class="col-">
                      <button 
                        v-if="selectedStaff.length > 0"
                        type="button" 
                        class="btn btn-outline-primary"
                        @click="isEditSelectedStaff = true"
                      >
                        <!-- Изменить -->
                        <font-awesome-icon :icon="['fas', 'users-cog']" class="icon alt" />
                      </button>
                    </div>
                  </div>
                </div>
                <div 
                  class="staff-items"
                  v-if="selectedStaff.length > 0 && isEditSelectedStaff"
                >
                  <div
                    class="staff-item"
                    v-for="(staff, index) in selectedStaff"
                    :key="index"
                  >
                    <div 
                      class="row align-items-center shadow-sm p-2 mx-auto mb-1 bg-body rounded"
                    >
                      <div class="col nopadding">
                          {{ staff.label }}
                      </div>
                      <div class="col- nopadding">
                        <button 
                          type="button" 
                          class="btn btn-outline-danger"
                          @click="deleteThisStaff(index)"
                          data-bs-toggle="tooltip" 
                          data-bs-placement="right" 
                          title="Удалить"
                        >
                          <font-awesome-icon :icon="['fas', 'user-minus']" class="icon alt" size="xs" transform="right-1 up-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button 
              type="button" 
              class="btn btn-outline-primary w-100 mt-4"
              v-if="newFormIsFull"
              @click="addNewForm"
            >
              {{ saveButtonTitle }}
            </button>
            <button 
              type="button" 
              class="btn btn-outline-secondary w-100 mt-2 mb-4"
              @click="closeEditor"
            >
              {{ backButtonTitle }}
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import axios from 'axios';
import { uuid } from 'vue-uuid'; 
var _cloneDeep = require('lodash/cloneDeep');
var _fromPairs = require('lodash/fromPairs');
export default {
  setup () {
    return { v$: useVuelidate() }
  },
  name: 'FormEditor',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    title: {
      type: String,
      default: 'Редактор форм'
    },
    id: {
      type: String,
      default: ''
    },
    formName: {
      type: String,
      default: ''
    },
    formFields: {
      type: Array,
      default: function () {
        return []
      }
    },
    formStaff: {
      type: Array,
      default: function () {
        return []
      }
    },
    saveButtonTitle: {
      type: String,
      default: 'Сохранить изменения'
    },
    backButtonTitle: {
      type: String,
      default: 'Назад'
    }
  },
  data() {
    return {
      fieldTypes: [
        {
          id: 'input',
          label: 'Однострочный ввод'
        },
        {
          id: 'textarea',
          label: 'Многострочный ввод'
        },
        {
          id: 'select',
          label: 'Выпадающий список'
        },
        {
          id: 'checkbox',
          label: 'Чекбокс'
        },
        {
          id: 'date',
          label: 'Дата'
        },
        {
          id: 'file',
          label: 'Загрузка файла'
        }
      ],
      fieldType: [],
      isFieldTypeSelected: false,
      isAnyFieldEditing: false,
      indexOfEditingField: -1,
      renderOptionItems: true,
      renderFieldItems: true,
      dragOverId: -1,
      showStaffSelect: false,
      staff: [],
      selectedStaff: [],
      isEditSelectedStaff: false,
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
      input: {
        id: '',
        fieldType: 'input',
        label: null,
        placeholder: null,
        isRequire: false,
        dataType: {
          id: 'text',
          label: 'Текст'
        },
        value: ''
      },
      textarea: {
        id: '',
        fieldType: 'textarea',
        label: '',
        placeholder: '',
        isRequire: false,
        value: ''
      },
      select: {
        id: '',
        fieldType: 'select',
        label: '',
        placeholder: '',
        isMultiple: false,
        isAddable: false,
        isRequire: false,
        options: [],
        value: []
      },
      checkbox: {
        id: '',
        fieldType: 'checkbox',
        label: '',
        value: false
      },
      date: {
        id: '',
        fieldType: 'date',
        label: '',
        placeholder: '',
        isRequire: false,
        value: ''
      },
      file : {
        id: '',
        fieldType: 'file',
        label: '',
        value: ''
      },
      uuid: uuid.v1(),
    }
  },
  created() {
    this.getStaff()
  },
  validations() {
    return {
      formName: { required },
      input: {
        label: { required },
        placeholder: { required },
        dataType: { required }
      },
      textarea: {
        label: { required },
        placeholder: { required }
      },
      select: {
        label: { required },
        placeholder: { required },
        options: { required }
      },
      checkbox: {
        label: { required }
      },
      date: {
        label: { required },
        placeholder: { required }
      },
      file: {
        label: { required }
      }
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
        // this.resetValidation(this.fieldType.id);
        this.isFieldTypeSelected = true
      }
    },
    "selectedStaff"() {
      if (this.selectedStaff.length === 0) {
        this.isEditSelectedStaff = false;
      }
    }
  },
  methods: {
    addNewField(indexOfEditingField) {
      let newObj = {};
      let fieldType = this.fieldType.id;
      this.checkNewField(fieldType);
      if (!this.v$[fieldType].$error) {
        newObj = _cloneDeep(this[fieldType]);
        newObj.id = this.$uuid.v4();
        this.resetField(fieldType);
      }
      else return
      if (!this.isAnyFieldEditing) {
        this.formFields.push(newObj);
        console.log('Field was added.');
      } else {
        this.formFields[indexOfEditingField] = newObj;
        this.isAnyFieldEditing = false;
        console.log('Field was edited.');
      }
      this.fieldType = [];
      this.isFieldTypeSelected = false;
    },
    editThisField(index) {
      this.isAnyFieldEditing = true;
      this.indexOfEditingField = index;
      this.fieldType.id = this.formFields[index].fieldType; // определяем id
      for (let fieldType of this.fieldTypes) {
        let values = Object.values(fieldType);
        let i = values.indexOf(this.formFields[index].fieldType)
        if (i == 0) {
          this.fieldType.label = values[1] // определяем label
          break
        }
      }
      this.fieldType = _fromPairs([['id', this.fieldType.id], ['label', this.fieldType.label]]) //из массива в объект
      this[this.fieldType.id].label = this.formFields[index].label
      this[this.fieldType.id].placeholder = this.formFields[index].placeholder
      this[this.fieldType.id].isRequire = this.formFields[index].isRequire
      if (this.fieldType.id === 'input') {
        this[this.fieldType.id].dataType = this.formFields[index].dataType
      }
      if (this.fieldType.id === 'select') {
        this[this.fieldType.id].options = this.formFields[index].options
        this[this.fieldType.id].isMultiple = this.formFields[index].isMultiple
        this[this.fieldType.id].isAddable = this.formFields[index].isAddable
      }
    },
    deleteThisField(index) {
      this.formFields.splice(index, 1);
    },
    async getStaff() {
      const res = await axios.post('/getStaff');
      res.data.map((el) => {
        let person = {
          id: el.id,
          label: `${el.person_lastname} ${el.person_name} ${el.person_fathername}`
        }
        this.staff.push(person)
      });
      if (this.formStaff) {
        for (let i = 0; i < this.formStaff.length; i++) {
          let id = this.formStaff[i];
          let label = this.staff.find(s => s.id == id).label
          let formatStaff = {
            id,
            label
          }
          this.selectedStaff.push(formatStaff)
        }
      }
      this.showStaffSelect = true;
    },
    deleteThisStaff(index) {
      this.selectedStaff.splice(index, 1);
    },
    checkNewField(fieldType) {
      this.v$[fieldType].$touch();
      if (this.v$[fieldType].$error) {
        console.log(`Error: Invalid! ${fieldType}`)
      }
    },
    resetField(fieldType) {
      if (fieldType === 'checkbox' || fieldType === 'file') {
        this[fieldType].label = '';
        return
      }
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
        this.select.isMultiple = false;
        this.select.isAddable = false;
        this.select.options = [];
      }
      this.resetValidation(fieldType);
    },
    resetValidation(fieldType) {
      this.v$[fieldType].$reset();
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
    startDragOnSelectOptions(event, item) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('itemID', item.id)
    },
    startDragOnFormFields(event, id) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('itemID', id)
    },
    dragOver(index) {
      this.dragOverId = index;
    },
    checkDropOver(index) {
      return (this.dragOverId === index) ? true : false
    },
    onDrop(event, index, options) {
      const itemID = event.dataTransfer.getData('itemID')
      //меняем индексы элементов
      var tempID = options[index].id
      options[index].id = options[itemID].id
      options[itemID].id = tempID
      // меняем элементы местами
      var temp = options[index];
      options[index] = options[itemID];
      options[itemID] = temp;
      // перерендериваем список
      this.forceRerenderOptionItems()
      this.dragOverId = -1;
    },
    onDropFormFields(event, index, options) {
      const itemID = event.dataTransfer.getData('itemID')
      // меняем элементы местами
      var temp = options[index];
      options[index] = options[itemID];
      options[itemID] = temp;
      // перерендериваем список
      this.forceRerenderFieldItems()
      this.dragOverId = -1;
    },
    forceRerenderOptionItems() {
      this.renderOptionItems = false;
      this.$nextTick(() => {
        this.renderOptionItems = true;
      })
    },
    forceRerenderFieldItems() {
      this.renderFieldItems = false;
      this.$nextTick(() => {
        this.renderFieldItems = true;
      })
    },
    deleteThisOption(index) {
      this.select.options.splice(index, 1);
    },
    addNewForm() {
      this.checkNewForm();
      if (this.v$.formName.$error) return
      let staffId = []
      this.selectedStaff.map(el => {
        staffId.push(el.id)
      })
      const form = {
        id: this.id,
        formName: this.formName,
        formFields: this.formFields,
        staffId: staffId
      }
      if (this.id === '') {
        axios.post('/saveForm', form);
      } else {
        axios.post('/updateForm', form);
      }
      this.update()
    },
    checkNewForm() {
      this.v$.formName.$touch()
      if (this.v$.formName.$error) {
        console.log('Error: Invalid! Имя формы пустое!')
      }
    },
    closeEditor() {
      this.$emit('closeEditor')
    },
    update() {
      this.$emit('update');
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
  .textareaExample {
    resize: none;
  }
  .btn-grab {
    color: #c4c4c4 !important;
    cursor: grab !important;
  }
  .btn-grab:focus,
  .btn-grab:active{
    box-shadow: none !important;
    outline: 0px !important;
  }
  .borderForDragOver {
    border: dashed 1px #acacac !important;
  }
</style>