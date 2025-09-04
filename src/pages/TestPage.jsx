import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaClock, FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaPlay, FaPause, FaStop } from 'react-icons/fa'
import Header from '../components/Header'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

const TestPage = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  
  // Test state
  const [test, setTest] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  
  // Results state
  const [results, setResults] = useState(null)
  const [showDetailedResults, setShowDetailedResults] = useState(false)
  
  const timerRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    loadTest()
  }, [testId])

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerRunning, timeLeft])



  const loadTest = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please log in again.')
        return
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      // First, check if the test is already started by checking user's assigned tests
      const userResponse = await fetch(`${apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          setError('Session expired. Please log in again.')
          return
        }
        throw new Error(`Failed to fetch user profile: ${userResponse.status}`)
      }

      const userData = await userResponse.json()
      const assignedTest = userData.user.assignedTests.find(at => at.test._id === testId)
      
      if (assignedTest) {
        if (assignedTest.status === 'completed') {
          // Test is already completed, show error and redirect
          setError('This test has already been completed. You cannot take it again.')
          return
        } else if (assignedTest.status === 'started') {
          // Test is already started, set the test as started
          setTestStarted(true)
          setTimerRunning(true)
          setStartTime(new Date()) // This will be approximate since we don't have the exact start time
          toast.info('Test already in progress. Continuing...')
        } else if (assignedTest.status === 'assigned') {
          // Check if test is available based on assigned date
          const now = new Date()
          const testDate = assignedTest.testDate ? new Date(assignedTest.testDate) : null
          
          if (testDate) {
            // If test has a specific date, check if it's available
            const testDateStart = new Date(testDate)
            testDateStart.setHours(0, 0, 0, 0)
            
            const testDateEnd = new Date(testDate)
            testDateEnd.setHours(23, 59, 59, 999)
            
            if (now < testDateStart) {
              setError(`This test is scheduled for ${testDate.toLocaleDateString()}. It will be available from 00:00 AM to 11:59 PM on that date.`)
              return
            } else if (now > testDateEnd) {
              setError('This test has expired. Please contact your administrator.')
              return
            }
          }
        }
      } else {
        // Test is not assigned to this user
        setError('This test is not assigned to you. Please contact your administrator.')
        return
      }

      // Fetch the actual test data
      const response = await fetch(`${apiUrl}/api/tests/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Test not found. Please contact your administrator.')
          return
        } else if (response.status === 403) {
          const errorData = await response.json()
          setError(errorData.message || 'Access denied to this test.')
          return
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Failed to load test. Please try again.')
          return
        }
      }

      const data = await response.json()
      if (!data.test) {
        setError('Invalid test data received. Please contact your administrator.')
        return
      }
      
      setTest(data.test)
      setTimeLeft(data.test.timeLimit * 60) // Convert minutes to seconds
      
    } catch (error) {
      console.error('Error loading test:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const startTest = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const response = await fetch(`${apiUrl}/api/tests/${testId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTestStarted(true)
        setTimerRunning(true)
        setStartTime(new Date())
        toast.success('Test started! Good luck!')
      } else {
        const errorData = await response.json()
        if (errorData.message === 'This test has already been started or completed') {
          toast.error('This test has already been started or completed. You cannot start it again.')
          // Navigate back to home
          navigate('/')
        } else {
          toast.error(errorData.message || 'Failed to start test')
        }
      }
    } catch (error) {
      toast.error('Failed to start test')
    }
  }

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleTimeUp = () => {
    setTimerRunning(false)
    toast.error('Time is up! Submitting your test...')
    submitTest()
  }

  const submitTest = async () => {
    try {
      setTimerRunning(false)
      setEndTime(new Date())
      
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      const timeTaken = startTime ? Math.floor((new Date() - startTime) / 1000) : 0
      
      const response = await fetch(`${apiUrl}/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption
          })),
          timeTaken,
          startTime: startTime ? startTime.toISOString() : new Date().toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
        setTestCompleted(true)
        toast.success('Test submitted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to submit test')
      }
    } catch (error) {
      toast.error('Failed to submit test')
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getQuestionStatus = (index) => {
    const questionId = test.questions[index]._id
    if (answers[questionId] !== undefined) {
      // During the test, only show answered status, not correct/incorrect
      return 'answered'
    }
    return 'unanswered'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-4">{error}</div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 pt-20 md:pt-24">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">{test.title}</h1>
              <p className="text-gray-600 text-base md:text-lg">{test.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-blue-50 rounded-xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-3 md:mb-4">Test Information</h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm md:text-base">Total Questions:</span>
                    <span className="font-semibold text-sm md:text-base">{test.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm md:text-base">Time Limit:</span>
                    <span className="font-semibold text-sm md:text-base">{test.timeLimit} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm md:text-base">Difficulty:</span>
                    <span className="font-semibold capitalize text-sm md:text-base">{test.difficultyLevel}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-green-900 mb-3 md:mb-4">Instructions</h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-green-800">
                  <li>• Read each question carefully</li>
                  <li>• You can navigate between questions</li>
                  <li>• Timer will auto-submit when time runs out</li>
                  <li>• You can submit early if finished</li>
                  <li>• Make sure to answer all questions</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-yellow-900 mb-3 md:mb-4">Marking System</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full"></div>
                  <span className="text-green-800">Correct Answer: +4 marks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                  <span className="text-red-800">Wrong Answer: -1 mark</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-800">Unattempted: 0 marks</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startTest}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaPlay className="inline mr-2" />
                Start Test
              </button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  if (testCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 pt-20 md:pt-24">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <FaCheck className="text-green-600 text-2xl md:text-3xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
              <p className="text-gray-600 text-sm md:text-base">Here are your results</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-blue-50 rounded-xl p-3 md:p-6 text-center">
                <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">{results.totalMarks || 0}</div>
                <div className="text-blue-800 font-semibold text-xs md:text-sm">Total Marks</div>
                <div className="text-xs md:text-sm text-blue-600">NEET/JEE System</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-3 md:p-6 text-center">
                <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">{results.correctAnswers}</div>
                <div className="text-green-800 font-semibold text-xs md:text-sm">Correct</div>
                <div className="text-xs md:text-sm text-green-600">+4 marks each</div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-3 md:p-6 text-center">
                <div className="text-xl md:text-3xl font-bold text-red-600 mb-1 md:mb-2">{results.wrongAnswers || 0}</div>
                <div className="text-red-800 font-semibold text-xs md:text-sm">Wrong</div>
                <div className="text-xs md:text-sm text-red-600">-1 mark each</div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-3 md:p-6 text-center">
                <div className="text-xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">{formatTime(results.timeTaken)}</div>
                <div className="text-purple-800 font-semibold text-xs md:text-sm">Time Taken</div>
                <div className="text-xs md:text-sm text-purple-600">minutes:seconds</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Performance Summary</h3>
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Total Marks Obtained:</span>
                  <span className="font-semibold">{results.totalMarks || 0}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold">{((results.correctAnswers / results.totalQuestions) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Questions Attempted:</span>
                  <span className="font-semibold">{results.questionsAttempted || Object.keys(answers).length} / {results.totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Questions Unattempted:</span>
                  <span className="font-semibold">{results.questionsUnattempted || (results.totalQuestions - Object.keys(answers).length)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Average Time per Question:</span>
                  <span className="font-semibold">{formatTime(Math.floor(results.timeTaken / results.totalQuestions))}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Marking System:</span>
                  <span className="font-semibold text-blue-600">NEET/JEE (+4/-1)</span>
                </div>
              </div>
            </div>

            {/* Detailed Results with Explanations */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Detailed Results & Explanations</h3>
                <button
                  onClick={() => setShowDetailedResults(!showDetailedResults)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                >
                  <span>{showDetailedResults ? 'Hide Details' : 'Show Details'}</span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${showDetailedResults ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {showDetailedResults && (
                <div className="space-y-6">
                {test.questions.map((question, index) => {
                  const userAnswer = answers[question._id]
                  const isCorrect = userAnswer === question.correctAnswer
                  const marks = isCorrect ? '+4' : userAnswer !== undefined ? '-1' : '0'
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Question {index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isCorrect ? 'bg-green-100 text-green-800' : 
                            userAnswer !== undefined ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {isCorrect ? 'Correct' : userAnswer !== undefined ? 'Incorrect' : 'Unattempted'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isCorrect ? 'bg-green-100 text-green-800' : 
                            userAnswer !== undefined ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {marks} marks
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-900 font-medium leading-relaxed mb-3">
                          {question.text || question.question}
                        </p>
                        
                        {/* Question Image */}
                        {question.image && (
                          <div className="mb-3">
                            <img 
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${question.image.filename}`}
                              alt="Question"
                              className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">Options:</h5>
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex} 
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              optionIndex === question.correctAnswer
                                ? 'border-green-500 bg-green-50'
                                : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                optionIndex === question.correctAnswer
                                  ? 'border-green-500 bg-green-500'
                                  : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-gray-300 bg-white'
                              }`}>
                                {optionIndex === question.correctAnswer && (
                                  <FaCheck className="text-white text-xs" />
                                )}
                                {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                                  <FaTimes className="text-white text-xs" />
                                )}
                              </div>
                              <div className="flex-1">
                                                                 <span className={`text-sm ${
                                   optionIndex === question.correctAnswer
                                     ? 'text-green-800 font-medium'
                                     : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                     ? 'text-red-800 font-medium'
                                     : 'text-gray-700'
                                 }`}>
                                   {String.fromCharCode(65 + optionIndex)}. {typeof option === 'string' ? option : (option.text || '')}
                                 </span>
                                
                                                                 {/* Option Image */}
                                 {typeof option === 'object' && option.image && (
                                   <div className="mt-2">
                                     <img 
                                       src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${option.image.filename}`}
                                       alt="Option"
                                       className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                                     />
                                   </div>
                                 )}
                              </div>
                              <div className="flex flex-col space-y-1">
                                {optionIndex === question.correctAnswer && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Correct
                                  </span>
                                )}
                                {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                    Your Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      {(question.explanation || question.explanationImage) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h6 className="text-sm font-medium text-blue-900 mb-1">Explanation:</h6>
                          {question.explanation && (
                            <p className="text-sm text-blue-800 mb-2">{question.explanation}</p>
                          )}
                          {question.explanationImage && question.explanationImage.filename && (
                            <div className="mt-2">
                              <img 
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${question.explanationImage.filename}`}
                                alt="Explanation"
                                className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
                </div>
              )}
            </div>

            <div className="text-center space-y-3 md:space-y-0 md:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300 text-sm md:text-base w-full md:w-auto"
              >
                Back to Home
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300 text-sm md:text-base w-full md:w-auto"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  const currentQuestion = test.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Timer Bar - Mobile Friendly */}
      <div className="fixed top-20 md:top-16 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-2 md:py-3">
          {/* Desktop Timer Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaClock className="text-red-500" />
                <span className="font-mono text-lg font-semibold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-600 font-semibold">+4</span>
                <span className="text-gray-400">|</span>
                <span className="text-red-600 font-semibold">-1</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">NEET/JEE</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={submitTest}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors duration-300"
              >
                <FaStop className="inline mr-1" />
                Submit Test
              </button>
            </div>
          </div>

          {/* Mobile Timer Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FaClock className="text-red-500" />
                <span className="font-mono text-base font-semibold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {currentQuestionIndex + 1}/{test.questions.length}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-600 font-semibold">+4</span>
                <span className="text-gray-400">|</span>
                <span className="text-red-600 font-semibold">-1</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">NEET/JEE</span>
              </div>
              <button
                onClick={submitTest}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors duration-300"
              >
                <FaStop className="inline mr-1" />
                Submit
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 pt-40 md:pt-32">
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
          {/* Question Navigation - Mobile Friendly */}
          <div className="mb-4 md:mb-6">
            <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
              {test.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-semibold transition-colors duration-300 ${
                    index === currentQuestionIndex
                      ? 'bg-blue-500 text-white'
                      : getQuestionStatus(index) === 'answered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            {/* Question Status Legend - Mobile Friendly */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Current</span>
              </div>
            </div>
          </div>

          {/* Question - Mobile Friendly */}
          <div className="mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {currentQuestion.text || currentQuestion.question}
              </p>
              
              {/* Question Image */}
              {currentQuestion.image && (
                <div className="mt-4">
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${currentQuestion.image.filename}`}
                    alt="Question"
                    className="max-w-full h-auto max-h-64 md:max-h-80 rounded-lg border border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Options - Mobile Friendly */}
            <div className="space-y-2 md:space-y-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(currentQuestion._id, optionIndex)}
                  className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                    answers[currentQuestion._id] === optionIndex
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      answers[currentQuestion._id] === optionIndex
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion._id] === optionIndex && (
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm md:text-base text-gray-700 leading-relaxed">
                        {typeof option === 'string' ? option : (option.text || '')}
                      </span>
                      
                      {/* Option Image */}
                      {typeof option === 'object' && option.image && (
                        <div className="mt-2">
                          <img 
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/question-images/${option.image.filename}`}
                            alt="Option"
                            className="max-w-full h-auto max-h-32 rounded-lg border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Mobile Friendly */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm md:text-base"
            >
              <FaArrowLeft className="text-sm md:text-base" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === test.questions.length - 1}
              className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 text-sm md:text-base"
            >
              <span className="hidden sm:inline">Next</span>
              <FaArrowRight className="text-sm md:text-base" />
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default TestPage 