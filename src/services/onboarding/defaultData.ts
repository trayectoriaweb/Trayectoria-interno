import { OnboardingData } from '../../types';

export function createDefaultOnboardingData(initial?: Partial<OnboardingData['personal']>): OnboardingData {
  return {
    step: 0,
    status: 'No iniciado',
    progressPercentage: 0,
    lastSavedAt: new Date().toISOString(),
    personal: {
      firstName: initial?.firstName || '',
      lastName: initial?.lastName || '',
      brandName: initial?.brandName || '',
      preferredName: initial?.preferredName || '',
      profession: initial?.profession || '',
      specialty: initial?.specialty || '',
      city: initial?.city || '',
      email: initial?.email || '',
      whatsapp: initial?.whatsapp || '',
      photoStatus: 'send_later',
      photoUrl: initial?.photoUrl || '',
    },
    story: {
      presentation: '',
      experiences: [],
      education: [],
    },
    offer: {
      services: [{ id: 'srv-1', name: '', description: '' }],
      specialties: [],
      showProjects: false,
      projects: [],
    },
    contact: {
      email: initial?.email || '',
      whatsapp: initial?.whatsapp || '',
      instagram: '',
      linkedin: '',
      website: '',
      behance: '',
      other: '',
      primaryContactMethod: 'WhatsApp',
      showLocation: false,
      city: initial?.city || '',
      province: '',
      country: 'Argentina',
      address: '',
      googleMapsUrl: '',
    },
    style: {
      hasLogo: false,
      logoUrl: '',
      colors: [],
      customColorNotes: '',
      referenceUrls: [],
      referenceNotes: '',
      moodTags: ['Profesional', 'Minimalista'],
      negativePreferences: '',
      additionalPhotosNotes: '',
    },
  };
}

export function calculateOnboardingProgress(data: OnboardingData): number {
  let score = 0;
  const totalWeight = 100;

  // Step 1: Personal (25 pts)
  if (data.personal.firstName && data.personal.lastName) score += 10;
  if (data.personal.profession) score += 10;
  if (data.personal.email || data.personal.whatsapp) score += 5;

  // Step 2: Story (20 pts)
  if (data.story.presentation && data.story.presentation.trim().length > 10) score += 15;
  if (data.story.experiences.length > 0 || data.story.education.length > 0) score += 5;

  // Step 3: Offer (25 pts)
  if (data.offer.services.some((s) => s.name.trim())) score += 20;
  if (data.offer.specialties.length > 0 || data.offer.projects.length > 0) score += 5;

  // Step 4: Contact (15 pts)
  if (data.contact.whatsapp || data.contact.email || data.contact.instagram) score += 15;

  // Step 5: Style (15 pts)
  if (data.style.moodTags.length > 0) score += 10;
  if (data.style.colors.length > 0 || data.style.customColorNotes || data.style.referenceUrls.length > 0) score += 5;

  return Math.min(Math.round((score / totalWeight) * 100), 100);
}
