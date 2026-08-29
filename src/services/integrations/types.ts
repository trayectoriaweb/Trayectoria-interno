export interface IntegrationStatus {
  id: 'supabase' | 'github' | 'cloudflare' | 'nic_ar' | 'email';
  name: string;
  category: string;
  configured: boolean;
  statusText: string;
  description: string;
  requiredCredentials: {
    name: string;
    envVar: string;
    purpose: string;
    isSecret: boolean;
  }[];
  plannedAutomations: string[];
}
