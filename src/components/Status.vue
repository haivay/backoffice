<template>
  <div class="status">
    <div class="container">
      <label for="request-number">Номер заявки:</label>
      <div class="row">
        <div class="col pr-0">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="request-number">№</span>
            </div>
            <input 
              type="text" 
              class="form-control"
              :class="invalid ? 'is-invalid' : ''" 
              placeholder="100000"
              v-model="requestNumber"
            >
            <div
              v-if="invalid" 
              class="invalid-feedback"
            >
              {{ errorMessage }}
            </div>
          </div>
        </div>
        <div class="col-auto">
          <button 
            class="btn btn-outline-primary" 
            type="button" 
            id="button-addon2"
            @click="getAnswer"
          >
            Найти
          </button>
        </div>
      </div>
      <div v-if="answer" class="answer mt-3">
        <div 
          v-if="this.status"
          class="alert"
          :class="getColorByStatus" 
          role="alert"
        >
          <h4 class="alert-heading mt-2">Статус: {{ status.status }}</h4>
          <hr>
          <p class="mb-0">Ответ по заявке: {{ answer.answer }}</p>
        </div>
      </div>
      <div v-else class="no-answer mt-3">
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading mt-2">Приносим свои извинения</h4>
          <p>Ответа на вашу заявку пока не поступило, попробуйте снова через некоторое время!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Status',
  data() {
    return {
      statuses: [],
      requestNumber: '',
      invalid: false,
      errorMessage: '',
      answer: {},
      status: '',
      requestColors: ['table-light', 'table-info', 'table-primary', 'table-success', 'table-danger', 'table-dark'],
    }
  },
  mounted() {
    this.getStatuses()
  },
  watch: {
    answer() {
      if (this.answer) {
        this.setStatus()
      }
    }
  },
  computed: {
    getColorByStatus() {
      let index = this.statuses.findIndex(status => status.id === this.answer.status_id)
      let color = this.requestColors[index]
      return color
    }
  },
  methods: {
    getStatuses() {
      axios
        .post('/getStatuses')
        .then(response => this.statuses = response.data)
    },
    getAnswer() {
      if (!this.checkRequestNumber()) {
        return
      }

      this.status = ''
      const form = {
        requestNumber: this.requestNumber
      }

      axios
        .post('/getAnswerByRequestNumber', form)
        .then(response => this.answer = response.data[0])
    },
    setStatus() {
      this.status = this.statuses.filter(s => s.id === this.answer.status_id)[0]
    },
    checkRequestNumber() {
      if (!this.requestNumber) {
        this.invalid = true
        this.errorMessage = 'Введите номер формы!'
        return false
      }
      if (this.requestNumber.length < 6) {
        this.invalid = true
        this.errorMessage = 'Неправильный номер формы!'
        return false
      }
      if (this.requestNumber && this.requestNumber.length > 5) {
        this.invalid = false
        this.errorMessage = ''
        return true
      }
    }
  }
}
</script>