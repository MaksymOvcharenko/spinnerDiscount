
// import React, { useState, useRef } from 'react';

// const MySpinWheel = () => {
//   const [email, setEmail] = useState('');
//   const [selectedDiscount, setSelectedDiscount] = useState(null);
//   const [isSpinning, setIsSpinning] = useState(false);
//   const wheelRef = useRef(null);

//   const segments = [
//     { segmentText: '10%', segColor: 'red' },
//     { segmentText: '20%', segColor: 'blue' },
//     { segmentText: '30%', segColor: 'green' },
//     { segmentText: '40%', segColor: 'purple' },
//     { segmentText: '50%', segColor: 'orange' },
//     { segmentText: '100%', segColor: 'gold' },
//   ];

//   const fetchDiscount = async () => {
//     try {
//       const response = await fetch('https://ivancom-server.onrender.com/wheel/spin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();
//       if (data.success && data.prize) {
//         return data.prize.discount;
//       }
//     } catch (error) {
//       console.error('Помилка отримання знижки:', error);
//     }
//     return null;
//   };

//   const handleSpin = async () => {
//     if (isSpinning || !email) {
//       alert('Введіть email перед обертанням!');
//       return;
//     }

//     setIsSpinning(true);
//     const serverDiscount = await fetchDiscount();
//     if (serverDiscount) {
//       setSelectedDiscount(serverDiscount);
      
//       const segmentIndex = segments.findIndex(seg => seg.segmentText === serverDiscount);
//       if (segmentIndex !== -1) {
//         const degreesPerSegment = 360 / segments.length;
//         const randomOffset = Math.random() * (degreesPerSegment - 5) + 2.5;
//         const finalRotation = 360 * 5 + segmentIndex * degreesPerSegment + randomOffset;
        
//         if (wheelRef.current) {
//           wheelRef.current.style.transition = 'transform 3s ease-out';
//           wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
//         }

//         setTimeout(() => {
//           setIsSpinning(false);
//         }, 3000);
//       }
//     } else {
//       setIsSpinning(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center' }}>
//       <input
//         type="email"
//         placeholder="Введіть ваш email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         disabled={isSpinning}
//         style={{ marginBottom: '10px', padding: '5px' }}
//       />
//       <div
//         ref={wheelRef}
//         style={{
//           width: '200px',
//           height: '200px',
//           borderRadius: '50%',
//           border: '5px solid black',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           margin: '20px auto',
//           background: 'conic-gradient(red 0deg 60deg, blue 60deg 120deg, green 120deg 180deg, purple 180deg 240deg, orange 240deg 300deg, gold 300deg 360deg)'
//         }}
//       >
//         🎯
//       </div>
//       <button onClick={handleSpin} disabled={isSpinning}>Крутити</button>
//       {selectedDiscount && <p>🎉 Ваша знижка: {selectedDiscount}</p>}
//     </div>
//   );
// };

// export default MySpinWheel;
import React, { useState, useRef } from 'react';

const MySpinWheel = () => {
  const [email, setEmail] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segments = [
    { text: '10%', color: 'red' },
    { text: '20%', color: 'blue' },
    { text: '30%', color: 'green' },
    { text: '40%', color: 'purple' },
    { text: '50%', color: 'orange' },
    { text: '100%', color: 'gold' },
  ];

  

  const handleSpin = async () => {
    if (isSpinning || !email) {
      alert('Введіть email перед обертанням!');
      return;
    }

    setIsSpinning(true);
    const serverDiscount = await fetchDiscount();
    if (!serverDiscount) {
      setIsSpinning(false);
      return;
    }

    setSelectedDiscount(serverDiscount);

    const segmentIndex = segments.findIndex(seg => seg.text === serverDiscount);
    if (segmentIndex !== -1) {
      const degreesPerSegment = 360 / segments.length;
      const finalAngle = segmentIndex * degreesPerSegment;
      const fullRotations = 3 * 360; // Мінімум 3 повних оберти
      const totalRotation = fullRotations + finalAngle;

      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 3s ease-out';
        wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
      }

      setTimeout(() => {
        setIsSpinning(false);
      }, 3000);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', position: 'relative' }}>
      <input
        type="email"
        placeholder="Введіть ваш email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSpinning}
        style={{ marginBottom: '10px', padding: '10px', fontSize: '16px', width: '250px', borderRadius: '8px', border: '1px solid #ccc' }}
      />
      
      {/* Вказівник */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '30px solid red',
          position: 'absolute',
          top: '160px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      ></div>

      {/* Колесо */}
      <div
        ref={wheelRef}
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px auto',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          background: 'conic-gradient(red 0deg 60deg, blue 60deg 120deg, green 120deg 180deg, purple 180deg 240deg, orange 240deg 300deg, gold 300deg 360deg)',
          transform: 'rotate(0deg)', // Початковий стан
        }}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              transform: `rotate(${(360 / segments.length) * index}deg) translate(110px)`,
              transformOrigin: 'center center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',
            }}
          >
            {segment.text}
          </div>
        ))}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        style={{
          padding: '12px 20px',
          fontSize: '18px',
          borderRadius: '10px',
          backgroundColor: isSpinning ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background 0.3s',
        }}
      >
        Крутити
      </button>
      {selectedDiscount && <p style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '15px' }}>🎉 Ваша знижка: {selectedDiscount}</p>}
    </div>
  );
};

export default MySpinWheel;

import React, { useRef, useState } from 'react';
import './Wheel.css';

const segments = [
  { text: '10%', color: '#f94144' },
  { text: '20%', color: '#f3722c' },
  { text: '30%', color: '#f9c74f' },
  { text: '40%', color: '#90be6d' },
  { text: '50%', color: '#577590' },
  { text: '0%', color: '#277da1' },
];

const WheelOfFortune = () => {
  const wheelRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState(null);

  const spinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

      // Запит на сервер для отримання виграної знижки
      const fetchDiscount = async () => {
    try {
      const response = await fetch('https://ivancom-server.onrender.com/wheel/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success && data.prize) {
        return data.prize.discount;
      }
    } catch (error) {
      console.error('Помилка отримання знижки:', error);
    }
    return null;
  };
    const response = await fetchDiscount(); // заміни на свій ендпоінт
    const data = await response.json();
    const serverDiscount = data.discount;
    setPrize(serverDiscount);

    // Знаходимо сегмент, на якому має зупинитися колесо
    const segmentIndex = segments.findIndex(seg => seg.text === serverDiscount);
    const degreesPerSegment = 360 / segments.length;
    const randomOffset = Math.random() * (degreesPerSegment - 5) + 2.5;

    // Обчислюємо загальний кут обертання
    const fullRotations = 3 * 360;
    const totalRotation = fullRotations + segmentIndex * degreesPerSegment + randomOffset;

    // Запускаємо анімацію
    wheelRef.current.style.transition = 'transform 3s ease-out';
    wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="wheel-container">
      <div className="wheel" ref={wheelRef}>
        {segments.map((seg, index) => (
          <div
            key={index}
            className="segment"
            style={{ backgroundColor: seg.color, transform: `rotate(${index * (360 / segments.length)}deg)` }}
          >
            {seg.text}
          </div>
        ))}
      </div>
      <div className="pointer" />
      <button onClick={spinWheel} disabled={isSpinning}>Крутити</button>
      {prize && <p>Ви виграли {prize} знижки!</p>}
    </div>
  );
};

export default WheelOfFortune;
