import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Camera: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopVideo = async () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startVideo = async () => {
    try {
      const constraints = {
        video: {
          frameRate: { ideal: 14, max: 14 },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      };

      streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(error => {
            console.error("Error al intentar reproducir el video:", error);
          });
          if (typeof cv !== 'undefined') {
            requestAnimationFrame(processVideo);
          }
        };
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  };

  const processVideo = () => {
    if (videoRef.current && canvasRef.current && typeof cv !== 'undefined') {
      const src = new cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, cv.CV_8UC4);
      const dst = new cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, cv.CV_8UC1);
      const hsv = new cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, cv.CV_8UC3);
  
      // Captura el frame actual del video
      cv.imshow(src, videoRef.current);
      cv.cvtColor(src, hsv, cv.COLOR_RGBA2BGR); // Convierte de RGBA a BGR
      cv.cvtColor(hsv, hsv, cv.COLOR_BGR2HSV); // Convierte de BGR a HSV
  
      // Obtener valores de los trackbars
      const lowerHue = parseInt((document.getElementById('lowerHue') as HTMLInputElement).value);
      const upperHue = parseInt((document.getElementById('upperHue') as HTMLInputElement).value);
      const lowerSaturation = parseInt((document.getElementById('lowerSaturation') as HTMLInputElement).value);
      const upperSaturation = parseInt((document.getElementById('upperSaturation') as HTMLInputElement).value);
      const lowerValue = parseInt((document.getElementById('lowerValue') as HTMLInputElement).value);
      const upperValue = parseInt((document.getElementById('upperValue') as HTMLInputElement).value);
  
      const lowerHSV = new cv.Mat(hsv.rows, hsv.cols, cv.CV_8UC3, [lowerHue, lowerSaturation, lowerValue]);
      const upperHSV = new cv.Mat(hsv.rows, hsv.cols, cv.CV_8UC3, [upperHue, upperSaturation, upperValue]);
  
      // Detección de color
      cv.inRange(hsv, lowerHSV, upperHSV, dst);
  
      // Procesamiento adicional para mejorar la detección
      const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
      cv.erode(dst, dst, kernel);
      cv.morphologyEx(dst, dst, cv.MORPH_OPEN, kernel);
      cv.dilate(dst, dst, kernel);
  
      // Crear la imagen en blanco y negro
      const bnwCanvas = new cv.Mat(videoRef.current.videoHeight, videoRef.current.videoWidth, cv.CV_8UC1);
      cv.bitwise_not(dst, bnwCanvas);  // Invertir la máscara para blanco y negro
  
      // Verifica que el canvas esté disponible
      if (canvasRef.current) {
        cv.imshow(canvasRef.current, bnwCanvas);  // Aquí se muestra el bnwCanvas
      } else {
        console.error("Canvas no disponible en el momento de mostrar la imagen");
      }
  
      // Liberar memoria
      src.delete();
      hsv.delete();
      dst.delete();
      lowerHSV.delete();
      upperHSV.delete();
      kernel.delete();
      bnwCanvas.delete();  // Liberar la matriz de blanco y negro
    }
  
    requestAnimationFrame(processVideo);
  };
  

  const loadOpenCV = () => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/opencv.js';
      script.onload = () => {
        if (typeof cv !== 'undefined') {
          resolve();
        } else {
          reject(new Error('Error: OpenCV no se cargó correctamente.'));
        }
      };
      script.onerror = () => reject(new Error('Error al cargar OpenCV.js'));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadOpenCV()
      .then(() => {
        startVideo();
      })
      .catch(error => {
        console.error(error);
      });

    return () => {
      stopVideo();
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/game-options') {
      stopVideo();
    }
  }, [location.pathname]);

  const handleBackButtonClick = async () => {
    await stopVideo();
    navigate('/game-options');
  };

  return (
    <div className="min-h-screen p-4 flex">
      <button
        onClick={handleBackButtonClick}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center flex-1">
        <h1 className="text-4xl font-bold text-white mb-8">Camera Mode</h1>
        <div className="bg-white rounded-lg p-4 max-w-4xl mx-auto flex">
          <video
            ref={videoRef}
            className="w-1/2 border-2 border-gray-300 rounded transform scale-x-[-1]"
            autoPlay
          />
          <canvas ref={canvasRef} className="w-1/2 border-2 border-gray-300 rounded mt-4" />
        </div>
      </div>

      {/* Trackbars para ajustar los valores HSV */}
      <div className="fixed bottom-0 left-0 p-4 bg-gray-800 text-white">
        <h2>Color Trackbars</h2>
        <div>
          <label>Lower Hue: </label>
          <input type="range" min="0" max="180" defaultValue="0" id="lowerHue" />
        </div>
        <div>
          <label>Upper Hue: </label>
          <input type="range" min="0" max="180" defaultValue="180" id="upperHue" />
        </div>
        <div>
          <label>Lower Saturation: </label>
          <input type="range" min="0" max="255" defaultValue="0" id="lowerSaturation" />
        </div>
        <div>
          <label>Upper Saturation: </label>
          <input type="range" min="0" max="255" defaultValue="255" id="upperSaturation" />
        </div>
        <div>
          <label>Lower Value: </label>
          <input type="range" min="0" max="255" defaultValue="0" id="lowerValue" />
        </div>
        <div>
          <label>Upper Value: </label>
          <input type="range" min="0" max="255" defaultValue="60" id="upperValue" />
        </div>
      </div>
    </div>
  );
};

export default Camera;
