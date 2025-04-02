import React, { useState, useRef } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Image, RefreshCw, Gamepad2, Upload, EyeIcon, X, Maximize, Minimize } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// Type for uploaded images
type UploadedImage = {
  id: string;
  url: string;
  name: string;
  answer: string;
};

const AdminPanel: React.FC = () => {
  const { 
    teams, 
    buzzedTeam, 
    resetBuzzer, 
    setCurrentImage, 
    toggleShowAnswer,
    toggleFullscreen,
    gameState, 
    currentImage, 
    currentImageAnswer,
    showAnswer,
    isFullscreen,
    logout
  } = useGameContext();
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [imageAnswerInput, setImageAnswerInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Create URL for the image
    const imageUrl = URL.createObjectURL(file);
    const newImage: UploadedImage = {
      id: Date.now().toString(),
      url: imageUrl,
      name: file.name,
      answer: '',
    };
    
    setUploadedImages([...uploadedImages, newImage]);
    
    // Clear the file input for future uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSetAnswer = (imageId: string) => {
    setUploadedImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? {...img, answer: imageAnswerInput} 
          : img
      )
    );
    
    setImageAnswerInput('');
    
    toast({
      title: "Answer saved",
      description: "The answer has been saved for this question",
    });
  };
  
  const handleSelectImage = (image: UploadedImage) => {
    setCurrentImage(image.url, image.answer);
    
    toast({
      title: "Question displayed",
      description: `Now showing: ${image.name}`,
    });
  };
  
  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };
  
  const handleReset = () => {
    resetBuzzer();
    toast({
      title: "Buzzer reset",
      description: "Ready for the next question",
    });
  };
  
  const handleFullscreen = () => {
    toggleFullscreen();
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`flex flex-col gap-6 w-full ${isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-black p-4' : ''}`}>
      {isFullscreen ? (
        <div className="flex-grow flex flex-col">
          <div className="absolute top-2 right-2 z-10">
            <button 
              onClick={handleFullscreen}
              className="p-2 bg-arcade-dark-purple rounded-md text-white hover:bg-arcade-purple"
            >
              <Minimize size={20} />
            </button>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt="Current Question" 
                className="rounded-lg object-contain max-h-[80vh]"
              />
            ) : (
              <div className="text-center text-gray-400">
                <Image size={48} className="mx-auto mb-2" />
                <p>No image selected</p>
              </div>
            )}
            
            {showAnswer && currentImageAnswer && (
              <div className="mt-6 p-4 bg-arcade-dark-purple rounded-lg w-full max-w-2xl mx-auto animate-fade-in">
                <h3 className="text-arcade-orange text-lg mb-2">Answer:</h3>
                <p className="text-white text-xl">{currentImageAnswer}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center gap-4">
            <Button 
              onClick={() => toggleShowAnswer()}
              className="arcade-btn py-2"
              disabled={!currentImageAnswer}
            >
              <EyeIcon size={16} className="mr-2" />
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>
            
            <Button 
              onClick={handleReset}
              className="arcade-btn py-2"
              disabled={gameState === 'playing'}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset Buzzer
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="arcade-panel overflow-hidden">
            <h2 className="text-xl text-center mb-4 neon-text">Game Control Panel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-arcade-dark-purple p-4 rounded-lg">
                <h3 className="text-lg mb-3 text-arcade-light-purple">Connected Teams</h3>
                
                {teams.length === 0 ? (
                  <p className="text-sm text-gray-400">Waiting for teams to connect...</p>
                ) : (
                  <ul className="space-y-2">
                    {teams.map(team => (
                      <li 
                        key={team.id} 
                        className={`flex items-center p-2 rounded-md ${
                          buzzedTeam?.id === team.id 
                            ? 'bg-arcade-purple text-white animate-pulse-arcade' 
                            : 'bg-muted'
                        }`}
                      >
                        <Gamepad2 size={16} className="mr-2" />
                        <span>{team.name}</span>
                        {buzzedTeam?.id === team.id && (
                          <span className="ml-auto text-xs font-bold px-2 py-1 bg-arcade-red rounded-md">
                            BUZZED!
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-arcade-dark-purple p-4 rounded-lg">
                <h3 className="text-lg mb-3 text-arcade-light-purple">Game Controls</h3>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="file-upload" className="block text-sm mb-2">Upload Question Image:</label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="arcade-btn py-2"
                      >
                        <Upload size={16} className="mr-2" />
                        Select Image
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={handleReset}
                      className="arcade-btn w-full py-2"
                      disabled={gameState === 'playing'}
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Reset Buzzer
                    </Button>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={() => toggleShowAnswer()}
                      className="arcade-btn w-full py-2"
                      disabled={!currentImageAnswer}
                    >
                      <EyeIcon size={16} className="mr-2" />
                      {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </Button>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={handleFullscreen}
                      className="arcade-btn w-full py-2"
                    >
                      <Maximize size={16} className="mr-2" />
                      Fullscreen Mode
                    </Button>
                  </div>
                  
                  <div className="pt-3">
                    <Button 
                      onClick={handleLogout}
                      className="w-full py-2 bg-red-800 hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="arcade-panel">
            <h3 className="text-lg mb-3 text-arcade-light-purple">Uploaded Questions</h3>
            
            {uploadedImages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Image size={32} className="mx-auto mb-4" />
                <p>No images uploaded yet. Upload an image to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedImages.map((image) => (
                  <Card 
                    key={image.id} 
                    className={`cursor-pointer border-2 transition-all ${
                      currentImage === image.url ? 'border-arcade-purple' : 'hover:border-arcade-purple'
                    }`}
                  >
                    <div className="relative">
                      <button 
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1 right-1 p-1 bg-arcade-dark-purple rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      
                      <div className="p-2 text-center">
                        <div 
                          className="h-24 bg-cover bg-center rounded-md mb-2" 
                          style={{ backgroundImage: `url(${image.url})` }}
                          onClick={() => handleSelectImage(image)}
                        ></div>
                        
                        <small className="block truncate">{image.name}</small>
                        
                        {image.answer ? (
                          <div className="mt-2">
                            <small className="text-arcade-light-purple">Answer saved</small>
                          </div>
                        ) : (
                          <div className="mt-2 space-y-2">
                            <Textarea 
                              placeholder="Question answer..."
                              className="text-xs"
                              value={imageAnswerInput}
                              onChange={(e) => setImageAnswerInput(e.target.value)}
                            />
                            <Button 
                              size="sm" 
                              className="w-full text-xs py-1"
                              onClick={() => handleSetAnswer(image.id)}
                            >
                              Save Answer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {buzzedTeam && (
            <div className="arcade-panel text-center py-8">
              <h3 className="text-xl mb-2">Buzzed In:</h3>
              <div className="bg-arcade-purple text-white text-2xl md:text-4xl py-4 px-6 rounded-lg animate-pulse-arcade">
                {buzzedTeam.name}
              </div>
            </div>
          )}

          <div className="arcade-panel min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-4">
              <h2 className="text-xl neon-text">Current Question</h2>
              <button 
                onClick={handleFullscreen}
                className="p-1 bg-arcade-dark-purple rounded-md text-white hover:bg-arcade-purple"
              >
                <Maximize size={20} />
              </button>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center">
              {currentImage ? (
                <div className="text-center">
                  <img 
                    src={currentImage} 
                    alt="Current Question" 
                    className="rounded-lg object-contain max-h-[250px]"
                    onError={(e) => {
                      console.error(`Failed to load image: ${currentImage}`);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  
                  {showAnswer && currentImageAnswer && (
                    <div className="mt-4 p-4 bg-arcade-dark-purple rounded-lg animate-fade-in">
                      <h3 className="text-arcade-orange text-lg mb-2">Answer:</h3>
                      <p className="text-white text-xl">{currentImageAnswer}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Image size={48} className="mx-auto mb-2" />
                  <p>Upload and select an image to display the question</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
