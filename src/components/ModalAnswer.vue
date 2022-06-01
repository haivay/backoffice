<template>
  <div class="modal modal-answer" >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Заявка №{{ requestNumber }}
          </h5>
          <button 
            type="button"
            class="close"
            aria-label="close"
            @click="closeModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul class="list-group list-group-flush">
            <li 
              class="list-group-item"
              v-for="(field, index) in requestData"
              :key="index"
            >
              <div class="row">
                <div class="col">
                  <strong>{{ field.label }}</strong>
                </div>
                <div class="col">
                  {{ field.value }}
                </div>
              </div>
            </li>
            <li class="list-group-item"></li>
          </ul>
          <!-- <hr> -->
          <div class="answer m-3">
            <form class="doc" @submit.prevent="checkForm">
              <div class="row">
                <div class="col form-selector">
                  <label class="form-label">Статус</label>
                  <v-selectize
                    :options="statuses" 
                    v-model="status"
                    placeholder="Выберите статус"
                    label="status"
                    :keys="['id', 'status']"
                  />
                </div>
                <div class="col form-selector">
                  <label class="form-label">Категория</label>
                  <v-selectize
                    :options="categories" 
                    v-model="category"
                    placeholder="Выберите категорию"
                    label="category"
                    :keys="['id', 'category']"
                  />
                </div>
                <div class="col form-selector">
                  <label class="form-label">Приоритет</label>
                  <v-selectize
                    :options="priorities" 
                    v-model="priority"
                    placeholder="Выберите приоритет"
                    label="priority"
                    :keys="['id', 'priority']"
                  />
                </div>
              </div>
              <div class="text-answer mt-3">
                <label class="form-label">Ответ по заявке</label>
                <textarea 
                  id="textarea-answer"
                  placeholder="Введите текст"
                  class="form-control" 
                  rows="5"
                  v-model.trim="textAnswer"
                >
                </textarea>
              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            type="button"
            class="btn btn-primary"
            @click="sendAnswer"
          >
            Отправить
          </button>
          <button 
            type="button"
            class="btn btn-secondary"
            @click="closeModal"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ModalDelete',
  props: {
    requestNumber: {
      type: String,
      default: '' 
    },
    requestData: {
      type: Array,
    },
    requestId: {
      type: String,
    }
  },
  data() {
    return {
      lastAnswer: {},
      status: '',
      statuses: [],
      category: '',
      categories: [],
      priority: '',
      priorities: [],
      textAnswer: ''
    }
  },
  mounted() {
    this.getLastAnswer();
    this.getStatuses()
    this.getCategories()
    this.getPriorities()
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    getLastAnswer() {
      const form = {
        requestNumber: this.requestNumber
      }
      console.log(form)
      axios
        .post('/getAnswerByRequestNumber', form)
        .then(response => {
          // this.lastAnswer = response.data;
          console.log(response.data)
        });
      // console.log(this.lastAnswer)
    },
    getStatuses() {
      axios
        .post('/getStatuses')
        .then(response => this.statuses = response.data)
    },
    getCategories() {
      axios
        .post('/getCategories')
        .then(response => this.categories = response.data)
    },
    getPriorities() {
      axios
        .post('/getPriorities')
        .then(response => this.priorities = response.data)
    },
    sendAnswer() {
      console.log(`Статус: ${this.status.id} \nКатегория: ${this.category.id} \nПриоритет: ${this.priority.id} \nОтвет: ${this.textAnswer} \nrequest_id: ${this.requestId}`)

      const answer = {
        status_id: this.status.id,
        category_id: this.category.id,
        priority_id: this.priority.id,
        answer: this.textAnswer,
        request_id: this.requestId
      }

      axios.post('/saveAnswer', answer)
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
  .modal {
    display: block;
    background: rgba(25,25,25,0.4);
  }
</style>