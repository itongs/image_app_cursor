import { NextRequest, NextResponse } from 'next/server';
import { AssessmentResult, UploadResponse } from '@/app/types';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test cases for validation
const TEST_CASES = {
  phoneIdentification: {
    valid: {
      make: "Apple",
      model: "iPhone 14 Pro",
      color: "Space Black",
      year: "2022",
      storage: "256GB",
      screen_size: "6.1-inch",
      confidence: 0.95
    },
    required: ['make', 'model', 'color', 'confidence']
  },
  damageAssessment: {
    valid: {
      damage_type: "cracked_screen",
      severity: "high",
      affected_areas: ["front_screen", "touch_functionality"],
      description: "Severe crack across the entire front screen with touch sensitivity issues",
      estimated_repair_time: "2-3 hours",
      confidence: 0.9
    },
    required: ['damage_type', 'severity', 'affected_areas', 'description', 'estimated_repair_time', 'confidence']
  },
  costEstimation: {
    valid: {
      repair_cost: { min: 300, max: 600, currency: "USD" },
      replacement_cost: { amount: 1299, currency: "USD" },
      confidence: 0.85
    },
    required: ['repair_cost', 'replacement_cost', 'confidence']
  }
};

// Helper function to validate JSON structure
function validateResponse(data: any, testCase: any, stepName: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if all required fields are present
  for (const field of testCase.required) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Type validation
  if (data.confidence !== undefined && (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1)) {
    errors.push('Confidence must be a number between 0 and 1');
  }
  
  if (data.severity !== undefined && !['low', 'medium', 'high', 'critical'].includes(data.severity)) {
    errors.push('Severity must be one of: low, medium, high, critical');
  }
  
  if (data.affected_areas !== undefined && (!Array.isArray(data.affected_areas) || data.affected_areas.length === 0)) {
    errors.push('Affected areas must be a non-empty array');
  }
  
  if (data.repair_cost !== undefined && (!data.repair_cost.min || !data.repair_cost.max || !data.repair_cost.currency)) {
    errors.push('Repair cost must have min, max, and currency fields');
  }
  
  if (data.replacement_cost !== undefined && (!data.replacement_cost.amount || !data.replacement_cost.currency)) {
    errors.push('Replacement cost must have amount and currency fields');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper function to clean and parse JSON response
function parseAIResponse(content: string, stepName: string): any {
  let cleanedContent = content || '{}';
  
  console.log(`🔍 Raw AI response (${stepName}):`, cleanedContent);
  
  // Clean up markdown formatting if present
  if (cleanedContent.includes('```json')) {
    cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }
  
  // Remove any leading/trailing whitespace
  cleanedContent = cleanedContent.trim();
  
  console.log(`🔍 Cleaned content (${stepName}):`, cleanedContent);
  
  try {
    const parsed = JSON.parse(cleanedContent);
    return parsed;
  } catch (error) {
    console.error(`❌ JSON parsing failed for ${stepName}:`, error);
    console.error(`❌ Failed content:`, cleanedContent);
    throw new Error(`Invalid JSON response from AI for ${stepName}: ${cleanedContent}`);
  }
}

// Step 1: Phone Identification
async function identifyPhone(imageUrl: string): Promise<{
  make: string;
  model: string;
  color: string;
  year?: string;
  storage?: string;
  screen_size?: string;
  confidence: number;
}> {
  const phoneIdentificationPrompt = `
Analyze this phone image and identify the device specifications.

Return ONLY a valid JSON object with these fields:
- make (string)
- model (string) 
- color (string)
- year (string, optional)
- storage (string, optional)
- screen_size (string, optional)
- confidence (number between 0 and 1)

Example: {"make": "Apple", "model": "iPhone 14 Pro", "color": "Space Black", "year": "2022", "storage": "256GB", "screen_size": "6.1-inch", "confidence": 0.95}
`;

  try {
    console.log('🔍 Step 1: Identifying phone...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: phoneIdentificationPrompt },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }]
    });

    const result = parseAIResponse(response.choices[0].message.content || '{}', 'phone identification');
    
    // Validate the response
    const validation = validateResponse(result, TEST_CASES.phoneIdentification, 'phone identification');
    if (!validation.isValid) {
      console.error(`❌ Phone identification validation failed:`, validation.errors);
      throw new Error(`Phone identification failed validation: ${validation.errors.join(', ')}`);
    }
    
    console.log('✅ Phone identification successful:', result);
    
    return {
      make: result.make || 'Unknown',
      model: result.model || 'Unknown',
      color: result.color || 'Unknown',
      year: result.year,
      storage: result.storage,
      screen_size: result.screen_size,
      confidence: result.confidence || 0.8
    };
  } catch (error) {
    console.error('❌ Phone identification error:', error);
    throw new Error(`Phone identification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Step 2: Damage Assessment
async function assessDamage(imageUrl: string): Promise<{
  damage_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affected_areas: string[];
  description: string;
  estimated_repair_time: string;
  confidence: number;
}> {
  const damageAssessmentPrompt = `
Given this phone image, assess the damage.

Return ONLY a valid JSON object with these fields:
- damage_type (string)
- severity (string: "low", "medium", "high", "critical")
- affected_areas (array of strings)
- description (string)
- estimated_repair_time (string)
- confidence (number between 0 and 1)

Example: {"damage_type": "cracked_screen", "severity": "high", "affected_areas": ["front_screen", "touch_functionality"], "description": "Severe crack across the entire front screen with touch sensitivity issues", "estimated_repair_time": "2-3 hours", "confidence": 0.9}
`;

  try {
    console.log('🔍 Step 2: Assessing damage...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: damageAssessmentPrompt },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      }]
    });

    const result = parseAIResponse(response.choices[0].message.content || '{}', 'damage assessment');
    
    // Validate the response
    const validation = validateResponse(result, TEST_CASES.damageAssessment, 'damage assessment');
    if (!validation.isValid) {
      console.error(`❌ Damage assessment validation failed:`, validation.errors);
      throw new Error(`Damage assessment failed validation: ${validation.errors.join(', ')}`);
    }
    
    console.log('✅ Damage assessment successful:', result);
    
    return {
      damage_type: result.damage_type || 'unknown',
      severity: result.severity || 'medium',
      affected_areas: result.affected_areas || ['unknown'],
      description: result.description || 'Damage assessment unavailable',
      estimated_repair_time: result.estimated_repair_time || '1-2 days',
      confidence: result.confidence || 0.7
    };
  } catch (error) {
    console.error('❌ Damage assessment error:', error);
    throw new Error(`Damage assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Step 3: Cost Estimation
async function estimateCosts(phoneDetails: any, damageDetails: any): Promise<{
  repair_cost: { min: number; max: number; currency: string };
  replacement_cost: { amount: number; currency: string };
  confidence: number;
}> {
  const costEstimationPrompt = `
Based on this phone specification and damage assessment, estimate costs.

Phone: ${phoneDetails.model} ${phoneDetails.color} ${phoneDetails.storage || '128GB'}
Damage: ${damageDetails.damage_type} - ${damageDetails.severity}

Return ONLY a valid JSON object with these fields:
- repair_cost (object with min, max, currency)
- replacement_cost (object with amount, currency)
- confidence (number between 0 and 1)

Example: {"repair_cost": {"min": 300, "max": 600, "currency": "USD"}, "replacement_cost": {"amount": 1299, "currency": "USD"}, "confidence": 0.85}
`;

  try {
    console.log('🔍 Step 3: Estimating costs...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: costEstimationPrompt
      }]
    });

    const result = parseAIResponse(response.choices[0].message.content || '{}', 'cost estimation');
    
    // Validate the response
    const validation = validateResponse(result, TEST_CASES.costEstimation, 'cost estimation');
    if (!validation.isValid) {
      console.error(`❌ Cost estimation validation failed:`, validation.errors);
      throw new Error(`Cost estimation failed validation: ${validation.errors.join(', ')}`);
    }
    
    console.log('✅ Cost estimation successful:', result);
    
    return {
      repair_cost: {
        min: result.repair_cost?.min || 150,
        max: result.repair_cost?.max || 300,
        currency: result.repair_cost?.currency || 'USD'
      },
      replacement_cost: {
        amount: result.replacement_cost?.amount || 500,
        currency: result.replacement_cost?.currency || 'USD'
      },
      confidence: result.confidence || 0.7
    };
  } catch (error) {
    console.error('❌ Cost estimation error:', error);
    throw new Error(`Cost estimation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main analysis function using sub-prompts
async function analyzePhoneDamage(imageUrl: string): Promise<AssessmentResult> {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    console.log('🚀 Starting AI analysis...');
    
    // Step 1: Phone Identification
    let phoneDetails;
    try {
      phoneDetails = await identifyPhone(imageUrl);
    } catch (error) {
      errors.push(`Phone identification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      phoneDetails = {
        make: 'Unknown',
        model: 'Unknown',
        color: 'Unknown',
        year: undefined,
        storage: undefined,
        screen_size: undefined,
        confidence: 0.1
      };
    }

    // Step 2: Damage Assessment
    let damageDetails;
    try {
      damageDetails = await assessDamage(imageUrl);
    } catch (error) {
      errors.push(`Damage assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
             damageDetails = {
         damage_type: 'unknown',
         severity: 'medium' as const,
         affected_areas: ['unknown'],
         description: 'Damage assessment unavailable',
         estimated_repair_time: '1-2 days',
         confidence: 0.1
       };
    }

    // Step 3: Cost Estimation
    let costDetails;
    try {
      costDetails = await estimateCosts(phoneDetails, damageDetails);
    } catch (error) {
      errors.push(`Cost estimation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      costDetails = {
        repair_cost: {
          min: 150,
          max: 300,
          currency: 'USD'
        },
        replacement_cost: {
          amount: 500,
          currency: 'USD'
        },
        confidence: 0.1
      };
    }

    const processingTime = (Date.now() - startTime) / 1000;

    // Log any errors that occurred
    if (errors.length > 0) {
      console.warn('⚠️ Some AI analysis steps failed:', errors);
    }

    return {
      phoneMetadata: {
        make: phoneDetails.make,
        model: phoneDetails.model,
        color: phoneDetails.color,
        year: phoneDetails.year,
        confidence: phoneDetails.confidence
      },
      damageSummary: {
        description: damageDetails.description,
        severity: damageDetails.severity,
        affectedAreas: damageDetails.affected_areas,
        estimatedRepairTime: damageDetails.estimated_repair_time
      },
      costEstimate: {
        repairCost: costDetails.repair_cost,
        replacementCost: costDetails.replacement_cost,
        confidence: costDetails.confidence
      },
      processingTime,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Analysis error:', error);
    return getFallbackResult();
  }
}

// Fallback result if AI analysis fails
function getFallbackResult(): AssessmentResult {
  return {
    phoneMetadata: {
      make: 'Unknown',
      model: 'Unknown',
      color: 'Unknown',
      year: undefined,
      confidence: 0.1
    },
    damageSummary: {
      description: 'Analysis unavailable - please try again or contact support',
      severity: 'medium',
      affectedAreas: ['unknown'],
      estimatedRepairTime: 'Unknown'
    },
    costEstimate: {
      repairCost: {
        min: 0,
        max: 0,
        currency: 'USD'
      },
      replacementCost: {
        amount: 0,
        currency: 'USD'
      },
      confidence: 0.1
    },
    processingTime: 0,
    timestamp: new Date().toISOString()
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({
        success: false,
        error: 'Image URL is required'
      }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid image URL format'
      }, { status: 400 });
    }

    console.log('📸 Processing image:', imageUrl);
    const result = await analyzePhoneDamage(imageUrl);

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('❌ Assessment error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process image'
    }, { status: 500 });
  }
} 