import React, { useState, useEffect } from 'react';
import { Shuffle, Check, X, Settings } from 'lucide-react';

const HiraganaApp = () => {
  // Dữ liệu hiragana đầy đủ
  const hiraganaData = {
    'あ行 (A-gyou)': {
      'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o'
    },
    'か行 (Ka-gyou)': {
      'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko'
    },
    'が行 (Ga-gyou)': {
      'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go'
    },
    'さ行 (Sa-gyou)': {
      'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so'
    },
    'ざ行 (Za-gyou)': {
      'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo'
    },
    'た行 (Ta-gyou)': {
      'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to'
    },
    'だ行 (Da-gyou)': {
      'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do'
    },
    'な行 (Na-gyou)': {
      'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no'
    },
    'は行 (Ha-gyou)': {
      'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho'
    },
    'ば行 (Ba-gyou)': {
      'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo'
    },
    'ぱ行 (Pa-gyou)': {
      'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po'
    },
    'ま行 (Ma-gyou)': {
      'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo'
    },
    'や行 (Ya-gyou)': {
      'や': 'ya', 'ゆ': 'yu', 'よ': 'yo'
    },
    'ら行 (Ra-gyou)': {
      'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro'
    },
    'わ行 (Wa-gyou)': {
      'わ': 'wa', 'を': 'wo', 'ん': 'n'
    }
  } as const;

  type HiraganaDataType = typeof hiraganaData;
  type HiraganaGroup = keyof HiraganaDataType;


  const [selectedGroups, setSelectedGroups] = useState(['あ行 (A-gyou)']);
  const [gameMode, setGameMode] = useState(Number); // 1: flashcard, 2: multiple choice
  const [showSettings, setShowSettings] = useState(true);
  
  // Flashcard mode states
  const [currentChar, setCurrentChar] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  // Multiple choice mode states
  const [currentRomaji, setCurrentRomaji] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [showMCResult, setShowMCResult] = useState(false);

  // Get selected characters
  const getSelectedChars = (): Record<string, string> => {

    let chars = {};
    selectedGroups.forEach(group => {
      chars = { ...chars, ...hiraganaData[group as HiraganaGroup]
 };
    });
    return chars;
  };

  // Generate new flashcard
  const generateFlashcard = () => {
    const chars = getSelectedChars();
    const charKeys = Object.keys(chars);
    if (charKeys.length === 0) return;
    
    const randomChar = charKeys[Math.floor(Math.random() * charKeys.length)];
    setCurrentChar(randomChar);
    setUserAnswer('');
    setShowResult(false);
  };

  // Generate multiple choice question
  const generateMultipleChoice = () => {
    const chars = getSelectedChars();
    const entries = Object.entries(chars) as [string, string][];
    if (entries.length < 7) return;
    
    // Pick correct answer
    const correctIndex = Math.floor(Math.random() * entries.length);
    const [correctChar, correctRomaji] = entries[correctIndex];
    setCurrentRomaji(correctRomaji);
    
    // Generate 6 wrong choices
    const wrongChoices: string[] = [];
    const usedIndices = new Set([correctIndex]);
    
    while (wrongChoices.length < 6) {
      const randomIndex = Math.floor(Math.random() * entries.length);
      if (!usedIndices.has(randomIndex)) {
        wrongChoices.push(entries[randomIndex][0]);
        usedIndices.add(randomIndex);
      }
    }
    
    // Shuffle choices
    const allChoices = [correctChar, ...wrongChoices].sort(() => Math.random() - 0.5);
    setChoices(allChoices);
    setSelectedChoice('');
    setShowMCResult(false);
  };

  // Check flashcard answer
  const checkAnswer = () => {
  const chars = getSelectedChars();
  const romaji = chars[currentChar];

  const correct = 
    typeof romaji === 'string' &&
    romaji.toLowerCase() === userAnswer.toLowerCase().trim();

  setIsCorrect(correct);
  setShowResult(true);
  setScore(prev => ({
    correct: prev.correct + (correct ? 1 : 0),
    total: prev.total + 1
  }));
};


  // Check multiple choice answer
    const checkMultipleChoice = (selectedChar: string) => {
    const chars = getSelectedChars();
    const correct = chars[selectedChar] === currentRomaji;
    setSelectedChoice(selectedChar);
    setIsCorrect(correct);
    setShowMCResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  // Start game
  const startGame = (mode: number) => {
    setGameMode(mode);
    setShowSettings(false);
    setScore({ correct: 0, total: 0 });
    if (mode === 1) {
      generateFlashcard();
    } else {
      generateMultipleChoice();
    }
  };

  // Toggle group selection
  const toggleGroup = (group: string) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter(g => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  useEffect(() => {
    if (gameMode === 1) generateFlashcard();
    if (gameMode === 2) generateMultipleChoice();
  }, [selectedGroups]);

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-800">
            🌸 Học Hiragana
          </h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Chọn nhóm chữ cái:</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Object.keys(hiraganaData).map(group => (
                <label key={group} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group)}
                    onChange={() => toggleGroup(group)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">{group}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => startGame(1)}
              disabled={selectedGroups.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              📚 Flashcard (Gõ romaji)
            </button>
            
            <button
              onClick={() => startGame(2)}
              disabled={selectedGroups.length === 0 || Object.keys(getSelectedChars()).length < 7}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              🎯 Trắc nghiệm (Chọn đáp án)
            </button>
          </div>
          
          {selectedGroups.length === 0 && (
            <p className="text-red-500 text-sm mt-2 text-center">
              Vui lòng chọn ít nhất 1 nhóm chữ cái
            </p>
          )}
          
          {selectedGroups.length > 0 && Object.keys(getSelectedChars()).length < 7 && (
            <p className="text-orange-500 text-sm mt-2 text-center">
              Cần ít nhất 7 chữ cái để chơi trắc nghiệm
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Settings size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-purple-800">
              {gameMode === 1 ? '📚 Flashcard' : '🎯 Trắc nghiệm'}
            </h1>
            <p className="text-sm text-gray-600">
              Đúng: {score.correct}/{score.total}
            </p>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Flashcard Mode */}
        {gameMode === 1 && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
              <div className="text-6xl font-bold text-purple-800 mb-4">
                {currentChar}
              </div>
              <p className="text-gray-600 text-sm">Nhập romaji:</p>
            </div>
            
            {!showResult ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
                  className="w-full px-4 py-3 text-center text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Nhập câu trả lời..."
                  autoFocus
                />
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Kiểm tra
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center justify-center mb-2">
                    {isCorrect ? <Check size={24} /> : <X size={24} />}
                  </div>
                  <p className="font-semibold">
                    {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                  </p>
                  <p className="text-sm">
                    {currentChar} = {getSelectedChars()[currentChar]}
                  </p>
                </div>
                <button
                  onClick={generateFlashcard}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Shuffle size={20} />
                  <span>Tiếp theo</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Multiple Choice Mode */}
        {gameMode === 2 && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
              <p className="text-gray-600 text-sm mb-2">Chọn chữ Hiragana cho:</p>
              <div className="text-4xl font-bold text-green-800">
                {currentRomaji}
              </div>
            </div>
            
            {!showMCResult ? (
              <div className="grid grid-cols-2 gap-3">
                {choices.map((char, index) => (
                  <button
                    key={index}
                    onClick={() => checkMultipleChoice(char)}
                    className="bg-gray-50 hover:bg-gray-100 text-2xl font-bold py-4 px-2 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {choices.map((char, index) => {
                    const chars = getSelectedChars();
                    const isCorrectAnswer = chars[char] === currentRomaji;
                    const isSelected = char === selectedChoice;
                    
                    let bgColor = 'bg-gray-100';
                    if (isSelected && isCorrect) bgColor = 'bg-green-200';
                    else if (isSelected && !isCorrect) bgColor = 'bg-red-200';
                    else if (isCorrectAnswer) bgColor = 'bg-green-200';
                    
                    return (
                      <div
                        key={index}
                        className={`${bgColor} text-2xl font-bold py-4 px-2 rounded-xl border-2 ${
                          isCorrectAnswer ? 'border-green-500' : 
                          isSelected && !isCorrect ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                
                <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center justify-center mb-2">
                    {isCorrect ? <Check size={24} /> : <X size={24} />}
                  </div>
                  <p className="font-semibold">
                    {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                  </p>
                </div>
                
                <button
                  onClick={generateMultipleChoice}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Shuffle size={20} />
                  <span>Tiếp theo</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiraganaApp;