<template>
  <div class="modal modal-request-number" >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Заявка успешно отправлена!
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
        <div class="modal-body text-center">
          <a 
            role="button" 
            @click="copyRequestNumber" 
            class="btn btn-light w-100 mb-3 d-flex align-items-center justify-content-between"
          > 
            <font-awesome-icon :icon="['far', 'clone']" class="icon alt invisible"/>
            <p class="h2 mb-0">№{{ requestNumber }}</p>
            <font-awesome-icon :icon="['far', 'clone']" class="icon alt"/>
          </a>
          <a role="button" @click="goToDataPage" class="btn btn-link nopadding"> Посмотреть ответ по заявке</a>
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
    <transition name="slide-fade">
      <SuccessCopyDataToast 
        v-if="isSuccessCopyDataToastOpen"
        @close="isSuccessCopyDataToastOpen = false"
      />
    </transition>
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
      window.location.assign(`/status`);
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