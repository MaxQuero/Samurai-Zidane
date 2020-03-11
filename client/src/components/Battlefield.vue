<template>
    <div class="background">
        <div class="complet res" v-if="res === 'complet'">{{res}}</div>
        <div class="game" v-if="res !== 'complet'">
        <div class="res" v-if="state === 'end' || state ==='hit'  || state === 'init'">{{res}}</div>

        <div class="battle-ready" v-if="state !== 'end'">
            <img class="player player1" src="../assets/zidane.png"/>
            <img class="player player2" src="../assets/matterazzi.png"/>
        </div>
        <div class="scenarii" v-if="state === 'end'">

            <div class="player1-win" v-if="(player === 'Zidane' && res === 'Gagné') || (player ==='Materazzi' && res === 'Perdu')">
                <img class="headbutt" src="../assets/headbutt.png"/>
            </div>
            <div class="player2-win" v-if="(player === 'Materazzi' && res === 'Gagné') || (player === 'Zidane' && res === 'Perdu')">
                <img class="player player1" src="../assets/zizou-red-card.png"/>
                <img class="player player2" src="../assets/ref.png"/>
            </div>
        </div>

            <div class="btn start" v-if="state === 'init' ||  state === 'end'" @click="startGame">Prêt à jouer</div>
            <div class="player" v-if="state !== 'end'">Vous êtes {{player}}</div>

        </div>

    </div>
</template>

<script>
    import io from 'socket.io-client';
    import Constants from "../shared/Constants";

    export default {
        name: "Battlefield",
        data() {
            return {
                user: this.$route.params.user ? this.$route.params.user :  '',
                state: 'init',
                socket: '',
                res: null,
                socketMessage: '',
                player: ''
            }
        },
        created() {

        },
        methods: {
            getRandomIntervalInMS(max, min) {
                return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
            },

            startGame() {
                this.state='ready';
                this.socket.emit('ready', this.user);
            },

            keyAction() {
                if (this.state !== 'hit') {
                    this.socket.emit('attack', 'false_start')
                } else {
                    this.socket.emit('attack', 'win');
                }
            }

        },
        mounted() {

            if(this.user === '') {
                this.$router.push({name: 'login'});
            } else {
                this.socket = io(Constants.BASE_URL, {transports: ['websocket'], upgrade: false});
                this.socket.emit('newPlayer', this.user);

                this.socket.on('complet', () => {
                    this.res = "complet";
                    this.socket.disconnect();
                });
                this.socket.on('player', (player) => {
                    if (player === 0) {
                        this.player = "Zidane";
                    } else {
                        this.player = "Materazzi";
                    }

                    console.log(this.player);
                });

                this.socket.on('result', (res) => {
                    this.state='end';
                    window.removeEventListener('keydown', this.keyAction);
                    window.removeEventListener("touchend", this.keyAction);

                    if (res === 'win') {
                        this.res = "Gagné";
                    } else if (res === 'lost') {
                        this.res = "Perdu";
                    } else if (res === 'false_start') {
                        this.res = "Perdu";
                    }

                });

                this.socket.on('readyAll', () => {
                   this.state = 'start';
                    window.addEventListener("keydown", this.keyAction);
                    window.addEventListener("touchend", this.keyAction);
                });

                this.socket.on('go', () => {
                    //in case of false start
                    if(this.state !== 'end') {
                        this.state = 'hit';
                        this.res = "!";
                    }
                });


                console.log('ici');
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .player {
        width: 100%;
        color: white;
        font-size: 1.5rem;
        z-index: 999;
        text-align: center;
    }

    .game {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
    }
    .background {
        width: 100%;
        height: 100%;
        background-image: url('../assets/terrain.jpg');
        background-size: cover;
    }

    .start {
        width: 30%;
        margin: 4px;
        padding: 8px;
        font-size: 2.5rem;
        text-align: center;
        z-index: 999;
        cursor: pointer;
        margin: 12px;

    }

    .res {
        width: 100%;
        text-align: center;
        color: white;
        font-size: 2.5rem;
        z-index: 999
    }

    .res {
        display: flex;
        justify-content: center;
        position: absolute;
        top: 150px;
        bottom: 0;
        left: 0;
        right: 0;
        font-size: 5rem;
    }

    .scenarii, .win, .battle-ready {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
    }

    .battle-ready {
        justify-content: space-around;
    }

    .battle-ready .player1 {
        width: 100px;
    }

    .battle-ready .player2 {
        width: 160px;
    }

    .scenarii {
        justify-content: center;
    }


    .scenarii .player1-win .headbutt {
        width: 400px;

    }
    .scenarii .player2-win .player1 {
        width: 100px;
        height: 250px;
    }

    .scenarii .player2-win .player2 {
        width: 100px;
    }


</style>
