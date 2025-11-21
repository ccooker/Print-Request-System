import React, { useRef, useEffect, useCallback } from 'react';
import { CloseIcon } from './icons';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

// Declare the BarcodeDetector API type for TypeScript
declare global {
  interface Window {
    BarcodeDetector: any;
  }
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerIsRunning = useRef(true);

  const stopCamera = useCallback(() => {
    scannerIsRunning.current = false;
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  const handleScan = useCallback(async (detector: any) => {
    if (!scannerIsRunning.current || !videoRef.current || videoRef.current.readyState !== 4) {
      return;
    }
    try {
      const barcodes = await detector.detect(videoRef.current);
      if (barcodes.length > 0) {
        onScan(barcodes[0].rawValue);
        stopCamera();
      }
    } catch (e) {
      console.error('Barcode detection failed:', e);
    }
  }, [onScan, stopCamera]);

  const startScanner = useCallback(async () => {
    if (!('BarcodeDetector' in window)) {
      alert('Barcode Detector is not supported by this browser.');
      onClose();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const barcodeDetector = new window.BarcodeDetector({ formats: ['code_128'] });
      
      const detectBarcode = () => {
        if (!scannerIsRunning.current) return;
        handleScan(barcodeDetector).finally(() => {
          if (scannerIsRunning.current) {
             requestAnimationFrame(detectBarcode);
          }
        });
      };
      
      detectBarcode();

    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure permissions are granted.");
      onClose();
    }
  }, [onClose, handleScan]);


  useEffect(() => {
    scannerIsRunning.current = true;
    startScanner();
    return () => {
      stopCamera();
    };
  }, [startScanner, stopCamera]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-2xl bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        <video ref={videoRef} playsInline className="w-full h-auto" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1/3 border-4 border-dashed border-green-400 rounded-lg opacity-75"></div>
        </div>
        <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-md">Point camera at barcode</p>
      </div>
      <div className="mt-4">
        <button
          onClick={() => { stopCamera(); onClose(); }}
          className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
          aria-label="Close scanner"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
