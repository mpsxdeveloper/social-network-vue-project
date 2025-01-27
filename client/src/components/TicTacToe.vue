<template>
  <div class="backdrop" @click.self="closeModalGame">
    <div class="modal">
      <div class="modal-header">
        Tic Tac Toe<span class="close" @click="closeModalGame">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </div>
      <div class="modal-body">
        <div id="game" style="width: 155px; margin: 0 auto; text-align: center">
          <h2 style="line-height: 30px">
            Vez:
            <img
              :src="turn === p1sid ? 'blue_boxCross.png' : 'blue_boxTick.png'"
              width="30"
              height="30"
            />
            <p>
              {{
                player === turn
                  ? "(Sua vez de jogar)"
                  : "(Aguardando vez do adversário)"
              }}
            </p>
          </h2>
          <div class="board">
            <div id="a1" @click="play('a1')" item-value=""></div>
            <div id="a2" @click="play('a2')" item-value=""></div>
            <div id="a3" @click="play('a3')" item-value=""></div>
            <div id="b1" @click="play('b1')" item-value=""></div>
            <div id="b2" @click="play('b2')" item-value=""></div>
            <div id="b3" @click="play('b3')" item-value=""></div>
            <div id="c1" @click="play('c1')" item-value=""></div>
            <div id="c2" @click="play('c2')" item-value=""></div>
            <div id="c3" @click="play('c3')" item-value=""></div>
          </div>
          <div style="clear: both; margin-top: 10px">
            <h2>
              Vencedor:
              <img v-if="winner" :src="winner" width="35" height="35" />
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TicTacToe",
  props: ["p1sid", "p2sid", "player", "turn", "symbol", "currentMove"],
  setup(props) {},
  data() {
    return {
      winner: "",
      times: 0,
    };
  },
  methods: {
    closeModalGame() {
      this.$emit("close-game");
    },
    play(position) {
      if (this.turn === this.player && this.winner === "") {
        const thediv = document.getElementById(position);
        if (thediv.innerHTML === "") {
          const img = document.createElement("img");
          img.classList.add("img-item");
          let s;
          if (this.p1sid === this.player) {
            img.src = "blue_boxCross.png";
            thediv.setAttribute("item-value", "x");
          } else {
            img.src = "blue_boxTick.png";
            thediv.setAttribute("item-value", "o");
          }
          thediv.appendChild(img);
          this.$emit(
            "move",
            thediv.getAttribute("item-value"),
            this.turn,
            position
          );
        }
      } else {
      }
    },
    checkWinner() {
      const a1 = document.getElementById("a1").getAttribute("item-value");
      const a2 = document.getElementById("a2").getAttribute("item-value");
      const a3 = document.getElementById("a3").getAttribute("item-value");
      const b1 = document.getElementById("b1").getAttribute("item-value");
      const b2 = document.getElementById("b2").getAttribute("item-value");
      const b3 = document.getElementById("b3").getAttribute("item-value");
      const c1 = document.getElementById("c1").getAttribute("item-value");
      const c2 = document.getElementById("c2").getAttribute("item-value");
      const c3 = document.getElementById("c3").getAttribute("item-value");
      let icon = "";
      let thewinner = "";
      for (let i = 0; i < 2; i++) {
        if (i === 0) {
          icon = "x";
        } else {
          icon = "o";
        }
        if (
          (a1 === icon && a2 === icon && a3 === icon) ||
          (b1 === icon && b2 === icon && b3 === icon) ||
          (c1 === icon && c2 === icon && c3 === icon) ||
          (a1 === icon && b1 === icon && c1 === icon) ||
          (a2 === icon && b2 === icon && c2 === icon) ||
          (a3 === icon && b3 === icon && c3 === icon) ||
          (a1 === icon && b2 === icon && c3 === icon) ||
          (a3 === icon && b2 === icon && c1 === icon)
        ) {
          thewinner = icon;
          if (thewinner === "x") {
            this.winner = "blue_boxCross.png";
          } else if (thewinner === "o") {
            this.winner = "blue_boxTick.png";
          }
          if (this.player === this.p1sid && thewinner === "x") {
            alert("Você ganhou!");
          } else if (this.player === this.p2sid && thewinner === "x") {
            alert("Você perdeu!");
          }
          if (this.player === this.p2sid && thewinner === "o") {
            alert("Você ganhou!");
          } else if (this.player === this.p1sid && thewinner === "o") {
            alert("Você perdeu!");
          }
        }
      }
    },
  },
  updated() {
    const div = document.getElementById(this.currentMove);
    if (div.innerHTML === "") {
      const img = document.createElement("img");
      img.classList.add("img-item");
      if (this.symbol === "x") {
        img.src = "blue_boxCross.png";
        div.setAttribute("item-value", "x");
      } else {
        img.src = "blue_boxTick.png";
        div.setAttribute("item-value", "o");
      }
      div.appendChild(img);
    }
    this.checkWinner();
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
  height: 400px;
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
.board {
  display: flex;
  flex-wrap: wrap;
}
.board div {
  border: 1px solid #000;
  min-height: 50px;
  flex-grow: 1;
  height: 100%;
  width: 32%;
}
.img-item {
  flex: auto;
}
</style>
