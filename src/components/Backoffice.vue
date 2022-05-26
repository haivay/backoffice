<template>
  <div class="root">
      <div class="container-fluid main-content-wrapper">
        <div class="row">
          <div class="col-4">
            <div class="row">
              <div class="col">
                <input 
                  class="form-control mb-2" 
                  type="text" 
                  placeholder="Поиск по формам"
                  v-model="formSearch"
                >
              </div>
              <div class="col-auto nopadding-left">
                <button 
                  type="button" 
                  class="btn btn-outline-primary mb-3" 
                  aria-current="true"
                  data-bs-toggle="tooltip" 
                  data-bs-placement="right" 
                  title="Добавить форму"
                  @click="createForm"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" class="icon alt"/>
                </button>
              </div>
            </div>
            <div class="formList">
              <div 
                class="forms"
                v-for="(form, index) of formsFiltred"
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
                    {{ form.type_name }}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="formSearchError" class="formListEmpty">
              <div class="alert alert-warning" role="alert">
                Форма не найдена...
              </div>
            </div>
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
                <div class="col">
                  <h2 class="title mb-3">{{ selectedForm.type_name | formNameLength(selectedForm.type_name) }}</h2>
                </div>
                <div class="col-auto">
                  <button 
                    type="button" 
                    class="btn btn-clone btn-info"
                    @click="cloneThisForm(selectedForm.id)"
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Клонировать форму"
                  >
                    <font-awesome-icon :icon="['far', 'clone']" class="icon alt"/>
                  </button>
                </div>
                <div class="col-auto nopadding">
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
                <div class="col-auto">
                  <button 
                    type="button" 
                    class="btn btn-edit btn-danger"
                    @click="openModalDelete"
                    data-bs-toggle="tooltip" 
                    data-bs-placement="right" 
                    title="Удалить форму"
                  >
                    <font-awesome-icon :icon="['far', 'trash-alt']" class="icon alt"/>
                  </button>
                </div>
              </div>
              <form class="doc" @submit.prevent="checkForm" enctype="multipart/form-data">
                <div class="fields">
                  <div 
                    class="field"
                    v-for="(field, index) of selectedForm.document_fields"
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
                        :class="$v.selectedForm.document_fields.$each[index].value.$error ? 'is-invalid' : ''"
                        v-model.trim="field.value"
                      >
                      <p v-if="$v.selectedForm.document_fields.$each[index].value.$dirty && !$v.selectedForm.document_fields.$each[index].value.required" class="invalid-feedback">
                        Обязательное поле
                      </p> 
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
                        :class="$v.selectedForm.document_fields.$each[index].value.$error ? 'is-invalid' : ''"
                        rows="5"
                        v-model.trim="field.value"
                      >
                      </textarea>
                      <p v-if="$v.selectedForm.document_fields.$each[index].value.$dirty && !$v.selectedForm.document_fields.$each[index].value.required" class="invalid-feedback">
                        Обязательное поле
                      </p> 
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
                    <!-- CHECKBOX -->
                    <div 
                      v-if="field.fieldType === 'checkbox'" 
                      class="custom-control custom-checkbox"
                    >
                      <input 
                        :type="field.fieldType" 
                        class="custom-control-input" 
                        :id="field.fieldType + index.toString()"
                        :class="field.value === true ? 'checked' : ''"
                        v-model="field.value"
                      >
                      <label 
                        class="custom-control-label form-check-label" 
                        :for="field.fieldType + index.toString()"
                      >
                        {{ field.label }}
                      </label>
                    </div>
                    <!-- DATE -->
                    <div 
                      v-if="field.fieldType === 'date'" 
                      class="form-group111"
                    >
                      <label :for="field.fieldType + index.toString()">{{ field.label }}</label>
                      <b-form-datepicker 
                        class="mb-2"
                        :id="field.fieldType + index.toString()" 
                        :placeholder="field.placeholder"
                        :required="field.isRequire"
                        locale="ru-RU"
                        start-weekday="1"
                        :hide-header="true"
                        labelHelp=""
                        :date-format-options="{ 'year': 'numeric', 'month': 'numeric', 'day': 'numeric' }"
                        label-current-month="Текущий месяц"
                        label-prev-month="Предыдущий месяц"
                        label-next-month="Следующий месяц"
                        label-prev-year="Предыдущий год"
                        label-next-year="Следующий год"
                        v-model="field.value" 
                      ></b-form-datepicker>
                      <!-- <p v-if="$v.form.fullName.$dirty && !form.fullName.required" class="invalid-feedback">
                        Обязательное поле
                      </p> :class="$v.form.input1.$error ? 'is-invalid' : ''" -->
                    </div>
                    <!-- FILE -->
                    <div 
                      v-if="field.fieldType === 'file'"
                      class="custom-file"
                    >
                      <label 
                        :for="field.fieldType + index.toString()"
                      >
                        {{ field.label }}
                      </label>
                      <input 
                        :type="field.fieldType"  
                        class="form-control-file" 
                        :id="field.fieldType + index.toString()"
                        ref="file"
                        @change="handleFileUpload()"
                      >
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  class="btn btn-outline-primary w-100 mt-4 mb-2"
                  :class="isAnyFormEditing ? 'disabled' : ''"
                  @keypress.enter="console.log('enter pressed')"
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
                :formStaff="editingForm.staff_id"
                :saveButtonTitle="'Сохранить изменения'"
                :backButtonTitle="'Прекратить редактирование'"
                v-model="editingForm.type_name"
                @update="getForms"
                @closeEditor="stopEditingForm"
                :key="2"
              />
            </div>
          </div>
        </div>
        <transition name="slide-fade">
          <SuccessSendDataToast 
            v-if="isSuccessSendDataToastOpen"
            @close="isSuccessSendDataToastOpen = false"
          />
        </transition>
        <transition name="fade">
          <ModalDelete 
            v-if="isModalDeleteOpen"
            :title="'Подтвердите действие'"
            @close="isModalDeleteOpen = false"
            @deleteForm="deleteThisForm"
          />
        </transition>
    </div>
  </div>
</template>

<script>
import FormEditor from './FormEditor.vue'
import ModalDelete from './ModalDelete.vue'
import SuccessSendDataToast from './SuccessSendDataToast.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import VSelectize from '@isneezy/vue-selectize'
import axios from 'axios';
var _cloneDeep = require('lodash/cloneDeep');

export default {
  mixins: [validationMixin],
  name: 'Backoffice',
  components: { FormEditor, ModalDelete, SuccessSendDataToast, VSelectize },
  data() {
    return {
      title: 'Backoffice',
      forms: [],
      formSearch: '',
      formSearchError: false,
      formName: '',
      formFields: [],
      selectedForm: {},
      selectedFormNonParse: {},
      isFormSelected: false,
      isModalDeleteOpen: false,
      isSuccessSendDataToastOpen: false,
      isFormCreating: false,
      editingForm: {},
      isAnyFormEditing: false,
      file: '',
      validationValues: []
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
  computed: {
    formsFiltred() {
      return this.forms.filter(form => form.type_name.toLowerCase().includes(this.formSearch.toLowerCase()))
    }
  },
  watch: {
    'form.wayToGetOption'(newOption) {
      this.form.isActive = newOption === 'option1' ? true : false
    },
    formsFiltred(newFormsFiltred) {
      this.formSearchError = newFormsFiltred.length === 0;
    }
  },
  validations: {
    selectedForm: {
      document_fields: {
        $each: {
          value: { required }
        }
      }
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
      this.file = '';
      // this.validations = {
      //   test: { required, email } 
      // }
      this.setValidation()
    },
    unselectForm() {
      this.selectedFormNonParse = {};
      this.selectedForm = {};
      this.isFormSelected = false;
    },
    cloneThisForm() {
      const coppiedForm = _cloneDeep(this.selectedForm)
      const form = {
        formName: coppiedForm.type_name,
        formFields: coppiedForm.document_fields,
        staffId: coppiedForm.staff_id
      }
      axios.post('/saveForm', form);
      this.getForms();
    },
    setValidation() {
      // let form = {}
      for (let field of this.selectedForm.document_fields) {
        if (field.isRequire) {
          // let fieldName = field.fieldType.toString() + i.toString()
          // form[fieldName] = { required }
          // Object.assign(form, )
          this.validationValues.push({value: field.value });
        }
      }
      // Object.assign(this.validations, form)
      // this.validations = form;
      console.log(this.validationValues)
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
    handleFileUpload() {
      this.file = this.$refs.file[0].files[0];
    },
    openModalDelete() {
      this.isModalDeleteOpen = true;
    },
    deleteThisForm() {
      console.log(`Removed: ${this.selectedForm.type_name}`)
      const form = {
        id: this.selectedForm.id,
      }
      axios.post('/deleteData', form)
      axios.post('/deleteForm', form)
      this.getForms();
      this.unselectForm();
    },
    clearForm() {
      for (let field of this.selectedForm.document_fields) {
        if (field.fieldType === 'select') {
          field.value = []
        } 
        if (field.fieldType === 'checkbox') {
          field.value = false
        } else {
          field.value = ''
        }
      }
    },
    checkForm() {
      // валидация
      // this.$v.selectedForm.document_fields.$each.$touch()
      // if (this.$v.selectedForm.$error) {
      //   console.log('Валидация не прошла!')
      //   // return
      // }

      let fields = this.selectedForm.document_fields;
      let data = [];

      for (let field of fields) {
        if (field.fieldType === 'select') {
          let flatted = field.value.flat();
          let selected = [];
          for (let option of flatted) {
            if (typeof option === 'object') selected.push(option.label)
            if (typeof option === 'string') selected.push(option)
          }
          data.push (
            {
              'id': field.id,
              'fieldType': field.fieldType,
              'value': selected
            }
          )
        } else {
          data.push (
            {
              'id': field.id,
              'fieldType': field.fieldType,
              'value': field.value
            }  
          );
        }
      }
      console.log(data)

      let formData = new FormData();
      formData.append('id', this.selectedForm.id)
      formData.append('data', JSON.stringify(data))
      if (this.file != '') {
        formData.append('file', this.file);
      }
      axios.post('/sendData', formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        }
      }).then(function(){
        console.log('SUCCESS!!');
        this.file = ''
      }).catch(function(){
        console.log('FAILURE!!');
      });

      this.clearForm()
      this.isSuccessSendDataToastOpen = true;
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
  .nopadding-left {
    padding-left: 0;
    margin-left: 0;
  }
  .fileLabel {
    display: block;
  }
  .fade-enter-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(50px);
    opacity: 0;
  }
</style>