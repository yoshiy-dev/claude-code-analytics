
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiAnalysisResult {
  estimated_commit_count: number;
  learning_curve_score: number;
  active_hours_heatmap: Record<string, number>;
  main_topics: string[];
  issue_categories: string[];
  recommended_actions: string[];
  warnings: string[];
  summary: string;
}

/**
 * Analyzes ZIP file contents using Google Gemini API
 */
export async function analyzeWithGemini(
  fileContent: string,
  fileName: string
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert code analysis assistant. Analyze the following Claude Code chat history export and provide a comprehensive analysis.

File: ${fileName}
Content Preview (first 5000 chars):
${fileContent.substring(0, 5000)}

Please analyze this chat history and provide a JSON response with the following structure:
{
  "estimated_commit_count": <number between 1-5000>,
  "learning_curve_score": <number between 0-100 representing learning progress>,
  "active_hours_heatmap": <object with keys "0"-"23" representing hourly activity counts>,
  "main_topics": <array of 3-5 main topics discussed>,
  "issue_categories": <array of 3-5 issue categories found>,
  "recommended_actions": <array of 3-5 recommended actions>,
  "warnings": <array of any warnings or concerns>,
  "summary": <brief 2-3 sentence summary of the analysis>
}

Focus on:
- Code quality discussions
- Bug fixes and issues
- Learning patterns
- Development practices
- Time-based activity patterns

Return ONLY valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const analysis = JSON.parse(jsonText);
    
    // Validate and normalize the response
    return {
      estimated_commit_count: Math.min(5000, Math.max(1, analysis.estimated_commit_count || 0)),
      learning_curve_score: Math.min(100, Math.max(0, analysis.learning_curve_score || 50)),
      active_hours_heatmap: analysis.active_hours_heatmap || generateDefaultHeatmap(),
      main_topics: Array.isArray(analysis.main_topics) ? analysis.main_topics.slice(0, 5) : [],
      issue_categories: Array.isArray(analysis.issue_categories) ? analysis.issue_categories.slice(0, 5) : [],
      recommended_actions: Array.isArray(analysis.recommended_actions) ? analysis.recommended_actions.slice(0, 5) : [],
      warnings: Array.isArray(analysis.warnings) ? analysis.warnings : [],
      summary: analysis.summary || 'Analysis completed successfully.',
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to analyze with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateDefaultHeatmap(): Record<string, number> {
  const heatmap: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    heatmap[i.toString()] = 0;
  }
  return heatmap;
}

/**
 * Extracts text content from ZIP file buffer
 */
export async function extractTextFromZip(buffer: ArrayBuffer): Promise<string> {
  // Simple text extraction - reads the buffer as text
  const decoder = new TextDecoder('utf-8');
  try {
    return decoder.decode(buffer);
  } catch (error) {
    // If decoding fails, return a summary of the file
    return `Binary ZIP file, size: ${buffer.byteLength} bytes`;
  }
}
