import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GRAVITY = 0.3;
const FLAP_STRENGTH = -6;
const PIPE_WIDTH = 50;
const VOUCHER_SIZE = 30;
const DIFFICULTY_THRESHOLD = 40; // Mức độ khó khi đạt 40
const SUPER_DIFFICULTY_THRESHOLD = 100; // Mức độ siêu khó khi đạt 100
const ULTRA_DIFFICULTY_THRESHOLD = 150; // Mức độ siêu khó khi đạt 150

const FlappyVoucher = () => {
  const [voucherY, setVoucherY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pipeSpeed, setPipeSpeed] = useState(3.5); // Quản lý tốc độ cột
  const gameRef = useRef(null);
  const scoreRef = useRef(score); // Sử dụng useRef để giữ giá trị score cập nhật liên tục

  // Cập nhật lại scoreRef mỗi khi score thay đổi
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Cập nhật trạng thái game
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setVoucherY((prev) => prev + velocity);
      setVelocity((prev) => prev + GRAVITY);
      setPipes((prevPipes) => {
        return prevPipes.map((pipe) => {
          // Cộng điểm khi cột đi qua vị trí 50 (vị trí của voucher)
          if (pipe.x === 50) {
            setScore((prev) => prev + 5);
          }
          return { ...pipe, x: pipe.x - pipeSpeed };
        }).filter(pipe => pipe.x > -PIPE_WIDTH);
      });
    }, 30);

    return () => clearInterval(interval);
  }, [velocity, gameOver, pipeSpeed]);

  useEffect(() => {
    if (gameOver) return;

    const pipeInterval = setInterval(() => {
      const randomHeight = Math.floor(Math.random() * 150) + 80;
      setPipes((prev) => [...prev, { x: 400, height: randomHeight }]);
    }, 2500);

    return () => clearInterval(pipeInterval);
  }, [gameOver]);

  // Kiểm tra và cập nhật tốc độ cột theo điểm số
  useEffect(() => {
    if (scoreRef.current >= ULTRA_DIFFICULTY_THRESHOLD && pipeSpeed !== 15) {
      setPipeSpeed(7); // Cột di chuyển rất nhanh
    } else if (scoreRef.current >= SUPER_DIFFICULTY_THRESHOLD && pipeSpeed !== 8) {
      setPipeSpeed(7); // Cột di chuyển nhanh
    } else if (scoreRef.current >= DIFFICULTY_THRESHOLD && pipeSpeed !== 5) {
      setPipeSpeed(5); // Cột di chuyển bình thường
    }
  }, [score]);

  useEffect(() => {
    pipes.forEach(pipe => {
      if (
        (pipe.x < 50 + VOUCHER_SIZE && pipe.x + PIPE_WIDTH > 50) &&
        (voucherY < pipe.height || voucherY + VOUCHER_SIZE > pipe.height + 180)
      ) {
        setGameOver(true);
      }
    });

    if (voucherY > 400) {
      setGameOver(true);
    }
  }, [voucherY, pipes]);

  const flap = () => {
    if (!gameOver) {
      setVelocity(FLAP_STRENGTH);
    }
  };

  const restartGame = () => {
    setVoucherY(200);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setPipeSpeed(3.5); // Đặt lại tốc độ cột
  };

  // Hàm để xác định màu nền tùy theo điểm
  const getBackgroundColor = () => {
    if (score >= ULTRA_DIFFICULTY_THRESHOLD) {
      return "bg-green-300"; // Màu nền khi đạt 150 điểm
    } else if (score >= SUPER_DIFFICULTY_THRESHOLD) {
      return "bg-green-500"; // Màu nền khi đạt 100 điểm
    } else if (score >= DIFFICULTY_THRESHOLD) {
      return "bg-green-300"; // Màu nền khi đạt 40 điểm
    }
    return "bg-blue-300"; // Màu nền mặc định
  };

  return (
    <div
      ref={gameRef}
      className={`relative rounded-2xl overflow-hidden w-[400px] h-[400px] ${getBackgroundColor()} overflow-hidden flex items-center justify-center`}
      onClick={flap}
    >
      <motion.div
        className="absolute bg-yellow-500 w-[30px] h-[30px] rounded-full"
        style={{ top: voucherY, left: 50 }}
        initial={{ scale: 1 }}
        animate={gameOver ? { scale: 2, opacity: 0 } : { scale: 1 }}
        transition={{ repeat: 0, duration: 0.5 }}
      ></motion.div>
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <motion.div
            className="absolute bg-green-600 w-[50px]"
            style={{ height: pipe.height, top: 0, left: pipe.x }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
          <motion.div
            className="absolute bg-green-600 w-[50px]"
            style={{ height: 400 - pipe.height - 180, bottom: 0, left: pipe.x }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </React.Fragment>
      ))}
      {gameOver && (
        <motion.div
          className="absolute bg-white p-4 rounded shadow-lg text-center"
        >
          <p className="font-bold">Game Over!</p>
          <p>Score: {score}</p>
          <button className="mt-2 p-2 bg-red-500 text-white rounded" onClick={restartGame}>Restart</button>
        </motion.div>
      )}
      <div className="absolute top-2 left-2 text-white font-bold">Score: {score}</div>
    </div>
  );
};

export default FlappyVoucher;
