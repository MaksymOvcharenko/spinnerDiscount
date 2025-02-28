import { useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json'; 
import successAnimation from '../assets/success.json';
import styles from "./Spin.module.css";
import logo from "../../public/logo-removebg-preview.png"
function DiscountBox() {
  const [email, setEmail] = useState("");
  const [discount, setDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDiscount, setShowDiscount] = useState(false);

  const fetchDiscount = async () => {
    if (!email.trim()) {
      setError("Введіть email!");
      return;
    }
    
    setIsLoading(true);
    setError(""); 
    setShowDiscount(false);

    try {
      const response = await fetch('https://ivancom-server.onrender.com/wheel/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.status === 400) {
        setIsLoading(false);
        setError("Цей email вже отримав знижку!");
        return;
      }

      const data = await response.json();

      setTimeout(() => {
        setDiscount(data.prize.discount);
        setIsLoading(false);

        // Показати знижку через 3 секунди після анімації
        setTimeout(() => {
          setShowDiscount(true);
        }, 1100);

      }, 2000);
    } catch (error) {
      console.error('Помилка отримання знижки:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <img src={logo}/>
      <input 
        type="email"
        placeholder="Введіть ваш email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}

      <button onClick={fetchDiscount} className={styles.button}>
        Отримати знижку
      </button>

      {/* Анімація загрузки */}
      {isLoading && (
        <Lottie animationData={loadingAnimation} loop style={{ width: 300, height: 300, margin: '20px auto' }} />
      )}

      {/* Анімація успіху */}
      {discount && !isLoading && (
        <div className={styles.contMain}>
          <Lottie 
            loop={false} 
            animationData={successAnimation} 
            style={{ width: 400, height: 400, margin: '20px auto' }} 
          />
          {showDiscount && <div className={styles.cont}><p className={styles.text}>{discount}</p></div>}
        </div>
      )}
    </div>
  );
}

export default DiscountBox;
