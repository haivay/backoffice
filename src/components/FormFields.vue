<template>
  <div class="form-fields">
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
              <label for="input1">{{ field.label }}</label>
              <input 
                :type="field.dataType" 
                id='inputl'
                :placeholder="field.placeholder"
                class="form-control"
                disabled
              >
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
        <!-- <label for="form_training">Выберете тип нового поля:</label> -->
        <div class="form-selector">
          <v-selectize 
            :options="formTypes" 
            v-model="formType" 
            placeholder="Выберете тип нового поля"
          />
        </div>
      </div>
      <div
        v-if="formType==='input'"
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
            id="isRequire"
            v-model="input.isRequire"
          >
          <label class="form-check-label" for="isRequire">Обязательное</label>
        </div>
      </div>
      <button 
        type="submit" 
        class="btn btn-outline-primary w-100 mb-3"
        v-if="isFormTypeSelected"
        @click="stopEditing"
      >
        Назад
      </button>
      <button 
        type="submit" 
        class="btn btn-outline-success w-100"
        v-if="isFormTypeSelected"
        :disabled="!input.formIsFull && formType != ''"
        @click="addNewField"
      >
        Завершить редактирование и добавить поле
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFields',
  data() {
    return {
      title: 'Редактор форм',
      formTypes: [
        'input',
        'select'
      ],
      formType: '',
      isFormTypeSelected: false,
      input: {
        label: '',
        placeholder: '',
        isRequire: false,
        dataTypes: [
          'text',
          'number',
          'email'
        ],
        dataType: 'text',
        formIsFull: false
      },
      additionalField: {
        formType: '',
        label: '',
        placeholder: '',
        isRequire: false,
        dataType: 'text'
      },
      formFields: [
        {
          formType: 'input',
          label: 'Ваше ФИО:',
          placeholder: 'Введите ФИО',
          isRequire: true,
          dataType: 'text'
        },
        {
          formType: 'input',
          label: 'Email:',
          placeholder: 'Введите email',
          isRequire: false,
          dataType: 'email'
        }
      ]
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
      //записываем значения в временную переменную
      this.additionalField.formType = this.formType;
      this.additionalField.label = this.input.label;
      this.additionalField.placeholder = this.input.placeholder;
      this.additionalField.isRequire = this.input.isRequire;
      this.additionalField.dataType = this.input.dataType;
      //создаем клон объекта additionalField
      let cloneOfAdditionalField = {};
      Object.assign(cloneOfAdditionalField, this.additionalField);
      //добавляем поле в массив полей
      this.formFields.push(cloneOfAdditionalField);
      //обнуляем свойства
      this.input.label = '';
      this.input.placeholder = '';
      this.input.isRequire = false;
      this.input.dataType = 'text';
      this.stopEditing();
      console.log('Field was added');
    },
    checkFormFull() {
      return this.input.formIsFull = this.input.label && this.input.placeholder ? true : false
    },
    stopEditing() {
      this.formType = ''
      this.isFormTypeSelected = false
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