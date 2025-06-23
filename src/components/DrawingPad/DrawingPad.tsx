import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, Trash2, Save, Folder, Eraser } from 'lucide-react';
import { useStore } from '../../store/useStore';

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
];

const brushSizes = [2, 5, 10, 20, 30];

export const DrawingPad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [padName, setPadName] = useState('');
  const { drawingPads, addDrawingPad, deleteDrawingPad } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set display size
      canvas.style.width = '100%';
      canvas.style.height = '400px';
      
      // Set actual size in memory (scaled up for retina displays)
      canvas.width = rect.width * dpr;
      canvas.height = 400 * dpr;
      
      // Scale the drawing context so everything draws at the correct size
      ctx.scale(dpr, dpr);
      
      // Set drawing properties
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        return { x: 0, y: 0 };
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
    }
    
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
    
    // Reset composite operation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas || !padName.trim()) return;

    const imageData = canvas.toDataURL();
    addDrawingPad({
      name: padName.trim(),
      imageData,
    });
    
    setPadName('');
    setShowSaveDialog(false);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto space-y-4 lg:space-y-6">
      {/* Tools */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-3 lg:p-4 border border-gray-200/50">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:gap-6">
          {/* Colors */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Palette className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 flex-shrink-0" />
            <div className="flex space-x-1 lg:space-x-2 overflow-x-auto pb-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color);
                    setIsEraser(false);
                  }}
                  className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 lg:border-3 transition-all flex-shrink-0 ${
                    currentColor === color && !isEraser ? 'border-gray-900 scale-110 shadow-lg' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <span className="text-xs lg:text-sm font-medium text-gray-700 flex-shrink-0">Brush:</span>
            <div className="flex space-x-1 lg:space-x-2 overflow-x-auto pb-1">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    brushSize === size ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                  }`}
                >
                  <div
                    className="rounded-full bg-gray-700"
                    style={{ width: Math.min(size, 16), height: Math.min(size, 16) }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Eraser */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleEraser}
              className={`px-3 py-2 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl transition-all flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base ${
                isEraser 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <Eraser className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </motion.button>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 lg:space-x-3 lg:ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSaveDialog(true)}
              className="px-3 py-2 lg:px-4 lg:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg lg:rounded-xl transition-colors flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
            >
              <Save className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Save</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadImage}
              className="px-3 py-2 lg:px-4 lg:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg lg:rounded-xl transition-colors flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
            >
              <Download className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Download</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCanvas}
              className="px-3 py-2 lg:px-4 lg:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg lg:rounded-xl transition-colors flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
            >
              <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="hidden sm:inline">Clear</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Canvas */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-3 lg:p-4 border border-gray-200/50 shadow-lg">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
              className={`w-full border border-gray-200 rounded-lg lg:rounded-xl touch-none ${
                isEraser ? 'cursor-crosshair' : 'cursor-crosshair'
              }`}
              style={{ height: '400px' }}
            />
            {isEraser && (
              <div className="mt-2 text-center">
                <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Eraser Mode Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Saved Drawings */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-3 lg:p-4 border border-gray-200/50">
          <div className="flex items-center space-x-2 mb-3 lg:mb-4">
            <Folder className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Saved Drawings</h3>
          </div>
          
          <div className="space-y-2 lg:space-y-3 max-h-80 overflow-y-auto">
            {drawingPads.map((pad) => (
              <div key={pad.id} className="group relative">
                <img
                  src={pad.imageData}
                  alt={pad.name}
                  className="w-full h-16 lg:h-20 object-cover rounded-lg lg:rounded-xl border border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg lg:rounded-xl flex items-center justify-center">
                  <button
                    onClick={() => deleteDrawingPad(pad.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                </div>
                <p className="text-xs lg:text-sm text-gray-600 mt-1 truncate">{pad.name}</p>
              </div>
            ))}
            
            {drawingPads.length === 0 && (
              <p className="text-gray-500 text-center py-6 lg:py-8 text-xs lg:text-sm">No saved drawings yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowSaveDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">Save Drawing</h3>
            
            <input
              type="text"
              placeholder="Enter drawing name..."
              value={padName}
              onChange={(e) => setPadName(e.target.value)}
              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 bg-gray-50 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 lg:mb-4 text-sm lg:text-base"
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 lg:px-6 lg:py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm lg:text-base"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveDrawing}
                disabled={!padName.trim()}
                className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                Save Drawing
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};