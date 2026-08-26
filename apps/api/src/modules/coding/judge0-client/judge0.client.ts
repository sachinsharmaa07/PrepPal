import axios from 'axios';

export interface Judge0SubmissionData {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface Judge0Response {
  token: string;
}

export interface Judge0SubmissionResult {
  status: {
    id: number;
    description: string;
  };
  time?: number;
  memory?: number;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
}

export class Judge0Client {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.JUDGE0_URL || 'http://localhost:2358';
  }

  async submitCode(data: Judge0SubmissionData): Promise<string> {
    const response = await axios.post<Judge0Response>(
      `${this.baseUrl}/submissions`,
      data,
      { params: { base64_encoded: false, wait: false } }
    );
    return response.data.token;
  }

  async getSubmissionResult(token: string): Promise<Judge0SubmissionResult> {
    const response = await axios.get<Judge0SubmissionResult>(
      `${this.baseUrl}/submissions/${token}`,
      { params: { base64_encoded: false } }
    );
    return response.data;
  }
}
