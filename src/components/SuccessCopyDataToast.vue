<template>
  <div class="success-copy-data-toast" @click="closeModal">
    <div 
      class="alert alert-success" 
      role="alert" 
      @click="closeModal"
    >
      Номер скопирован в буфер обмена!
    </div>
    <div class="progress">
      <div 
        class="progress-bar bg-success" 
        role="progressbar" 
        :style="{ width: borderWidth + '%' }" 
        :aria-valuenow="borderWidth" 
        aria-valuemin="0" 
        aria-valuemax="100"
      >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessCopyDataToast',
  data() {
    return {
      borderWidth: 100
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    borderWidthDown() {
      this.borderWidth = this.borderWidth - 2
    },
    progress() {
      let timerId = setInterval(() => this.borderWidthDown(), 100);
      setTimeout(() => { clearInterval(timerId) }, 5000);
    }
  },
  mounted() {
    setTimeout(this.closeModal, 5300)
    this.progress()
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
  .success-copy-data-toast {
    display: block;
    position: fixed;
    top: 20px;
    right: 220px;
    z-index: 10;
    cursor: pointer;
  }
  .alert {
    margin: 0 !important
  }
  .progress {
    position: relative;
    bottom: 2px;
    height: 2px;
  }
  .progress-bar {
    background: rgb(120, 199, 130) !important;
  }
</style>