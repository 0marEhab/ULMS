export interface SuspiciousAlert {
  id?: string;
  type:
    | "no_face"
    | "multiple_faces"
    | "face_mismatch"
    | "error";
  message: string;
  timestamp: number;
  severity: "low" | "medium" | "high";
  studentId?: string;
  studentName?: string;
  examId?: string;
}

export interface WebSocketResponse {
  match: boolean;
  multiple_faces: boolean;
  face_count: number;
  error?: string;
  type: string;
  timestamp: number;
}
