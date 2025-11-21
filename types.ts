
export interface ClassRequest {
  id: string;
  form: string;
  className: string;
  noOfCopies: number;
  teacherInCharge: string;
}

export interface PrintRequest {
  id: string;
  class: string;
  teacherInCharge: string;
  subject: string;
  dateOfSubmission: string;
  dateOfCollection: string;
  noOfPagesOriginal: number;
  noOfCopies: number;
  totalPrintedPages: number;
  singleSided: boolean;
  stapling: boolean;
  whitePaper: boolean;
  remarks: string;
  signature: string;
  classRequests: ClassRequest[];
  status: 'Pending' | 'In Progress' | 'Completed';
  meterPhotoBefore?: string; // base64 data URL
  meterPhotoAfter?: string; // base64 data URL
  adjustedCopies?: number;
  staffRemarks?: string;
}

export enum AppView {
  TEACHER = 'teacher',
  STAFF = 'staff',
  PRINT = 'print',
}
