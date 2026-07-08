export interface BenefitItem {
  id: string;
  icon: string; // The Lucide icon string identifier
  title: string;
  description: string;
}

export interface FeatureItem {
  id: string;
  icon: string;
  prefix: string;
  title: string;
  description: string;
}

export interface PromptItem {
  id: string;
  category: string;
  title: string;
  description: string;
  template: string;
  variables: { [key: string]: string }; // default values for variables
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  photoUrl?: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
