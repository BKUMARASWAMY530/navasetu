export type Language = 'en' | 'te' | 'hi';

export interface UserProfile {
  age: number;
  gender: 'all' | 'male' | 'female' | 'other';
  occupation: string;
  annualIncome: number;
  education: string;
  district: string;
  category: string; // e.g., 'SC', 'ST', 'OBC', 'General'
}

export interface Scheme {
  id: string;
  name: string;
  nameLocal: {
    te: string;
    hi: string;
  };
  department: string;
  benefit: string;
  benefitLocal: {
    te: string;
    hi: string;
  };
  eligibility: string;
  eligibilityLocal: {
    te: string;
    hi: string;
  };
  requiredDocuments: string[];
  applicationProcess: string;
  applicationProcessLocal: {
    te: string;
    hi: string;
  };
  deadline: string;
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  allowedGender?: ('all' | 'male' | 'female' | 'other')[];
  allowedCategory?: string[]; // e.g., SC, ST, OBC, General, All
}

export interface ProjectCostFactors {
  lengthKm?: number;
  widthMeters?: number;
  floors?: number;
  beds?: number;
  classrooms?: number;
  materialQuality: 'standard' | 'premium' | 'economy';
  terrainType?: 'plain' | 'hilly' | 'marshy';
}

export interface Project {
  id: string;
  title: string;
  titleLocal: {
    te: string;
    hi: string;
  };
  category: 'Road' | 'Bridge' | 'Hospital' | 'School' | 'Water';
  budget: number; // in INR Rupees (Crores/Lakhs)
  contractor: string;
  location: string;
  locationLocal: {
    te: string;
    hi: string;
  };
  completionPercent: number;
  expectedCompletionDate: string;
  details: string;
  detailsLocal: {
    te: string;
    hi: string;
  };
  lat: number; // relative grid coordinates for beautiful custom visual map
  lng: number;
  flagged: boolean;
  flagReason?: string;
  flagReasonLocal?: {
    te: string;
    hi: string;
  };
  estimatedCostRange?: {
    min: number;
    max: number;
  };
}

export interface Notification {
  id: string;
  type: 'scheme' | 'project' | 'general';
  title: string;
  titleLocal: {
    te: string;
    hi: string;
  };
  message: string;
  messageLocal: {
    te: string;
    hi: string;
  };
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioData?: string; // base64 pcm / wav audio data for voice playback
  isVoiceInput?: boolean;
}
