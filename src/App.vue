<script setup>
import { ref, onMounted } from 'vue';

const name = ref('John Doe');
const status = ref('active');
const tasks = ref(['Task One', 'Task Two', 'Task Three', 'Task Four']);
const newTask = ref('');

const toggleStatus = () => {
  if (status.value === 'active') {
    status.value = 'pending';
  } else if (status.value === 'pending') {
    status.value = 'inactive';
  } else {
    status.value = 'active';
  }
};

const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push(newTask.value);
    newTask.value = '';
  }
};

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};

onMounted(async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();
    tasks.value = data.map((task) => task.title);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});
</script>

<template>
  <div v-if="status === 'active'">
    <h1>Welcome, {{ name }}!</h1>
    <p>User Is Active</p>
  </div>
  <div v-else-if="status === 'pending'">
    <h1>Welcome, Jane Doe!</h1>
    <p>User Is Pending</p>
  </div>
  <div v-else>
    <h1>Welcome, Quest!</h1>
    <p>User Is Inactive</p>
  </div>

  <form @submit.prevent="addTask">
    <label for="newTask">New Task: </label>
    <input type="text" id="newTask" name="newTask" v-model="newTask" />
    <button type="submit">Submit</button>
  </form>

  <div>
    <h3>Tasks</h3>
    <ul>
      <li v-for="(task, index) in tasks" :key="index">
        <span>
          {{ task }}
        </span>
        <button @click="deleteTask(index)">x</button>
      </li>
    </ul>
    <!-- <a :href="link" target="_blank">Go to Google</a> -->
    <br />
    <!-- <button v-on:click="toggleStatus">Change Status</button> -->
    <button @click="toggleStatus">Change Status</button>
  </div>
</template>
