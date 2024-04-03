import React, { useState } from 'react';
import './Calendrier.css'
import tc from '../Assets/tc1.jpg'

// Calendar component
function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Function to handle start hour selection
  const handleStartHourSelect = (hour) => {
    setStartHour(hour);
    // Reset end hour if it's before the new start hour
    if (endHour && parseInt(hour) >= parseInt(endHour)) {
      setEndHour('');
    }
  };

  // Function to handle end hour selection
  const handleEndHourSelect = (hour) => {
    setEndHour(hour);
    // Reset start hour if it's after the new end hour
    if (startHour && parseInt(hour) <= parseInt(startHour)) {
      setStartHour('');
    }
  };

  // Function to handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  // Function to handle reservation submission
  // Function to handle reservation submission
  const handleSubmit = () => {
    setReservationSubmitted(false);
    setErrorMessage('');
    // Send reservation data to the backend server
    fetch('http://localhost:5000/api/reserve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: selectedDate,
        startHour: startHour,
        endHour: endHour,
        room: selectedRoom
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Handle response from the server
      if (data.success) {
        setReservationSubmitted(true);
                // Reset l'erreur précédente s'il y en avait une
                setErrorMessage('');
            } else {
                // Afficher le message d'erreur si la salle est déjà réservée
                setErrorMessage('The selected time slot is not available. Please choose another one.');
            }
    })
    .catch(error => {
      // Handle error
      console.error('Error submitting reservation:', error);
      setErrorMessage('An error occurred while processing your request.');
    });
  };


  // Generate an array of hours from 8 to 20
  const hours = [];
  for (let i = 8; i <= 20; i++) {
    hours.push(i);
  }

  // Sample rooms data
  const rooms = ['Floor 1 - TD D', 'Floor 1 - TD C', 'Floor 2 - Reunion', 'Floor 2 - Radiocom'];

  return (
    <div className="main-layout">
        <div className="calendar-container">
            <div className="calendar-header">
                <h2>Room Reservation</h2>
            </div>
            <div className="calendar-input-section">
                <div>
                    <h3>Select Date:</h3>
                    <input type="date" className="calendar-input" onChange={(e) => handleDateSelect(e.target.value)} />
                </div>
                <div>
                    <h3>Select Start Hour:</h3>
                    <select className="calendar-input" value={startHour} onChange={(e) => handleStartHourSelect(e.target.value)}>
                        <option value="">-- Select Start Hour --</option>
                        {hours.map(hour => (
                            <option key={hour} value={hour}>{`${hour}:00`}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3>Select End Hour:</h3>
                    <select className="calendar-input" value={endHour} onChange={(e) => handleEndHourSelect(e.target.value)}>
                        <option value="">-- Select End Hour --</option>
                        {hours.map(hour => (
                            <option key={hour} value={hour} disabled={parseInt(hour) <= parseInt(startHour)}>
                                {`${hour}:00`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3>Select Room:</h3>
                    <select className="calendar-input" value={selectedRoom} onChange={(e) => handleRoomSelect(e.target.value)}>
                        <option value="">-- Select Room --</option>
                        {rooms.map(room => (
                            <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                </div>
                <div className="image-container"> {/* Conteneur pour l'image */}
        <img src={tc} alt="Room Display" />
      </div>
            </div>
            <button className="calendar-submit-button" onClick={handleSubmit}>Submit Reservation</button>
            {reservationSubmitted && (
                <div className="success-message">
                    <h3>Reservation Submitted Successfully!</h3>
                    <p>Date: {selectedDate}</p>
                    <p>Start Hour: {startHour}:00</p>
                    <p>End Hour: {endHour}:00</p>
                    <p>Room: {selectedRoom}</p>
                </div>
            )}
            {errorMessage && (
                    <div className="error-message">{errorMessage}</div> // Affichage du message d'erreur
                )}
        </div>
    </div>
    

    
);
}

export default Calendar;