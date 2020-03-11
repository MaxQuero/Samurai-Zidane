<template>
    <div class="background">
        <div class="player">{{ user }} vous êtes le joueur {{player}}</div>
        <div class="res" v-if="!ready || go">{{res}}</div>

        <div class="start" v-if="!ready || end" @click="startGame">Prêt à jouer</div>
        <div class="battle-ready" v-if="!end">
            <img class="player player1" src="../assets/zidane.png"/>
            <img class="player player2" src="../assets/matterazzi.png"/>
        </div>
        <div class="scenarii" v-if="end">

            <div class="player1-win" v-if="(player === 'Zidane' && res === 'Gagné') || (player ==='Materazzi' && res === 'Perdu')">
                <img class="headbutt" src="../assets/headbutt.png"/>
            </div>
            <div class="player2-win" v-if="(player === 'Materazzi' && res === 'Gagné') || (player === 'Zidane' && res === 'Perdu')">
                <img class="player player1" src="../assets/zizou-red-card.png"/>
                <img class="player player2" src="../assets/ref.png"/>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        name: "Battlefield",
        data() {
            return {
                user: this.$route.params.user ? this.$route.params.user : '',
                started: false,
                ready: false,
                go :false,
                socket: '',
                end: false,
                res: null,
                socketMessage: '',
                player: ''
            }
        },
        created() {
                this.user = Math.random();

                this.socket = io('http://localhost:4000', {transports: ['websocket'], upgrade: false});
                this.socket.emit('newPlayer', this.user);

        },
        methods: {
            getRandomIntervalInMS(max, min) {
                return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
            },

            startGame() {
                this.ready = true;
                this.end = false;
                this.started = false;
                //tell socket we are ready
                console.log(this.started);
                this.socket.emit('ready', this.user);


            },

            actionKeyEvent() {
                if (!this.go) {
                    this.socket.emit('attack', 'false_start')
                } else {
                    this.socket.emit('attack', 'win');
                }

                console.log(this.end);
                console.log('end listener');
                window.removeEventListener('keydown', this)

            }


        },
        mounted() {

            if (this.socket) {
                this.socket.on('player', (player) => {
                    if (player === 0) {
                        this.player = "Zidane";
                    } else {
                        this.player = "Materazzi";
                    }

                    console.log(this.player);
                });

                this.socket.on('win', () => {
                    this.res = "Gagné";
                    this.go = false;
                    console.log(this.player + ' zI win');
                    this.ready = false;
                    this.started = false;
                    this.end = true;

                });
                this.socket.on('lost', () => {
                    console.log(this.player + ' zI lost');
                    this.go = false;


                    this.res = "Perdu";
                    this.ready = false;
                    this.started = false;
                    this.end = true;
                });

                this.socket.on('false_start', () => {
                    console.log(this.player + ' zI false');
                    this.go = false;

                    this.res = "Perdu";
                    this.ready = false;

                    this.started = false;
                    this.end = true;

                });

                this.socket.on('readyAll', () => {
                    console.log('readyAll');
                    this.started = true;
                    if(this.started) {

                        window.addEventListener("keydown", this.actionKeyEvent);
                    }
                    this.started= false;

                });

                this.socket.on('go', () => {
                    this.go = true;
                    this.res = "!";
                });

                this.socket.on('disconnect', function () {
                    this.socket.disconnect();
                });
                /*window.addEventListener("touchend", function listenr() {
                    if (!this.go) {
                        this.socket.emit('attack', 'false_start')
                    } else {
                        this.socket.emit('attack', 'win');
                    }

                    if (this.end) {
                        window.removeEventListener('keydown', listenr);

                    }
                }.bind(this));*/
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
        font-size: 3rem;
        z-index: 999
    }
    .background {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        width: 100%;
        height: 100%;
        background-image: url('../assets/terrain.jpg');
        background-size: cover;
    }

    .start, .res {

        width: 100%;
        text-align: center;
        color: white;
        font-size: 3rem;
        z-index: 999
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
        width: 150px;
    }

    .battle-ready .player2 {
        width: 210px;
    }

    .scenarii {
        justify-content: center;
    }

    .scenarii .player2-win .player1 {
        width: 150px;
        height: 300px;
    }

    .scenarii .player2-win .player2 {
        width: 150px;
    }

</style>
