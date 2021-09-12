<template>
  <div class="form-editor">
    <div class="container">
      <div class="container-fluid main-content-wrapper">
        <h2 class='title'>{{ title }}</h2>
        <div class="row">
          <div class="col-md-8">
            <!-- <div class="shadow p-3 mb-5 bg-body rounded"> -->
              <div>
                <input 
                  class="form-control form-control-lg" 
                  type="text" 
                  placeholder="Введите название формы" 
                  aria-label=".form-control-lg example"
                  v-model.trim="formName"
                >
                <FormFields class="mt-3"/>
                <!-- <div 
                  class="form-group"
                  v-for="(fieldValue, fieldLabel, index) in formFields"
                  :key="index"
                >
                  <label for="fieldLabel">{{ fieldLabel }}</label>
                  <input type="text"
                    class="form-control"
                    id="fieldLabel" 
                    v-model="formFields[fieldLabel]"
                  >
                </div> -->
            </div>
          </div>
          <!-- controlPanel -->
          <!-- <div class="col-md-4">
            <div class="btn-group-vertical me-2" role="group" aria-label="Control Panel">
              <button 
                type="button" 
                class="btn btn-primary"
                data-bs-toggle="tooltip" 
                data-bs-placement="right" 
                title="Добавить поле"
              >
                +
              </button>
              <button 
                type="button" 
                class="btn btn-primary"
                data-bs-toggle="tooltip" 
                data-bs-placement="right" 
                title="Удалить поле"
              >
                -
              </button>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormFields from './FormFields.vue'
export default {
  components: { FormFields },
  name: 'FormEditor',
  data() {
    return {
      title: 'Редактор форм',
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
</style>