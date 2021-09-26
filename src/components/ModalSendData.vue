<template>
  <div class="modal-send-data">
    <div 
      class="alert alert-success" 
      role="alert" 
      @click="closeModal"
    >
      Данные успешно отправлены!
    </div>
    <div class="progress" style="height: 1px;">
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
  name: 'Modal',
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
      this.borderWidth = this.borderWidth - 0.2
    },
    progress() {
      let timerId = setInterval(() => this.borderWidthDown(), 10);
      setTimeout(() => { clearInterval(timerId) }, 5000);
    }
  },
  mounted() {
    let vm =this;
    document.addEventListener('click', function(item) {
      if (item.target === vm.$refs['modal']) {
        vm.closeModal()
      }
    })
    setTimeout(this.closeModal, 5000)
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
  .modal-send-data {
    display: block;
    position: fixed;
    top: 100px;
    right: 100px;
    z-index: 10;
    cursor: pointer;
  }
  .alert {
    margin: 0 !important
  }
</style>