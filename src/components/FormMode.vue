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
                  :type="field.dataType" 
                  :id="field.fieldType + index.toString()"
                  :placeholder="field.placeholder"
                  class="form-control"
                  :class="$v.form.document_fields.$each[index].value.$error ? 'is-invalid' : ''"
                  v-model.trim="field.value"
                >
                <p v-if="$v.form.document_fields.$each[index].value.$dirty && !$v.form.document_fields.$each[index].value.required" class="invalid-feedback">
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
                  :class="$v.form.document_fields.$each[index].value.$error ? 'is-invalid' : ''"
                  rows="5"
                  v-model.trim="field.value"
                >
                </textarea>
                <p v-if="$v.form.document_fields.$each[index].value.$dirty && !$v.form.document_fields.$each[index].value.required" class="invalid-feedback">
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
            @keypress.enter="console.log('enter pressed')"
          >
            Отправить
          </button>
        </form>
      </div>
      <transition name="slide-fade">
        <SuccessSendDataToast 
          v-if="isSuccessSendDataToastOpen"
          @close="isSuccessSendDataToastOpen = false"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import SuccessSendDataToast from './SuccessSendDataToast.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import VSelectize from '@isneezy/vue-selectize'
import axios from 'axios';

export default {
  mixins: [validationMixin],
  name: 'FormMode',
  components: { SuccessSendDataToast, VSelectize },
  data() {
    return {
      title: 'FormMode',
      formId: '',
      form: {},
      isSuccessSendDataToastOpen: false,
      file: '',
      validationValues: []
    }
  },
  mounted() {
    this.getForm();
  },
  validations: {
    form: {
      document_fields: {
        $each: {
          value: { required }
        }
      }
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
          console.log(response.data)
          this.form = JSON.parse(JSON.stringify(response.data));
        });

      this.forceUpdate()
    },
    forceUpdate() {
      this.$forceUpdate()
    },
    setValidation() {
      // let form = {}
      for (let field of this.form.document_fields) {
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
    handleFileUpload() {
      this.file = this.$refs.file[0].files[0];
    },
    maybeCreate(field) {
      if (field.isAddable) return this.createContact
      return false
    },
    checkForm() {
      // валидация
      // this.$v.form.document_fields.$each.$touch()
      // if (this.$v.form.$error) {
      //   console.log('Валидация не прошла!')
      //   // return
      // }

      let fields = this.form.document_fields;
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
      formData.append('id', this.form.id)
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
    },
    clearForm() {
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
</style>