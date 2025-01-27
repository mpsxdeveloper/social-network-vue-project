<template>
  <div class="backdrop" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        {{ title
        }}<span class="close" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
      <div class="modal-body">
        <img :src="avatar" width="100" height="100" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: ["title", "avatar"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style>
.modal {
  width: 400px;
  margin: 100px auto;
  background: #fff;
  border-radius: 10px;
}

.backdrop {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
}

.modal-header {
  width: 100%;
  height: 30px;
  background-color: #000;
  padding: 2px 20px;
  line-height: 30px;
  color: #fff;
  text-align: left;
}

.modal-body {
  width: 100%;
  padding: 10px 20px;
  font-weight: bold;
}

.close {
  float: right;
  cursor: pointer;
  background-color: #000;
}

.close i {
  background-color: #000;
}
</style>
