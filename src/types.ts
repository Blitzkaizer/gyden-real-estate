export interface PropertyDocument {
  name: string;
  type: string;
  size: string;
  previewContent: string;
}

export interface Property {
  id: string;
  title: string;
  category: string;
  price: string;
  rawPrice: number;
  area: string;
  location: string;
  yield: string;
  status: string;
  description: string;
  documents: PropertyDocument[];
  features: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: Date;
}

export interface InvestmentInputs {
  principal: number; // RM
  monthlyContribution: number; // RM
  durationYears: number;
  targetYield: number; // %
  capitalGrowthExpectation: number; // %
}

export interface AssetAllocation {
  class: string;
  percentage: number;
  description: string;
  value: number;
  color: string;
}
