
import React, { useState, useEffect, useRef } from 'react';

export default function NumberInputPractice() {
  const [targetNumber, setTargetNumber] = useState('');
  const [digitStyles, setDigitStyles] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [modalStartTime, setModalStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [successCount, setSuccessCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateOptions, setDateOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setElapsedTime(((Date.now() - startTime) / 1000).toFixed(2));
      }
    }, 100);
    return () => clearInterval(timer);
  }, [startTime]);

  const generateUniqueNumber = () => {
    const digits = [];
    while (digits.length < 5) {
      const rand = Math.floor(Math.random() * 10);
      if (!digits.includes(rand)) {
        digits.push(rand);
      }
    }
    const newNumber = digits.join('');
    setTargetNumber(newNumber);
    setUserInput('');
    setMessage('');
    setSelectedDate('');
    const now = Date.now();
    setStartTime(now);
    setModalStartTime(null);
    setElapsedTime(0);
    inputRef.current.focus();

    const styles = digits.map(() => ({
      fontSize: `${Math.floor(Math.random() * 10 + 14)}px`,
      transform: `rotate(${Math.floor(Math.random() * 21 - 10)}deg)`
    }));
    setDigitStyles(styles);
  };

  const generateDateOptions = () => {
    const today = new Date();
    const options = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      options.push(date.toISOString().split('T')[0]);
    }
    setDateOptions(options);
  };

  useEffect(() => {
    generateUniqueNumber();
    generateDateOptions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    if (userInput === targetNumber && selectedDate) {
      setShowModal(true);
      setModalStartTime(Date.now());
    } else {
      setMessage('❌ 숫자나 날짜가 올바르지 않아요. 다시 시도!');
    }
  };

  const handleConfirm = () => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    if (duration <= 5) {
      setTimeTaken(duration.toFixed(2));
      setMessage('✅ 성공! 다음 숫자로 이동합니다.');
      setSuccessCount(prev => prev + 1);
    } else {
      setMessage('❌ 시간 초과! 다시 시도하세요.');
    }
    setShowModal(false);
    setTimeout(() => {
      generateUniqueNumber();
      setTimeTaken(null);
    }, 1000);
  };

  const handleReset = () => {
    setSuccessCount(0);
    setAttempts(0);
    generateUniqueNumber();
  };

  const renderDigitImages = () => {
    return targetNumber.split('').map((digit, idx) => (
      <div
        key={idx}
        style={{
          ...digitStyles[idx],
          width: '20px',
          height: '28px',
          backgroundColor: '#ffffff'
        }}
        className="mx-[1px] font-bold flex items-center justify-center rounded shadow-sm"
      >
        {digit}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">🔢 숫자 입력 연습기</h1>
        <p className="text-center text-gray-500 text-sm mb-4">경과 시간: {elapsedTime}초</p>

        {/* 보안문자 영역 */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex justify-center">{renderDigitImages()}</div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="\\d{5}"
            maxLength={5}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="ml-4 border border-gray-300 rounded-xl px-4 py-2 text-center text-lg w-32"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            확인
          </button>
        </div>

        {/* 날짜 선택 버튼들 - 세로 배열 */}
        <div className="flex flex-col items-start pl-4 mb-4 border-t pt-4">
          {dateOptions.map((date, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={\\`text-sm underline mb-1 \\${selectedDate === date ? 'text-blue-600 font-semibold' : 'text-black'}\\`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* 결과 및 통계 */}
        {message && <p className="mt-2 text-center text-lg font-semibold">⏱️ {message}</p>}
        {timeTaken && <p className="text-center text-sm text-gray-500">입력 시간: {timeTaken}초</p>}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>✔️ 성공 횟수: {successCount} / 시도 횟수: {attempts}</p>
        </div>

        <button
          onClick={handleReset}
          className="mt-4 text-sm text-blue-500 hover:underline block mx-auto"
        >
          초기화
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="mb-4">정말로 제출하시겠습니까?</p>
            <button
              onClick={handleConfirm}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              예
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

