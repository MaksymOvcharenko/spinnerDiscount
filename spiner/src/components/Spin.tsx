import { useMemo, useState } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';
import styles from "./Spin.module.css";
import logo from "../../public/logo-removebg-preview.png";

type WheelSegment = {
  label: string;
  wheelLabel: string;
  code: string;
  weight: string;
  prize: string;
};

const WHEEL_SEGMENTS: WheelSegment[] = [
  { weight: "35%", label: "Безкоштовна коробка", wheelLabel: "Коробка", code: "KOROBKA", prize: "Безкоштовна коробка" },
  { weight: "20%", label: "Знижка -20 зл", wheelLabel: "Знижка -20 зл", code: "GALAS20", prize: "Знижка -20 зл" },
  { weight: "15%", label: "Знижка -25 зл", wheelLabel: "Знижка -25 зл", code: "GALAS25", prize: "Знижка -25 зл" },
  { weight: "10%", label: "Знижка -30 зл", wheelLabel: "Знижка -30 зл", code: "GALAS30", prize: "Знижка -30 зл" },
  { weight: "7%", label: "Безкоштовна доставка кур'єром НП в Україні", wheelLabel: "Доставка Нова Пошта", code: "KURIER UKR", prize: "Безкоштовна доставка курʼєром НП в Україні" },
  { weight: "5%", label: "Знижка -35 зл", wheelLabel: "Знижка -35 зл", code: "GALAS35", prize: "Знижка -35 зл" },
  { weight: "3%", label: "Безкоштовний ВІДБІР кур'єром по Кракову", wheelLabel: "Відбір по Кракову", code: "VIDBIR", prize: "Безкоштовний ВІДБІР курʼєром по Кракову" },
  { weight: "3%", label: "Безкоштовна ДОСТАВКА кур'єром по Кракову", wheelLabel: "Доставка по Кракову", code: "DOSTAVKA", prize: "Безкоштовна ДОСТАВКА курʼєром по Кракову" },
  { weight: "2%", label: "Знижка -40 зл", wheelLabel: "Знижка -40 зл", code: "GALAS40", prize: "Знижка -40 зл" },
];

const SEGMENT_COLORS = [
  "#155eef",
  "#3b82f6",
  "#1d4ed8",
  "#60a5fa",
  "#2563eb",
  "#93c5fd",
  "#1e40af",
  "#38bdf8",
  "#0f766e",
];

const WHEEL_SIZE = 520;
const CENTER = WHEEL_SIZE / 2;
const OUTER_RADIUS = 228;
const INNER_RADIUS = 66;
const SPIN_DURATION_MS = 5200;

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
  const radians = (angle - 90) * (Math.PI / 180);

  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
};

const createSegmentPath = (startAngle: number, endAngle: number) => {
  const outerStart = polarToCartesian(CENTER, CENTER, OUTER_RADIUS, startAngle);
  const outerEnd = polarToCartesian(CENTER, CENTER, OUTER_RADIUS, endAngle);
  const innerStart = polarToCartesian(CENTER, CENTER, INNER_RADIUS, startAngle);
  const innerEnd = polarToCartesian(CENTER, CENTER, INNER_RADIUS, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

const normalizeText = (value: string) =>
  value
    .replace(/[`'’ʼ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const splitWheelLabel = (label: string) => {
  const words = label.split(" ");

  if (words.length === 1) {
    return [label];
  }

  const midpoint = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, midpoint).join(" ");
  const secondLine = words.slice(midpoint).join(" ");

  return secondLine ? [firstLine, secondLine] : [firstLine];
};

const getSegmentIndex = (prizeName: string, code: string) => {
  const normalizedPrize = normalizeText(prizeName);
  const normalizedCode = normalizeText(code);

  return WHEEL_SEGMENTS.findIndex((segment) => {
    return (
      normalizeText(segment.prize) === normalizedPrize ||
      normalizeText(segment.label) === normalizedPrize ||
      normalizeText(segment.code) === normalizedCode
    );
  });
};

const getSegmentByPrize = (prizeName: string, code: string) => {
  const segmentIndex = getSegmentIndex(prizeName, code);

  return segmentIndex === -1 ? null : WHEEL_SEGMENTS[segmentIndex];
};

function DiscountBox() {
  const [email, setEmail] = useState("");
  const [prizeName, setPrizeName] = useState<string | null>(null);
  const [prizeDescription, setPrizeDescription] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [uiMessage, setUiMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const slices = useMemo(() => {
    const angleSize = 360 / WHEEL_SEGMENTS.length;

    return WHEEL_SEGMENTS.map((segment, index) => {
      const startAngle = index * angleSize;
      const endAngle = startAngle + angleSize;
      const midAngle = startAngle + angleSize / 2;
      const textPosition = polarToCartesian(CENTER, CENTER, 154, midAngle);

      return {
        ...segment,
        index,
        midAngle,
        path: createSegmentPath(startAngle, endAngle),
        textPosition,
        textRotation: midAngle + 90,
        labelLines: splitWheelLabel(segment.wheelLabel),
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
      };
    });
  }, []);

  const fetchDiscount = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Введіть email!");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Некоректний email!");
      return;
    }

    setIsLoading(true);
    setIsSpinning(false);
    setError("");
    setShowResult(false);
    setPrizeName(null);
    setPrizeDescription(null);
    setPromoCode(null);
    setUiMessage("");

    try {
      // const response = await fetch('https://ivancom-server.onrender.com/wheel/spin', {
      const response = await fetch('http://localhost:3000/wheel/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsLoading(false);
        setError(data.message || "Помилка при обертанні колеса");
        return;
      }

      if (!data.prize?.success) {
        setIsLoading(false);
        setError(data.prize?.message || "Помилка при обертанні колеса");
        return;
      }

      const nextPrizeName = data.prize.prize ?? "";
      const nextPromoCode = data.prize.promoCode ?? "";
      const segment = getSegmentByPrize(nextPrizeName, nextPromoCode);
      const segmentIndex = segment ? WHEEL_SEGMENTS.findIndex((item) => item.code === segment.code) : -1;

      if (segmentIndex === -1) {
        setIsLoading(false);
        setError("Не вдалося знайти сегмент для цього призу");
        return;
      }

      const segmentAngle = 360 / WHEEL_SEGMENTS.length;
      const segmentCenter = segmentIndex * segmentAngle + segmentAngle / 2;
      const finalNormalizedRotation = (360 - segmentCenter) % 360;
      const currentNormalizedRotation = ((rotation % 360) + 360) % 360;
      const extraTurns = 5 * 360;
      const rotationDelta = extraTurns + ((finalNormalizedRotation - currentNormalizedRotation + 360) % 360);

      setPrizeName(nextPrizeName);
      setPrizeDescription(segment?.label ?? nextPrizeName);
      setPromoCode(nextPromoCode);
      setUiMessage(data.prize.message ?? "");
      setIsLoading(false);
      setIsSpinning(true);
      setRotation((current) => current + rotationDelta);

      window.setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
      }, SPIN_DURATION_MS);
    } catch (fetchError) {
      console.error('Помилка отримання знижки:', fetchError);
      setIsLoading(false);
      setError("Помилка при обертанні колеса");
    }
  };

  return (
    <div className={styles.body}>
      <img src={logo} className={styles.logo} />

      <div className={styles.form}>
        <input
          type="email"
          placeholder="Введіть ваш email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          disabled={isLoading || isSpinning}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          onClick={fetchDiscount}
          className={styles.button}
          disabled={isLoading || isSpinning}
        >
          {isLoading ? "ШУКАЄМО ПРИЗ..." : isSpinning ? "КРУТИМО..." : "ОТРИМАТИ ЗНИЖКУ"}
        </button>
      </div>

      <div className={styles.wheelSection}>
        {isLoading && (
          <div className={styles.loadingWrap}>
            <Lottie animationData={loadingAnimation} loop style={{ width: 180, height: 180 }} />
          </div>
        )}

        <div className={styles.wheelFrame}>
          {showResult && prizeName && promoCode && (
            <div className={styles.resultCard} id="spin-result-card">
              {uiMessage && <p className={styles.resultMessage}>{uiMessage}</p>}
              <p className={styles.resultCode}>{promoCode}</p>
              <p className={styles.resultLabel}>{prizeDescription ?? prizeName}</p>
            </div>
          )}

          <div className={styles.pointer} />

          <div
            className={styles.wheel}
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? `${SPIN_DURATION_MS}ms` : "0ms",
            }}
          >
            <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className={styles.wheelSvg} aria-hidden="true">
              <circle cx={CENTER} cy={CENTER} r={246} className={styles.outerRing} />
              <circle cx={CENTER} cy={CENTER} r={232} className={styles.innerRing} />

              {slices.map((slice) => (
                <g key={slice.code}>
                  <path d={slice.path} fill={slice.color} stroke="#ffffff" strokeWidth="2.5" />

                  <g
                    transform={`translate(${slice.textPosition.x} ${slice.textPosition.y}) rotate(${slice.textRotation})`}
                    className={styles.segmentGroup}
                  >
                    <text className={styles.codeText} textAnchor="middle">
                      {slice.labelLines.map((line, index) => (
                        <tspan key={`${slice.code}-${index}`} x="0" dy={index === 0 ? "-0.35em" : "1.1em"}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                </g>
              ))}

              <circle cx={CENTER} cy={CENTER} r={56} className={styles.centerCap} />
              <circle cx={CENTER} cy={CENTER} r={22} className={styles.centerDot} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountBox;
