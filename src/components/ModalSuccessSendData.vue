<template>
  <div class="modal modal-request-number" >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Заявка отправлена!
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
          <p>
            Заявка <a role="button" @click="copyRequestNumber" class="btn btn-link nopadding"> №{{ requestNumber }}</a> успешно отправлена!
          </p>
          <p><a role="button" @click="goToDataPage" class="btn btn-link nopadding"> Посмотреть ответ по заявке</a></p>
        </div>
        <div class="modal-footer">
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
    <SuccessCopyDataToast 
      v-if="isSuccessCopyDataToastOpen"
      @close="isSuccessCopyDataToastOpen = false"
    />
  </div>
</template>

<script>
import SuccessCopyDataToast from './SuccessCopyDataToast.vue'

export default {
  name: 'ModalSuccessSendData',
  components: {
    SuccessCopyDataToast
  },
  props: {
    requestNumber: {
      type: String,
      default: '' 
    }
  },
  data() {
    return {
      isSuccessCopyDataToastOpen: false,
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    copyRequestNumber() {
      navigator.clipboard.writeText(this.requestNumber)
        .then(() => {
          this.isSuccessCopyDataToastOpen = true
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
    },
    goToDataPage() {
      console.log('Открыть страницу для просмотра ответа на заявку по номеру')
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
  .nopadding {
    padding: 0;
  }
</style>