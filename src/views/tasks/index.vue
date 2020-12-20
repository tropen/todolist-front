<template>
  <div>
    <b-card class="mt-3">
      <div class="add-btn">
        <b-button size="md"
                  @click="addTask()"
                  class="mr-1"
                  variant="warning"
                  v-b-tooltip.hover title="Add"
        >
          <b-icon class="add-btn-lbl" icon="plus-circle-fill" aria-hidden="true"></b-icon>
        </b-button>
      </div>
      <b-table striped hover :busy="loading" :items="tasks" :fields="fields">
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #cell(actions)="row">
          <b-button size="md"
                    v-if="row.item.status === statuses[planned]"
                    @click="markCompleted(row)"
                    class="mr-1"
                    variant="success"
                    v-b-tooltip.hover title="Set completed"
          >
            <b-icon icon="check-circle" aria-hidden="true"></b-icon>
          </b-button>
          <b-button size="md" v-if="row.item.status === statuses[completed]"
                    @click="markPlanned(row)"
                    class="mr-1"
                    variant="info"
                    v-b-tooltip.hover title="Set planned">
            <b-icon icon="circle" aria-hidden="true"></b-icon>
          </b-button>
          <b-button size="md"
                    class="mr-1"
                    @click="showInfoModal(row.item, $event.target)"
                    variant="outline-primary"
                    v-b-tooltip.hover title="Inspect">
            <b-icon icon="search" aria-hidden="true"></b-icon>
          </b-button>
          <b-button size="md"
                    @click="showDeleteModal(row.item, row.index, $event.target)"
                    variant="danger"
                    v-b-tooltip.hover title="Delete">
            <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
          </b-button>
        </template>
      </b-table>

      <task-modal
          :id="'delete-modal'"
          :task="model.item"
          :index="model.index"
          :actionType="'delete'"

          @close-modal="resetModel"
          @confirm-modal="handleDelete"
      >
      </task-modal>

      <task-modal
          :id="'info-modal'"
          :task="model.item"
          :index="-1"
          :actionType="'info'"

          @confirm-modal="resetModel"
      >
      </task-modal>
      <template #header>
        <h1>Task list</h1>
      </template>
    </b-card>
  </div>
</template>

<script>
import {
  deleteTask,
  getAllTasks,
  getTaskStatuses,
  updateTask
} from '@/services/taskService';
import TaskModal from "@/views/tasks/TaskModal";


export default {
  name: "index",
  components: {
    TaskModal,
  },
  data() {
    return {
      loading: false,
      planned: 1,
      completed: 2,
      tasks: [],
      fields: [],
      statuses: [],
      model: {
        modalId: 'delete-modal',
        item: {},
        index: -1,
      },
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        let response = await getTaskStatuses();
        this.statuses = response.data;

        let {data} = await getAllTasks();
        data.forEach((item) => {
          item = this.setItemColor(item);
          item.status = this.statuses[item.status];

        });
        this.tasks = data;
        this.fields = [
          {key: 'id', label: 'Id'},
          {key: 'name', label: 'Name'},
          {key: 'status', label: 'Status'},
          {key: 'actions', label: 'Actions'}];
        this.loading = false;
      } catch (e) {
        console.warn(e);
      } finally {
        this.loading = false;
      }
    },

    setItemColor(item) {
      if (item.status === this.planned) {
        item._cellVariants = {status: 'info'};
      }
      if (item.status === this.completed) {
        item._cellVariants = {status: 'success'};
      }
      return item;
    },
    addTask() {
      this.$router.push('/tasks/add');
    },
    markCompleted(row) {
      this.updateStatus(row.index, row.item.id, this.completed);
    },
    markPlanned(row) {
      this.updateStatus(row.index, row.item.id, this.planned);
    },
    async updateStatus(taskIndex, taskId, status) {
      try {
        let {data} = await updateTask(taskId, {status: status});
        this.setItemColor(data);
        data.status = this.statuses[data.status];
        this.$set(this.tasks, taskIndex, data);
      } catch (e) {
        console.warn(e);
      }
    },

    showInfoModal(item, button) {
      this.model.item = item;
      this.model.modalId = 'info-modal';

      this.$root.$emit('bv::show::modal', this.model.modalId, button);
      console.log(this.model)
    },
    showDeleteModal(item, index, button) {
      this.model.item = item;
      this.model.index = index;
      this.model.modalId = 'delete-modal';

      this.$root.$emit('bv::show::modal', this.model.modalId, button);
    },
    resetModel() {
      this.model.modalId = '';
      this.model.item = {};
      this.model.index = -1;
    },
    async handleDelete(item, taskIndex) {
      try {
        let {status} = await deleteTask(item.id);
        if (status === 204) {
          this.tasks.splice(taskIndex, 1);
        }
      } catch (e) {
        console.warn(e);
      }
    },

  }
}
</script>

<style scoped>
.add-btn {
  float: right;
  margin: 10px 30px;
}

.add-btn-lbl {
  height: 1.3em;
  width: 1.3em;
}

.card-body {
  padding: 0;
}
</style>