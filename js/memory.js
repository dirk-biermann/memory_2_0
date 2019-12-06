Number.prototype.padDigits = function(digits) {
    return Array(Math.max(digits - String(this).length + 1, 0)).join(0) + this;
}

window.onload = function() {
    let newMemory = new Memory(); 
    let cardList = document.getElementsByClassName("memory-card");

    [...cardList].forEach( (card, ind) => {
        newMemory.cardList[ind].domObj = card;
        card.onclick = function() {
                newMemory.clickCard( this.getAttribute("data-id")-1 );
            };
        });

    document.getElementById( "memory-control" ).onclick = function() {
            newMemory.startNewMemory();
        };
}

class Card{
    constructor(btnId){
        this.MODE = { SHOW: 1, HIDE: 2, FIX: 3 };

        this.domObj = null;
        this.cardId = btnId;
        this.displayMode = this.MODE.HIDE;
        this.color = "#000000";
    }

    update(){
        if( this.domObj !== null ){
            switch( this.displayMode ){
                case this.MODE.SHOW: this.domObj.style.backgroundColor = this.color; break;
                case this.MODE.HIDE: this.domObj.style.backgroundColor = "#606060"; break;
                case this.MODE.FIX: this.domObj.style.backgroundColor = "#191919"; break; // this.color + "99"
            }
        }
    }

    showCard(){
        if( this.displayMode === this.MODE.HIDE ){
            this.displayMode = this.MODE.SHOW;
            this.update();
            return true;
        } 
        return false;
    }

    hideCard(){
        if( this.displayMode === this.MODE.SHOW ){
            this.displayMode = this.MODE.HIDE;
            this.update();
            return true;
        } 
        this.update();
        return false;
    }

    fixCard(){
        this.displayMode = this.MODE.FIX;
        return true;
    }

}

class Memory{
    constructor(){
        this.COLORS = [ "#0000FF", "#008000", "#00BFFF", "#FFD700", "#4B0082", "#B22222", "#FF8C00", "#FF00FF", "#008B8B" ];

        this.cardList = [];
        this.cardCount = 16;

        this.cardsOpen = 0
        this.cardsLeft = 16

        this.cardsSelect = [];
        
        this.isStopped = true;
        this.waitForClick = false;
        this.interval = null;
        
        this.runTime = 0;

        this.initCards();
    }

    startGame(){
        // bind func 'updateIslandRacerState' to be available in 'setInterval()'
        this.runTime = 0;
        this.isStopped = false;
        //this.interval = setInterval(this.updateTime, 1000);
    }

    stopGame(){
        this.isStopped = true;
        //clearInterval(this.interval);
    }

    updateTime(){
        let time = `${Number(Math.floor(this.runTime/60)).padDigits(2)}:${Number(Math.floor(this.runTime%60)).padDigits(2)}`;
        document.querySelector("#memory-time span").innerText = time;
    }

    startNewMemory() {
        this.resetCards();
        this.startGame();
    }

    resetCards(){
        this.fillCardsRandom();

        this.cardList.map( card => { card.displayMode = card.MODE.HIDE; card.update(); } );

        this.isStopped = false;
        this.waitForClick = false;
        this.cardsOpen = 0;
        this.cardsLeft = 16;
    }

    fillCardsRandom(){
        let cards = [...Array(16).keys()];
        let cardId = 0;
        let cardColor = 0;

        while( cards.length > 1 ){
            cardId = Math.floor(Math.random() * cards.length);
            this.cardList[cards[cardId]].color = this.COLORS[cardColor];
            cards.splice(cardId,1);
 
            cardId = Math.floor(Math.random() * cards.length);
            this.cardList[cards[cardId]].color = this.COLORS[cardColor];
            cards.splice(cardId,1);

            cardColor++;
        }
    }

    initCards(){
        for( let i=0; i<this.cardCount; i++ ){
            this.cardList.push( new Card(i) );
        }
        this.resetCards();
    }

    clickCard(id){
        let cardObj = this.cardList[id];

        if( this.isStopped === true || this.waitForClick === true ) return;

        if( this.cardsOpen < 2 ) {
            if( cardObj.showCard() === true ){
                this.cardsSelect.push( cardObj );
                this.cardsOpen++;
            }
        }

        if( this.cardsOpen === 2 ) { // check on match 
            if( this.checkCards() ) {
                this.waitForClick = true;
                this.sleep(1000).then( () => { this.clearSelectedCards(); } );

                this.stopGame();
                return;
            }
            this.cardsOpen++;
        }

        if( this.cardsOpen === 3 ){
            this.waitForClick = true;
            this.sleep(1000).then( () => { this.clearSelectedCards(); } );

            this.cardsSelect = [];
            this.cardsOpen = 0;
        }
    }

    clearSelectedCards(){
        this.cardList.map( card => { card.hideCard(); });
        this.waitForClick = false;
    }

    checkCards(){
        if( this.cardsSelect[0].color === this.cardsSelect[1].color) {
            this.cardsSelect[0].fixCard();
            this.cardsSelect[1].fixCard();
            this.cardsLeft -= 2;
        }
        return (this.cardsLeft === 0);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
