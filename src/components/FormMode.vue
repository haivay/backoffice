<template>
  <div class="root">
    <div class="container main-content-wrapper">
      <div class="form">
        <h2 class="title mb-3">{{ form.type_name }}</h2>
        <form class="doc" @submit.prevent="checkForm" enctype="multipart/form-data">
          <div class="fields">
            <div 
              class="field"
              v-for="(field, index) of form.document_fields"
              :key="index"
            >
              <!-- INPUT -->
              <div 
                v-if="field.fieldType === 'input'" 
                class="form-group"
              >
                <label :for="field.fieldType + index.toString()">{{ field.label }}</label>
                <input 
                  :type="field.dataType.id" 
                  :id="field.fieldType + index.toString()"
                  :placeholder="field.placeholder"
                  class="form-control"
                  :class="errors[index] ? 'is-invalid' : ''"
                  v-model.trim="field.value"
                >
                <p v-if="errors[index]" class="invalid-feedback">
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
                  :class="errors[index] ? 'is-invalid' : ''"
                  rows="5"
                  v-model.trim="field.value"
                >
                </textarea>
                <p v-if="errors[index]" class="invalid-feedback">
                  Обязательное поле
                </p> 
              </div>
              <!-- SELECT -->
              <div 
                v-if="field.fieldType === 'select'" 
                class="form-group"
              >
                <label :for="field.fieldType + index.toString()">{{ field.label }}</label>
                <div :id="field.fieldType + index.toString()" :class="errors[index] ? 'is-invalid-select is-invalid' : ''">
                  <v-selectize 
                    :placeholder="field.placeholder"
                    :options="field.options" 
                    :class="errors[index] ? 'is-invalid' : ''"
                    :create-item="maybeCreate(field)"
                    :multiple="field.isMultiple"
                    :invalid="errors[index]"
                    v-model="field.value[0]" 
                  />
                </div>
                <p v-if="errors[index]" class="invalid-feedback">
                  Обязательное поле
                </p>
              </div>
              <!-- CHECKBOX -->
              <div 
                v-if="field.fieldType === 'checkbox'" 
                class="custom-control custom-checkbox my-3"
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
                  :class="errors[index] ? 'is-invalid' : ''"
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
                <p v-if="errors[index]" class="invalid-feedback">
                  Обязательное поле
                </p>
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
            @keypress.enter="console.log('enter pressed')"
          >
            Отправить
          </button>
        </form>
      </div>
      <transition name="fade">
        <ModalSuccessSendData 
          v-if="isModalSuccessSendDataOpen"
          @close="isModalSuccessSendDataOpen = false"
          :requestNumber="requestNumber"
        />
      </transition>
    </div>
  </div>
</template>

<script>

import ModalSuccessSendData from './ModalSuccessSendData.vue'
import VSelectize from '@isneezy/vue-selectize'
import axios from 'axios';

export default {
  name: 'FormMode',
  components: { ModalSuccessSendData, VSelectize },
  data() {
    return {
      formId: '',
      form: {},
      file: '',
      dirty: false,
      error: false,
      errors: {},
      requestNumber: '',
      isModalSuccessSendDataOpen: false
    }
  },
  mounted() {
    this.getForm();
  },
  watch: {
    'form.document_fields': {
      handler: function() {
        if (this.dirty) {
          this.validateForm()
        }
      },
      deep: true
    }
  },
  methods: {
    getForm() {
      let formId = window.location.href.split('type_id=')[1];
      
      const form = {
        formId: formId
      }
      axios.post('/getForm', form)
        .then((response) => {
          this.form = JSON.parse(JSON.stringify(response.data));
        });

      this.$forceUpdate()
    },
    handleFileUpload() {
      this.file = this.$refs.file[0].files[0];
    },
    maybeCreate(field) {
      if (field.isAddable) return this.createContact
      return false
    },
    validateForm() {
      this.dirty = true
      let errors = {}

      for (let i = 0; i < this.form.document_fields.length; i++) {
        let fieldType = this.form.document_fields[i].fieldType

        if (this.form.document_fields[i].isRequire && !this.form.document_fields[i].value.length) {
          errors[i] = true
        } else if (fieldType === 'select' && this.form.document_fields[i].isRequire) {
          if (!this.form.document_fields[i].value.length || this.form.document_fields[i].value[0] === null || !this.form.document_fields[i].value[0].length) {
            console.log('select error')
            errors[i] = true
          }
        } else {
          errors[i] = false
        }
      }

      this.errors = errors
    },
    checkForm() {
      // валидация
      this.validateForm()
      if (Object.values(this.errors).includes(true)) {
        return
      }

      let fields = this.form.document_fields;
      let data = {};

      for (let field of fields) {
        let value = ''
        if (field.fieldType === 'select') {
          let flatted = field.value.flat();
          let selected = [];
          for (let option of flatted) {
            if (typeof option === 'object') selected.push(option.label)
            if (typeof option === 'string') selected.push(option)
          }
          selected = selected.join(', ')
          value = selected
        } else if (field.fieldType === 'date') {
          value = field.value.split('-').reverse().join('.')
        } else {
          value = field.value
        }

        data[field.id] = value
      }

      // let formData = new FormData();
      // formData.append('id', this.form.id)
      // formData.append('data', JSON.stringify(data))
      // formData.append('personId', 'eda81559-403b-46c8-9afd-35e93fbef1cc')
      // if (this.file != '') {
      //   formData.append('file', this.file);
      // }

      let formData = {
        id: this.form.id,
        data: JSON.stringify(data),
        personId: 'eda81559-403b-46c8-9afd-35e93fbef1cc'
      }

      axios
        .post('/saveRequest', formData)
        .then((response) => {
          this.requestNumber = response.data.request_number
          this.file = ''
        })
        .catch((err) => {
          console.error(err)
        });

      this.clearForm()
      this.isModalSuccessSendDataOpen = true;
    },
    clearForm() {
      this.dirty = false
      this.error = false
      this.errors = {}
      for (let field of this.form.document_fields) {
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
  .is-invalid-select {
    border: 1px solid #dc3545;
    border-radius: 4px;
  }
</style>