<template>
  <b-modal :id="id"
           :title="title"
           :ok-only="cancelDisabled"
           @ok="okModal()"
           @hide="closeModal()">
    <div class="text-center">
      <strong>{{ task.id }}. {{ task.name }}</strong>
      <br/>
      <br/>
      <div class="text-left"><strong>Status: </strong>{{ task.status }}</div>
      <div class="text-left"><strong>Description: </strong>{{ task.description }}</div>

      <div v-if="actionType==='delete'"><br/> Delete this task?</div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: "itemModal",
  props: {
    task: {
      type: Object,
      default: () => {
      },
    },
    actionType: {
      type: String,
      default: () => 'info',
    },
    id: {
      type: String,
      default: () => 'info',
    },
    index: {
      type: Number,
      default: () => -1,
    },
  },
  computed: {
    cancelDisabled() {
      return this.actionType !== 'delete';
    }
  },
  data() {
    return {
      title: 'Task information',
      question: '',
    }
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      if (this.actionType === 'delete') {
        this.title = 'Delete confirmation';
      }
    },
    closeModal() {
      this.$emit('close-modal');
    },
    okModal() {
      this.$emit('confirm-modal', this.task, this.index);
    }
  }
}
</script>

<style scoped>

</style>