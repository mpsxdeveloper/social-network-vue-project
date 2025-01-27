<template>
  <div class="backdrop" @click.self="closeModalPost">
    <div class="modal">
      <div class="modal-header">
        Criar publicação<span class="close" @click="closeModalPost">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
      <div class="modal-body">
        <h1>
          <i class="fa-solid fa-images fa-3x"></i>
        </h1>
        <h2>Selecionar foto</h2>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalPost",
  methods: {
    closeModalPost() {
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
button {
  background-color: #2c3e50;
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  width: 50%;
  cursor: pointer;
  padding: 10px;
  margin-top: 20px;
}
</style>
