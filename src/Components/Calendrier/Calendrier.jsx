/*// Calendrier.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importez le style par défaut

const Calendrier = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <h2>Mon Calendrier</h2>
      <Calendar
        onChange={onChange}
        value={date}
        view="day" // Configure le calendrier pour afficher le vue par jour
      />
      <p>Date sélectionnée: {date.toDateString()}</p>
    </div>
  );
};

export default Calendrier;*/
