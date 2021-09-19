<template>
  <div class="modal" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
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
          <p>Вы дествительно хотите удалить эту форму?</p>
        </div>
        <div class="modal-footer">
          <button 
            type="button"
            class="btn btn-secondary"
            @click="closeModal"
          >
            Отмена
          </button>
          <button 
            type="button"
            class="btn btn-primary"
            @click="deleteForm"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: '' 
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    deleteForm(){
      this.$emit('deleteForm')
      this.closeModal()
    }
  },
  mounted() {
    let vm =this;
    document.addEventListener('click', function(item) {
      if (item.target === vm.$refs['modal']) {
        vm.closeModal()
      }
    })
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