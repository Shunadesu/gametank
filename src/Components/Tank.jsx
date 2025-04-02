import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TankGame = ({isShow, setIsShow}) => {
  const [targets, setTargets] = useState(() => {
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
      id: index + 1,
      x: -200 + index * 100,
      y: 400,
      fallen: false,
      fallProgress: 0,
      speedX: Math.random() * 2 + 1, // Tốc độ di chuyển theo chiều ngang
      speedY: Math.random() * 2 + 1, // Tốc độ di chuyển theo chiều dọc
    }));
  });
  // const [isShow, setIsShow] = useState(true) // sunny checking something
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState(5);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [canShoot, setCanShoot] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [scoreAnimations, setScoreAnimations] = useState([]);

  const [barrelMove, setBarrelMove] = useState(0);  // Trạng thái nòng súng di chuyển
  const shootBullet = () => {
    if (!canShoot || gameOver) return;
    if (!gameStarted) setGameStarted(true);
  
    setCanShoot(false);
    setTimeout(() => setCanShoot(true), 500);
  
    const offsetX = Math.sin((angle * Math.PI) / 180) * 150;
    const offsetY = Math.cos((angle * Math.PI) / 180) * 150;
  
    // Tạo hiệu ứng "dựt" nòng súng
    setBarrelMove(10);  // Di chuyển nòng súng lên
    setTimeout(() => setBarrelMove(0), 100);  // Trở lại vị trí cũ sau 100ms
  
    setBullets((prev) => [...prev, { x: offsetX, y: offsetY, angle }]);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => {
        const newAngle = prev + direction;
        if (newAngle > 40 || newAngle < -40) setDirection(-direction);
        return newAngle;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + Math.sin((bullet.angle * Math.PI) / 180) * 50,
            y: bullet.y + Math.cos((bullet.angle * Math.PI) / 180) * 50,
          }))
          .filter((bullet) => {
            let hit = false;
            setTargets((prevTargets) =>
              prevTargets.map((target) => {
                const isHit =
                  bullet.x >= target.x - 30 &&
                  bullet.x <= target.x + 30 &&
                  bullet.y >= target.y - 30 &&
                  bullet.y <= target.y + 30;

                if (!target.fallen && isHit) {
                  hit = true;
                  setScore((prev) => prev + 10);

                  // 🌟 Thêm hiệu ứng cộng điểm
                  setScoreAnimations((prev) => [
                    ...prev,
                    { id: Date.now(), x: target.x, y: target.y },
                  ]);

                  return { ...target, fallen: true, fallProgress: 0 };
                }
                return target;
              })
            );
            return !hit && bullet.x > -500 && bullet.x < 500 && bullet.y > -500 && bullet.y < 500;
          })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargets((prevTargets) =>
        prevTargets
          .map((target) => {
            if (target.fallen && target.fallProgress < 100) {
              return { ...target, fallProgress: target.fallProgress + 5 };
            }
            return target;
          })
          .filter((target) => target.fallProgress < 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (targets.length === 0) {
      setTargets(
        Array.from({ length: Math.floor(Math.random() * 7) + 1 }, (_, index) => ({
          id: index + 1,
          x: -200 + index * 100,
          y: 400,
          fallen: false,
          fallProgress: 0,
          speedX: Math.random() * 3 + 1, // Tốc độ di chuyển theo chiều ngang
          speedY: Math.random() * 2 + 1, // Tốc độ di chuyển theo chiều dọc
        }))
      );
    }
  }, [targets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargets((prevTargets) =>
        prevTargets.map((target) => {
          if (target.fallen) return target;
  
          // Giới hạn mục tiêu chỉ di chuyển trong 50% phía trên
          let newX = target.x + target.speedX;
          let newY = target.y + target.speedY;
  
          // Nếu mục tiêu vượt quá 50% màn hình, đảo chiều
          if (newY > 450) {
            target.speedY = -Math.abs(target.speedY); // Di chuyển lên
          }
          if (newY < 200) {
            target.speedY = Math.abs(target.speedY); // Di chuyển xuống
          }
  
          // Đảo hướng khi chạm biên
          if (newX > 250 || newX < -250) target.speedX = -target.speedX;
  
          return { ...target, x: newX, y: newY };
        })
      );
    }, 50);
  
    return () => clearInterval(interval);
  }, []);
   

  useEffect(() => {
    if (score >= 50) {
      // Tăng độ khó khi điểm >= 50
      setTargets((prevTargets) =>
        prevTargets.map((target) => ({
          ...target,
          speedX: target.speedX + 1, // Tăng tốc độ di chuyển
          speedY: target.speedY + 1,
        }))
      );
    }
  }, [score]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setGameStarted(false);
    setTargets(
      Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => ({
        id: index + 1,
        x: -200 + index * 100,
        y: 400,
        fallen: false,
        fallProgress: 0,
        speedX: Math.random() * 2 + 1, // Tốc độ di chuyển ngẫu nhiên
        speedY: Math.random() * 2 + 1,
      }))
    );
    setBullets([]);
  };


  if (isShow == true)
  return (
  <div className="fixed inset-0 z-[100]">

    {/* Overlay */}
    <div className='w-full h-full bg-black bg-opacity-50 absolute z-10' />
    <div className="w-full h-full p-4 mb-4 relative z-20 flex flex-col justify-center items-center">
        <div className='p-4 bg-white flex gap-4 flex-col justify-center items-center relative rounded-2xl'>
            <div className='grid grid-cols-3 w-full'>
            
              <div className='text-xl font-bold text-red-600 px-2 py-1 flex items-center justify-start'>
              Score: {score}
              </div>

              <div className='flex flex-col gap-2 justify-center items-center'>
                <h1 className="text-xl font-bold">Tank Game </h1>
                <h2  className="text-lg">Time Left: {timeLeft}s</h2>
              </div>

              <div className='flex justify-end items-center'>
                <div 
                  onClick={() => setIsShow(!isShow)}
                  className=' w-[40px] h-[40px] cursor-pointer border rounded-[100%] px-2 py-1  hover:opacity-75 hover:bg-amber-200 transition-all 0.3s ease-in text-center'>
                    x
                </div>
              </div>
            </div>

            
            <div className="relative w-[550px] h-[550px] rounded-lg overflow-hidden shadow-lg bg-green-200" onClick={shootBullet}>
              <img src="https://beta-api.bachlongmobile.com/media/MageINIC/bannerslider/nen.jpg" alt="" className='w-full h-full object-contain'/>

            {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
                <h2 className="text-4xl font-bold text-white">Final Score: {score}</h2>
                <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Chơi Lại</button>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Lấy Voucher</button>
                </div>
            )}
            {/* Xe tăng */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                {/* Thân xe tăng */}
                <div className="relative flex flex-col items-center">
                <div className="relative">
                    <div className="w-28 h-28  relative flex items-center justify-center">
                      <img src="https://beta-api.bachlongmobile.com/media/MageINIC/bannerslider/xe_tang.png" alt="" className='w-full h-full object-contain z-20'/>
                    <div className="absolute w-10 h-10  rounded-full flex items-center justify-center ">
                        <div style={{transform: `rotate(-60deg)`}} className='absolute top-[-80px]'>
                          <motion.div
                            className="w-40 h-32"
                            style={{ transformOrigin: 'center', transform: `rotate(${angle}deg)` }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}>

                            <img src="https://beta-api.bachlongmobile.com/media/MageINIC/bannerslider/nong.png" alt="" className='w-full h-full object-contain' />
                          </motion.div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Đạn */}
            {bullets.map((bullet, index) => (
                <motion.div
                key={index}
                className="absolute w-2 h-6 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-full shadow-lg"
                style={{
                    left: `calc(50% + ${bullet.x}px)`,
                    bottom: `calc(20px + ${bullet.y}px)`,
                    transform: `rotate(${bullet.angle}deg)`,
                }}
                />
            ))}

            {/* Mục tiêu */}
            {targets.map((target) => (
                <motion.div key={target.id} 
                className="absolute text-red-500 font-bold" 
                animate={target.fallen ? { scale: [1, 1.5, 0], opacity: [1, 0.5, 0], rotate: [0, 360, 720] } : {}}
                transition={{ duration: 0.1 }} 
                style={{ left: `calc(50% + ${target.x}px)`, bottom: `calc(20px + ${target.y - target.fallProgress}px)` }}>
                <div className='w-20 h-20 rounded-full'>
                    <img src="https://beta-api.bachlongmobile.com/media/MageINIC/bannerslider/bia.png" alt="" className='w-full h-full'/>
                </div>
                </motion.div>
            ))}

            {/* Hiệu ứng cộng điểm */}
            {scoreAnimations.map((anim) => (
                <motion.div
                key={`${anim.id}-${anim.x}-${anim.y}`}
                className="absolute text-red-500 font-bold"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -50 }}
                transition={{ duration: 1 }}
                style={{
                    left: `calc(50% + ${anim.x}px)`,
                    bottom: `calc(20px + ${anim.y}px)`
                }}
                >
                +10
                </motion.div>
            ))}
            </div>
        </div>
    </div>
    </div>
      
  );

};

export default TankGame;
