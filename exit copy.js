function exitGame() {
    // Stop the timer
    clearInterval(timerInterval);

    // Hide the game components
    document.getElementById('timer').style.display = 'none';
    document.getElementById('score').style.display = 'none';
    document.getElementById('timeUpMessage').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'none';

    // Remove the canvas from the DOM
    document.body.removeChild(canvas);

    // Optionally, show a message that the game is over
    alert('You have exited the game. Goodbye!');
}
