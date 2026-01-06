'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Sparkles, Trophy, CheckCircle, PlayCircle, X } from 'lucide-react';
import Image from 'next/image';
import { EducationalIDE } from '../../components/ide/EducationalIDE';

const courses = [
    {
        id: 'week1',
        title: 'Week 1: Your First Steps',
        subtitle: 'Variables, Output, Simple Math',
        icon: '🥳',
        lessons: [
            {
                title: 'Lesson 1: Hello, Pumpkin!',
                description: 'Learn how to show text on the screen',
                code: `# Your very first Pumpkin program!
show "Hello, World!"
show "Welcome to Pumpkin! 🎃"`,
                explanation: 'The `show` command displays text. Think of it like talking to your computer!',
                challenge: 'Try showing your own message!'
            },
            {
                title: 'Lesson 2: Variables are Boxes',
                description: 'Store values in labeled boxes',
                code: `# Variables are like labeled boxes
let age = 25
show "I am"
show age
show "years old"`,
                explanation: 'A variable is a labeled box. You put a value inside and can look at it anytime!',
                challenge: 'Create a variable with your favorite number!'
            },
            {
                title: 'Lesson 3: Math Magic',
                description: 'Do calculations with numbers',
                code: `let apples = 5
let oranges = 3
let total = apples + oranges
show "I have"
show total
show "fruits! 🍎"`,
                explanation: 'You can add (+), subtract (-), multiply (*), and divide (/) numbers!',
                challenge: 'Calculate 10 * 7 and show the result!'
            }
        ]
    },
    {
        id: 'week2',
        title: 'Week 2: Making Decisions',
        subtitle: 'Conditionals and Boolean Logic',
        icon: '🤔',
        lessons: [
            {
                title: 'Lesson 1: If This, Then That',
                description: 'Make your code smart with choices',
                code: `let score = 95

if score >= 90 {
    show "You got an A! 🌟"
}`,
                explanation: 'The `if` statement lets code make decisions. If the condition is true, the code inside runs!',
                challenge: 'Add an else block for scores below 90!'
            },
            {
                title: 'Lesson 2: True or False',
                description: 'Understanding boolean values',
                code: `let is_raining = true
let has_umbrella = false

if is_raining or has_umbrella {
    show "Stay dry! ☂️"
}`,
                explanation: 'Boolean values are either `true` or `false`. Perfect for yes/no questions!',
                challenge: 'Create a program that checks if someone is old enough to drive (age >= 16)!'
            }
        ]
    },
    {
        id: 'week3',
        title: 'Week 3: Repeat Yourself',
        subtitle: 'Loops and Iteration',
        icon: '🔁',
        lessons: [
            {
                title: 'Lesson 1: Repeat Fixed Times',
                description: 'Do something multiple times',
                code: `repeat 5 times {
    show "Hip hip hooray! 🎉"
}`,
                explanation: 'The `repeat` loop does something a fixed number of times. No need to copy-paste!',
                challenge: 'Make a countdown from 10 to 1!'
            },
            {
                title: 'Lesson 2: While Loops',
                description: 'Repeat until a condition is false',
                code: `let countdown = 5

while countdown > 0 {
    show countdown
    countdown = countdown - 1
}
show "Blastoff! 🚀"`,
                explanation: 'A `while` loop keeps going as long as the condition is true. Make sure it eventually stops!',
                challenge: 'Create a loop that doubles a number until it exceeds 100!'
            }
        ]
    },
    {
        id: 'week4',
        title: 'Week 4: Functions',
        subtitle: 'Reusable Code Blocks',
        icon: '📦',
        lessons: [
            {
                title: 'Lesson 1: Creating Functions',
                description: 'Package code for reuse',
                code: `function greet(name) {
    show "Hello,"
    show name
    show "! Welcome! 👋"
}

greet("Alice")
greet("Bob")`,
                explanation: 'Functions are like recipes. Define them once, use them many times!',
                challenge: 'Create a function that greets someone based on the time of day!'
            },
            {
                title: 'Lesson 2: Return Values',
                description: 'Get results from functions',
                code: `function add(a, b) {
    return a + b
}

let sum = add(10, 5)
show "10 + 5 ="
show sum`,
                explanation: 'Functions can give back a result using `return`. Like a vending machine!',
                challenge: 'Create a function that calculates the area of a rectangle!'
            }
        ]
    }
];

export default function LearnPage() {
    const [selectedCourse, setSelectedCourse] = useState(courses[0]);
    const [selectedLesson, setSelectedLesson] = useState(courses[0].lessons[0]);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [showIDE, setShowIDE] = useState(false);

    const markComplete = (courseId: string, lessonTitle: string) => {
        const key = `${courseId}-${lessonTitle}`;
        setCompletedLessons(prev => new Set([...prev, key]));
    };

    const isComplete = (courseId: string, lessonTitle: string) => {
        return completedLessons.has(`${courseId}-${lessonTitle}`);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-6"
                    >
                        <Image
                            src="/images/mascot_happy.svg"
                            alt="Happy Pumpkin Teacher"
                            width={140}
                            height={140}
                            className="drop-shadow-mascot animate-float"
                        />
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-crazy font-extrabold mb-8 text-gray-900 relative">
                        <span className="relative z-10">Learn Pumpkin! 🎓</span>
                        <div className="absolute -inset-2 bg-pumpkin-orange/20 blur-2xl rounded-full -z-10" />
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-800 font-bold max-w-3xl mx-auto leading-relaxed">
                        Start your coding journey with interactive lessons, live examples, and our derpy pumpkin friends!
                    </p>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-pumpkin-orange/15 rounded-full blur-3xl -z-0" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-accent/15 rounded-full blur-3xl -z-0" />
            </section>

            {/* Learning Path */}
            <section className="py-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-crazy font-extrabold mb-8 text-gray-900 relative inline-block">
                            Your Learning Path 🗺️
                            <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-pumpkin-orange to-pumpkin-dark rounded-full" />
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {courses.map((course) => (
                            <motion.button
                                key={course.id}
                                onClick={() => {
                                    setSelectedCourse(course);
                                    setSelectedLesson(course.lessons[0]);
                                }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-8 rounded-[40px] transition-all duration-300 relative overflow-hidden border-2 ${selectedCourse.id === course.id
                                    ? 'bg-pumpkin-orange text-white border-pumpkin-orange shadow-feature-hover'
                                    : 'bg-white/40 backdrop-blur-xl text-gray-900 border-white/20 shadow-feature hover:border-pumpkin-orange/40 hover:bg-white/60'
                                    }`}
                            >
                                <div className="text-6xl mb-4 drop-shadow-lg">{course.icon}</div>
                                <h3 className="font-heading text-xl mb-2 font-extrabold">{course.title}</h3>
                                <p className={`text-sm font-medium ${selectedCourse.id === course.id ? 'text-white/90' : 'text-gray-600'}`}>
                                    {course.subtitle}
                                </p>
                                <div className={`mt-6 flex items-center justify-center gap-2 py-2 px-4 rounded-full font-bold ${selectedCourse.id === course.id ? 'bg-white/20' : 'bg-pumpkin-orange/10 text-pumpkin-orange'
                                    }`}>
                                    <Trophy className="w-4 h-4" />
                                    <span className="text-sm">
                                        {course.lessons.filter(l => isComplete(course.id, l.title)).length}/{course.lessons.length}
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Lesson Content */}
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Lesson List */}
                        <div className="lg:col-span-4 space-y-4">
                            <h3 className="text-2xl font-crazy font-bold mb-6 text-gray-900 flex items-center gap-3">
                                📚 <span className="underline decoration-pumpkin-orange decoration-4">Lessons</span>
                            </h3>
                            <div className="space-y-3">
                                {selectedCourse.lessons.map((lesson, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => setSelectedLesson(lesson)}
                                        whileHover={{ x: 10 }}
                                        className={`w-full text-left p-5 rounded-3xl transition-all duration-300 border-2 ${selectedLesson.title === lesson.title
                                            ? 'bg-teal-accent text-white border-teal-accent shadow-lg'
                                            : 'bg-white/30 backdrop-blur-lg text-gray-700 border-white/20 hover:border-teal-accent/30 hover:bg-white/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            {isComplete(selectedCourse.id, lesson.title) ? (
                                                <div className="bg-green-500 rounded-full p-1 shadow-inner">
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-7 h-7 border-2 border-gray-300 rounded-full flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-heading font-extrabold text-lg leading-tight">{lesson.title}</h4>
                                                <p className="text-sm font-medium opacity-80 mt-1">{lesson.description}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Lesson Detail */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedLesson.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="content-card relative group overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                            <h2 className="text-3xl md:text-4xl font-crazy font-extrabold text-gray-900 leading-tight">
                                                {selectedLesson.title}
                                            </h2>
                                            <div className="flex items-center gap-2 bg-pumpkin-orange/10 text-pumpkin-orange px-4 py-2 rounded-full font-bold self-start">
                                                <Sparkles className="w-5 h-5" />
                                                <span>Level: Beginner</span>
                                            </div>
                                        </div>

                                        {/* Explanation */}
                                        <div className="bg-teal-accent/5 backdrop-blur-sm border-2 border-teal-accent/20 rounded-[30px] p-6 mb-8">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-teal-accent rounded-2xl flex items-center justify-center shadow-lg">
                                                    <Sparkles className="w-6 h-6 text-white" />
                                                </div>
                                                <p className="text-gray-800 font-bold text-lg leading-relaxed">{selectedLesson.explanation}</p>
                                            </div>
                                        </div>

                                        {/* Code Example */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-heading font-extrabold mb-4 flex items-center gap-3 text-gray-900">
                                                <Code className="w-6 h-6 text-pumpkin-orange" />
                                                Example Code
                                            </h3>
                                            <div className="bg-burgundy-dark rounded-[30px] p-8 font-code text-sm overflow-x-auto border-4 border-white/5 shadow-inner">
                                                <pre className="text-emerald-400 leading-relaxed"><code className="whitespace-pre-wrap">{selectedLesson.code}</code></pre>
                                            </div>
                                        </div>

                                        {/* Challenge */}
                                        <div className="bg-pumpkin-orange/5 backdrop-blur-sm border-2 border-pumpkin-orange/20 rounded-[30px] p-6 mb-10">
                                            <h3 className="font-heading font-extrabold text-xl mb-3 flex items-center gap-3 text-gray-900">
                                                <div className="w-10 h-10 bg-pumpkin-orange rounded-2xl flex items-center justify-center shadow-lg">
                                                    <Trophy className="w-6 h-6 text-white" />
                                                </div>
                                                Tonight&apos;s Challenge
                                            </h3>
                                            <p className="text-gray-800 font-bold pl-14">{selectedLesson.challenge}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-6 pt-4 border-t-2 border-white/5">
                                            <button
                                                onClick={() => setShowIDE(true)}
                                                className="btn btn-primary px-10 py-4 text-lg shadow-hero flex items-center gap-3"
                                            >
                                                <PlayCircle className="w-6 h-6" />
                                                Try in Playground
                                            </button>
                                            <button
                                                onClick={() => markComplete(selectedCourse.id, selectedLesson.title)}
                                                disabled={isComplete(selectedCourse.id, selectedLesson.title)}
                                                className={`btn ${isComplete(selectedCourse.id, selectedLesson.title)
                                                    ? 'bg-green-500 text-white shadow-none opacity-80'
                                                    : 'btn-outline px-10 py-4 text-lg'
                                                    } flex items-center gap-3`}
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                                {isComplete(selectedCourse.id, selectedLesson.title) ? 'Lesson Perfected!' : 'Mastered It'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Decorative SVG elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-pumpkin-orange/5 rounded-full blur-2xl -mr-16 -mt-16" />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* IDE Modal */}
            <AnimatePresence>
                {showIDE && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-burgundy-dark/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setShowIDE(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
                            className="bg-white/90 backdrop-blur-2xl rounded-[50px] border border-white/30 shadow-2xl max-w-7xl w-full h-[90vh] overflow-hidden flex flex-col relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white/40 backdrop-blur-md p-6 flex items-center justify-between border-b border-white/20 relative z-10">
                                <h3 className="text-2xl font-crazy font-extrabold flex items-center gap-4 text-gray-900">
                                    <div className="bg-pumpkin-orange p-2.5 rounded-2xl shadow-lg">
                                        <Code className="w-7 h-7 text-white" />
                                    </div>
                                    {selectedLesson.title}
                                </h3>
                                <button
                                    onClick={() => setShowIDE(false)}
                                    className="p-3 hover:bg-white/60 rounded-full border border-white/20 shadow-sm transition-all hover:rotate-90"
                                >
                                    <X size={24} className="text-gray-900" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                <EducationalIDE
                                    key={selectedLesson.title}
                                    initialCode={selectedLesson.code}
                                    lessonTitle={selectedLesson.title}
                                />
                                {/* Bottom decoration in IDE modal */}
                                <div className="absolute bottom-4 right-4 z-50 pointer-events-none">
                                    <Image src="/images/mascot_happy.svg" alt="Tutor" width={80} height={80} className="drop-shadow-lg opacity-40" />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
