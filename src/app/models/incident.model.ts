export interface Incident {
  id?: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: string[];
}

