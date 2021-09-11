<template>
  <div class="form-fields">
    <div class="row">
      <div class="col">
        <div class="shadow-sm p-3 bg-body rounded">
          <div class="form-group">
            <label for="form_training">Выберете тип нового поля:</label>
            <div class="form-selector">
              <v-selectize 
                :options="formTypes" 
                v-model="formType" 
                placeholder="Выберете тип поля"
              />
            </div>
          </div>
          <div
            v-if="formType==='input'"
            class="mt-3"
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
              <!-- <p v-if="$v.form.groupName.$dirty && !form.groupName.required" class="invalid-feedback">
                Обязательное поле
              </p> -->
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
            class="btn btn-outline-primary w-100 mt-5"
            :disabled="!input.formIsFull"
          >
            Добавить поле
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormFields',
  data() {
    return {
      formTypes: [
        'input',
        'select'
      ],
      formType: '',
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
      }
    }
  },
  watch: {
    "input.label"() {
      this.checkFormFull()
    },
    "input.placeholder"() {
      this.checkFormFull()
    }
  },
  methods: {
    addNewField() {
      this.$set(this.formFields, this.additianalField, '')
    },
    checkFormFull() {
      return this.input.formIsFull = this.input.label && this.input.placeholder ? true : false
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