<template>
  <div>
    <b-card class="mt-3">
    <b-form @submit="onSubmit" @reset="onCancel" class="form-align-left">
      <b-form-group
          label="Task name:"
          label-for="name"
          description="This can be a brief description"
      >
        <b-form-input id='name' type="text" v-model="form.name" required/>
      </b-form-group>
      <b-form-group
          label="Description:"
          label-for="description"
      >
        <b-form-textarea id="description" v-model="form.description" required/>
      </b-form-group>

      <b-form-group
          label="Status:"
          label-for="status"
      >
        <b-form-checkbox id="status" switch size="lg" v-model="form.status"
                         :value="completed"
                         :unchecked-value="planned"
        >{{statusStr}}</b-form-checkbox>
      </b-form-group>
      <b-form-group>
      <b-button type="submit" class="mr-1" variant="primary">Submit</b-button>
      <b-button type="reset" class="mr-1" >Cancel</b-button>
      </b-form-group>

    </b-form>
    <template #header>
      <h1>New task</h1>
    </template>
      </b-card>
  </div>
</template>

<script>
import {addTask} from '@/services/taskService';

export default {
  name: "index",
  data() {
    return {
      form: {
        name: '',
        description: '',
        status: 1,
      },
      planned: 1,
      completed: 2,
      statusArr: {2:'Completed', 1:'Planned'},
    }
  },
  computed:{
    statusStr:function (){
      return this.statusArr[this.form.status];
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        let task = {
          name:this.form.name,
          description:this.form.description,
          status:this.form.status,
        };
        await addTask(task);
        this.$router.push('/tasks/');
      } catch (e) {
        console.warn(e);
      }
    },
    onCancel() {
      this.$router.push('/tasks/');
    }
  }
}
</script>

<style scoped>
.form-align-left{
  text-align: left;
}
</style>