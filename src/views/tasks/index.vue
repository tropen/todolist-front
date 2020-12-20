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
                  @click="showInfoModal(row.item, row.index, $event.target)"
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
      <div class="text-center">
        <strong>{{ deleteModal.itemId }}. {{ deleteModal.name }}</strong>
        <div>Delete this task?</div>
      </div>
    </b-modal>

    <b-modal :id="infoModal.id"
             title="Task information"
             ok-only
             @hide="resetInfoModal">
      <div class="text-center">
        <strong>{{ infoModal.itemId }}. {{ infoModal.name }}</strong>
        <div>{{ infoModal.description }}</div>
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
        id: 'delete-modal',
        name: '',
        itemId: '',
        index: -1,
      },
      infoModal: {
        id: 'info-modal',
        name: '',
        itemId: '',
        description: '',
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
        this.fields = ['id', 'name', 'status', {key: 'actions', label: 'Actions'}]
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
      this.updateStatus(row.index, row.item.id, COMPLETED);
    },
    markPlanned(row) {
      this.updateStatus(row.index, row.item.id, PLANNED);
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
    showInfoModal(item, index, button) {
      this.infoModal.name = item.name;
      this.infoModal.itemId = item.id;
      this.infoModal.description = item.description;

      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },


    showDeleteModal(item, index, button) {
      this.deleteModal.name = item.name;
      this.deleteModal.itemId = item.id;
      this.deleteModal.index = index;

      this.$root.$emit('bv::show::modal', this.deleteModal.id, button);
    },
    resetDeleteModal() {
      this.deleteModal.name = '';
      this.deleteModal.itemId = '';
      this.deleteModal.index = -1;
    },
    resetInfoModal() {
      this.infoModal.name = '';
      this.infoModal.itemId = '';
      this.infoModal.description = '';
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