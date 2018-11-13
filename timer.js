'strict mode'
export class Timer {
    startTimer(e){
        e.timedEvent = e.time.addEvent({ delay: 10, callback: this.updateTime, callbackScope: e});
        return e
    }

    updateTime() {
        this.displayTime += 1
        this.timedEvent.reset({ delay: 10, callback: this.updateTime, callbackScope: this, repeat: 1});
        this.scoreText.setText('Time: '+this.displayTime.toString()+"ms");
        this.scoreText.setStyle({ fontSize: '64px', fill: '#fff', fontWeight: 'bold' });

        return this
    }
}