<template>
  <div>
    <h1>Task list</h1>
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
                  @click="inspectTask(row.item)"
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

    <b-modal :id="deleteModal.id"
             title="Delete confirmation"
             @ok="handleDelete(deleteModal.itemId, deleteModal.index)"
             @hide="resetDeleteModal">
      <div class="align-content-center">
        <div>{{ deleteModal.itemId }}. {{ deleteModal.name }}</div>
        Are you sure?
      </div>
    </b-modal>
  </div>
</template>

<script>
const PLANNED = 1;
const COMPLETED = 2;
import {
  deleteTask,
  getAllTasks, getTaskStatuses, updateTask
} from '@/services/taskService';


export default {
  name: "index",
  components: {},
  data() {
    return {
      loading: false,
      planned: PLANNED,
      completed: COMPLETED,
      tasks: [],
      fields: [],
      statuses: [],

      deleteModal: {
        id: 'info-modal',
        name: '',
        itemId: '',
        index: -1,
      }
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
          item.status = this.statuses[item.status];
        });
        this.tasks = data;
        this.fields = ['id', 'name', 'status', {key: 'actions', label: 'Actions'}]
        this.loading = false;
      } catch (e) {
        console.warn(e);
      } finally {
        this.loading = false;
      }
    },

    addTask() {
      this.$router.push('/tasks/add');
    },
    markCompleted(row) {
      this.updateStatus(row.index, row.item.id, COMPLETED);
    },
    markPlanned(row) {
      this.updateStatus(row.index, row.item.id, PLANNED);
    },
    async updateStatus(taskIndex, taskId, status) {
      try {
        let {data} = await updateTask(taskId, {status: status});
        data.status = this.statuses[data.status];
        this.$set(this.tasks, taskIndex, data);
      } catch (e) {
        console.warn(e);
      }
    },
    inspectTask(item) {
      // addTask()
      console.log(item);
    },
    showDeleteModal(item, index, button) {
      this.deleteModal.name = item.name;
      this.deleteModal.itemId = item.id;
      this.deleteModal.index = index;
      console.log(this.deleteModal)

      this.$root.$emit('bv::show::modal', this.deleteModal.id, button);
    },
    resetDeleteModal() {
      this.deleteModal.name = '';
      this.deleteModal.itemId = '';
      this.deleteModal.index = -1;
    },
    async handleDelete(itemId, taskIndex) {
      try {
        let {status} = await deleteTask(itemId);
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
</style>