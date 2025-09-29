import React, { useState, useEffect, useRef } from 'react';

const FileSyncDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [syncedFiles, setSyncedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({ total: 0, synced: 0, failed: 0, skipped: 0 });
  const [speed, setSpeed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  // Simulated file list
  const fileList = [
    { name: 'documents/project-plan.md', size: '2.4 KB', type: 'text' },
    { name: 'images/screenshot-2024.png', size: '1.2 MB', type: 'image' },
    { name: 'code/main.py', size: '8.7 KB', type: 'code' },
    { name: 'data/analytics.json', size: '245 KB', type: 'data' },
    { name: 'videos/demo.mp4', size: '15.8 MB', type: 'video' },
    { name: 'configs/settings.yaml', size: '1.1 KB', type: 'config' },
    { name: 'assets/logo.svg', size: '3.2 KB', type: 'image' },
    { name: 'database/backup.sql', size: '5.6 MB', type: 'database' },
    { name: 'docs/readme.txt', size: '892 B', type: 'text' },
    { name: 'scripts/deploy.sh', size: '4.3 KB', type: 'script' },
    { name: 'cache/temp.data', size: '0 B', type: 'cache' }, // This will be skipped
    { name: 'logs/error.log', size: '12.4 KB', type: 'log' }
  ];

  const getFileIcon = (type) => {
    const icons = {
      text: '📄',
      image: '🖼️',
      code: '💻',
      data: '📊',
      video: '🎥',
      config: '⚙️',
      database: '🗄️',
      script: '📜',
      cache: '🗂️',
      log: '📋'
    };
    return icons[type] || '📁';
  };

  const simulateSync = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setSyncedFiles([]);
    setErrors([]);
    setStats({ total: fileList.length, synced: 0, failed: 0, skipped: 0 });
    setStartTime(Date.now());
    
    let currentIndex = 0;
    let syncedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    
    intervalRef.current = setInterval(() => {
      if (currentIndex >= fileList.length) {
        setIsRunning(false);
        setCurrentFile('');
        setProgress(100);
        setSpeed(0);
        clearInterval(intervalRef.current);
        return;
      }
      
      const file = fileList[currentIndex];
      setCurrentFile(file.name);
      
      // Simulate file processing time (random between 500-2000ms)
      const processingTime = Math.random() * 1500 + 500;
      
      setTimeout(() => {
        // Simulate different outcomes
        const outcome = Math.random();
        
        if (file.size === '0 B') {
          // Skip empty files
          setSyncedFiles(prev => [...prev, { ...file, status: 'skipped', reason: 'Empty file' }]);
          skippedCount++;
        } else if (outcome < 0.1) {
          // 10% chance of failure
          const errorMessages = [
            'Permission denied',
            'Network timeout',
            'File corrupted',
            'Disk full',
            'Invalid format'
          ];
          const error = errorMessages[Math.floor(Math.random() * errorMessages.length)];
          setSyncedFiles(prev => [...prev, { ...file, status: 'failed', error }]);
          setErrors(prev => [...prev, { file: file.name, error }]);
          failedCount++;
        } else {
          // Success
          setSyncedFiles(prev => [...prev, { ...file, status: 'success' }]);
          syncedCount++;
        }
        
        const newProgress = ((currentIndex + 1) / fileList.length) * 100;
        setProgress(newProgress);
        setStats({ total: fileList.length, synced: syncedCount, failed: failedCount, skipped: skippedCount });
        
        // Calculate speed
        if (startTime) {
          const elapsed = (Date.now() - startTime) / 1000;
          const filesPerSecond = (currentIndex + 1) / elapsed;
          setSpeed(filesPerSecond);
        }
        
        currentIndex++;
      }, processingTime);
    }, 100);
  };

  const stopSync = () => {
    setIsRunning(false);
    setCurrentFile('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetSync = () => {
    stopSync();
    setProgress(0);
    setSyncedFiles([]);
    setErrors([]);
    setStats({ total: fileList.length, synced: 0, failed: 0, skipped: 0 });
    setSpeed(0);
    setStartTime(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getElapsedTime = () => {
    if (!startTime) return '0:00';
    return formatTime((Date.now() - startTime) / 1000);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">File Sync Demo</h3>
        <p className="text-sm text-gray-400">
          Claude-Joplin Bridge simulation - syncing {fileList.length} files
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={simulateSync}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
        >
          {isRunning ? 'Syncing...' : 'Start Sync'}
        </button>
        
        {isRunning && (
          <button
            onClick={stopSync}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
          >
            Stop
          </button>
        )}
        
        <button
          onClick={resetSync}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Progress: {progress.toFixed(1)}%</span>
          <span>Speed: {speed.toFixed(1)} files/sec</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">Total</div>
          <div className="text-white font-bold">{stats.total}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">Synced</div>
          <div className="text-green-400 font-bold">{stats.synced}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">Failed</div>
          <div className="text-red-400 font-bold">{stats.failed}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">Skipped</div>
          <div className="text-yellow-400 font-bold">{stats.skipped}</div>
        </div>
      </div>

      {/* Current File */}
      {currentFile && (
        <div className="mb-4 p-3 bg-gray-700 rounded">
          <div className="text-sm text-gray-400">Currently processing:</div>
          <div className="text-white font-mono text-sm flex items-center gap-2">
            <span className="animate-pulse">⚡</span>
            {currentFile}
          </div>
        </div>
      )}

      {/* Time info */}
      {(isRunning || progress > 0) && (
        <div className="mb-4 text-sm text-gray-400 text-center">
          Elapsed: {getElapsedTime()}
        </div>
      )}

      {/* File List */}
      <div className="max-h-48 overflow-y-auto">
        <div className="text-sm text-gray-400 mb-2">Files:</div>
        <div className="space-y-1">
          {syncedFiles.length === 0 && !isRunning ? (
            <div className="text-gray-500 text-center py-4">
              Click "Start Sync" to begin
            </div>
          ) : (
            syncedFiles.map((file, index) => (
              <div
                key={index}
                className={`
                  flex items-center gap-2 p-2 rounded text-xs
                  ${file.status === 'success' ? 'bg-green-900/30 border border-green-700' :
                    file.status === 'failed' ? 'bg-red-900/30 border border-red-700' :
                    'bg-yellow-900/30 border border-yellow-700'
                  }
                `}
              >
                <span>{getFileIcon(file.type)}</span>
                <span className="flex-1 font-mono text-gray-300 truncate">
                  {file.name}
                </span>
                <span className="text-gray-400">{file.size}</span>
                <span className={`
                  font-bold
                  ${file.status === 'success' ? 'text-green-400' :
                    file.status === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }
                `}>
                  {file.status === 'success' ? '✓' :
                   file.status === 'failed' ? '✗' : '⊘'}
                </span>
                {file.error && (
                  <span className="text-xs text-red-300" title={file.error}>
                    {file.error}
                  </span>
                )}
                {file.reason && (
                  <span className="text-xs text-yellow-300" title={file.reason}>
                    {file.reason}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Demo notice */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Simulation demo - mimics real file sync behavior
      </div>
    </div>
  );
};

export default FileSyncDemo;