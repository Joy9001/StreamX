import React from 'react';
import profileData from '../../data/profileData.json';

function StorageCard() {
  const totalStorage = 10240; // 10GB in MB
  const videos = profileData.profiles[0].uploadedVideos;
  
  // Calculate total used storage from video file sizes
  const usedStorage = videos.reduce((total, video) => {
    const sizeInMB = parseInt(video.fileSize.replace('MB', ''));
    return total + sizeInMB;
  }, 0);
  
  const remainingStorage = totalStorage - usedStorage;
  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
          Storage
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-gray-700">
          <p className="font-medium">Total Storage: 10 GB</p>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">Data Used: {(usedStorage / 1024).toFixed(2)} GB</span>
            <span className="text-gray-500">{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="text-gray-700">
          <p className="font-medium">Remaining: {(remainingStorage / 1024).toFixed(2)} GB</p>
        </div>

        <button className="w-full mt-4 btn bg-pink-200 hover:bg-pink-300 border-none text-gray-700">
          Explore Plans
        </button>
      </div>
    </div>
  );
}

export default StorageCard;
