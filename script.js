document.addEventListener('DOMContentLoaded', () => {
    const timePicker = document.querySelector('.timePicker');
    const selectedTime = document.querySelector('.selectedTime');
    const selectBtn = document.querySelector('.selectBtn');
    let totalSeconds;
    let countdownInterval;
    let sound;

    soundManager.setup({
        url: '/path/to/swf-files/',
        onready: function() {
            sound = soundManager.createSound({
                id: 'meditationSound',
                url: './assets/song.mp3',
                autoLoad: true,
                autoPlay: false,
                volume: 40,
                onfinish: function() {
                    this.play();
                }
            });
        },
        ontimeout: function() {
            console.error('SoundManager setup failed!');
        }
    });

    const handleClick = () => {
        let value = timePicker.value;
        if (/^\d{1,2}:\d{2}$/.test(value)) {
            let [minutes, seconds] = value.split(':').map(Number);
            totalSeconds = minutes * 60 + seconds;
            if (totalSeconds < 1800) {
                updateDisplay();
                timePicker.style.display = 'none';
                clearInterval(countdownInterval);
                countdownInterval = setInterval(countdown, 1000);
                sound.play();
            } else {
                selectedTime.textContent = 'Time overrun. Reload the page and try again.';
            }
        } else {
            selectedTime.textContent = 'Invalid format. Please use mm:ss. Reload the page and try again.';
        }
    };

    const countdown = () => {
        if (totalSeconds > 0) {
            totalSeconds -= 1;
            updateDisplay();
        } else {
            clearInterval(countdownInterval);
            sound.stop();
            resetUI();
        }
    };

    const updateDisplay = () => {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let currentTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        selectedTime.style.display = 'flex';
        selectedTime.style.alignItems = 'center';
        selectedTime.textContent = currentTime;
    };

    const resetUI = () => {
        selectedTime.style.display = 'none';
        timePicker.style.display = 'flex';
        timePicker.value = '';
    };

    selectBtn.addEventListener('click', handleClick);
});
