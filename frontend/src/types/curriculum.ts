export interface Lesson {
  title: string;
  description: string;
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
}

export interface CurriculumOutline {
  title: string;
  slug: string;
  modules: Module[];
}
