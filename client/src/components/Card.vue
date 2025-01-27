<template>
  <div class="card">
    <div style="display: flex; justify-content: space-between">
      <span
        >{{ name }} &nbsp;&nbsp;<small>{{ date }}</small></span
      >
    </div>
    <img :src="url" style="width: 100%; height: auto" />
    <div style="display: flex">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  data() {
    return;
  },
  props: {
    url: {
      type: String,
    },
    date: {
      type: String,
    },
    name: {
      type: String,
      default: "Você publicou uma foto",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
span {
  font-weight: bold;
  font-size: 18px;
}
.card {
  height: 100%;
  padding: 10px 0;
}
.status {
  font-size: 28px;
}
</style>
