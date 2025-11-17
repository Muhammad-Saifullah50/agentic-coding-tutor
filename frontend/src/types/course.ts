// ---------- QUIZ MODELS ----------
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizLesson {
  id: string;
  title: string;
  type: "quiz";
  duration: string;
  completed: boolean;
  locked: boolean;
  questions: QuizQuestion[];
}

// ---------- CONTENT LESSON ----------
export interface ContentLesson {
  id: string;
  title: string;
  type: "content";
  duration: string;
  completed: boolean;
  locked: boolean;
  content: string;
  codeExample?: string;
}

// ---------- PLAYGROUND LESSON ----------
export interface PlaygroundLesson {
  id: string;
  title: string;
  type: "playground";
  duration: string;
  completed: boolean;
  locked: boolean;
  description: string;
  language: string;
  starterCode: string;
  challenge: string;
  hints: string[];
}

// Union of all lesson types
export type Lesson =
  | ContentLesson
  | QuizLesson
  | PlaygroundLesson;

// ---------- MODULE ----------
export interface Module {
  title: string;
  description?: string;
  lessons: Lesson[];
}

// ---------- FULL COURSE ----------
export interface FullCourse {
  title: string;
  slug: string;
  course_id:string
  modules: Module[];
}

export interface FullCourseData {
  course_id: string;
  created_at:string
  id:number;
  slug: string;
  title:string;
  user_id:string
  course_data: FullCourse
}