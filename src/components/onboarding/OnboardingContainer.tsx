import React, { useState, useEffect } from 'react';
import { OnboardingData, Client } from '../../types';
import { createDefaultOnboardingData, calculateOnboardingProgress } from '../../services/onboarding/defaultData';
import { db } from '../../services/db/repository';
import { Step0Welcome } from './Step0Welcome';
import { Step1AboutYou } from './Step1AboutYou';
import { Step2YourStory } from './Step2YourStory';
import { Step3WhatYouDo } from './Step3WhatYouDo';
import { Step4Contact } from './Step4Contact';
import { Step5StylePreferences } from './Step5StylePreferences';
import { Step6Review } from './Step6Review';
import { Step7Success } from './Step7Success';
import { Button } from '../common/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Save } from 'lucide-react';

interface OnboardingContainerProps {
  clientId?: string;
  onExit?: () => void;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ clientId, onExit }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<OnboardingData>(() => createDefaultOnboardingData());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Guardado automático');

  // Load existing client & saved onboarding progress
  useEffect(() => {
    let targetClient: Client | undefined;
    if (clientId) {
      targetClient = db.getClientById(clientId);
    } else {
      // Fallback: check if there's any client in local DB or create a demo placeholder
      const clients = db.getClients();
      targetClient = clients[0];
    }

    if (targetClient) {
      setClient(targetClient);

      if (targetClient.onboarding) {
        setFormData(targetClient.onboarding);
        if (targetClient.onboarding.status === 'Información recibida') {
          setCurrentStep(7);
        } else {
          setCurrentStep(targetClient.onboarding.step || 0);
        }
      } else {
        // Initialize from client data
        const initial = createDefaultOnboardingData({
          firstName: targetClient.fullName.split(' ')[0] || '',
          lastName: targetClient.fullName.split(' ').slice(1).join(' ') || '',
          brandName: targetClient.commercialName || '',
          preferredName: targetClient.fullName || '',
          profession: targetClient.profession || '',
          city: targetClient.city || '',
          email: targetClient.email || '',
          whatsapp: targetClient.whatsapp || '',
        });
        setFormData(initial);
      }
    }
  }, [clientId]);

  // Autosave whenever formData changes
  useEffect(() => {
    if (!client) return;

    setSaveStatus('Guardando...');
    const timer = setTimeout(() => {
      const progress = calculateOnboardingProgress(formData);
      const updatedOnboarding: OnboardingData = {
        ...formData,
        step: currentStep,
        progressPercentage: progress,
        lastSavedAt: new Date().toISOString(),
      };

      // Save to client
      db.updateClient(client.id, {
        onboarding: updatedOnboarding,
        onboardingStatus: updatedOnboarding.status,
      });

      setSaveStatus('Guardado');
    }, 600);

    return () => clearTimeout(timer);
  }, [formData, currentStep, client]);

  // Validation before step change
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.personal.firstName.trim()) errs.firstName = 'Por favor ingresá tu nombre.';
      if (!formData.personal.lastName.trim()) errs.lastName = 'Por favor ingresá tu apellido.';
      if (!formData.personal.profession.trim()) errs.profession = 'Por favor ingresá tu profesión.';
      if (!formData.personal.email.trim() && !formData.personal.whatsapp.trim()) {
        errs.email = 'Ingresá al menos un email o WhatsApp de contacto.';
      }
    }

    if (step === 2) {
      if (!formData.story.presentation.trim()) {
        errs.presentation = 'Por favor contanos una breve presentación (2 oraciones).';
      }
    }

    if (step === 3) {
      const hasValidService = formData.offer.services.some((s) => s.name.trim().length > 0);
      if (!hasValidService) {
        errs.services = 'Por favor ingresá al menos un servicio principal que ofrecés.';
      }
    }

    if (step === 4) {
      if (!formData.contact.email.trim() && !formData.contact.whatsapp.trim()) {
        errs.whatsapp = 'Ingresá al menos un WhatsApp o Email para que tus clientes puedan contactarte.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep >= 1 && currentStep <= 5) {
      if (!validateStep(currentStep)) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 7));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      if (client) {
        const finalData: OnboardingData = {
          ...formData,
          step: 7,
          status: 'Información recibida',
          progressPercentage: 100,
          completedAt: new Date().toISOString(),
          lastSavedAt: new Date().toISOString(),
        };

        // Merge structured content into client
        db.updateClient(client.id, {
          fullName: `${formData.personal.firstName} ${formData.personal.lastName}`.trim() || client.fullName,
          commercialName: formData.personal.brandName || client.commercialName,
          profession: formData.personal.profession || client.profession,
          email: formData.personal.email || formData.contact.email || client.email,
          whatsapp: formData.personal.whatsapp || formData.contact.whatsapp || client.whatsapp,
          city: formData.personal.city || formData.contact.city || client.city,
          bio: formData.story.presentation || client.bio,
          shortDescription: formData.story.presentation || client.shortDescription,
          specialties: formData.offer.specialties.length > 0 ? formData.offer.specialties : client.specialties,
          status: 'Activo',
          onboardingStatus: 'Información recibida',
          onboarding: finalData,
        });
      }

      setIsSubmitting(false);
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs font-display">
            T
          </div>
          <div>
            <span className="font-bold text-xs tracking-wider uppercase text-zinc-900 font-display">
              TRAYECTORIA
            </span>
            <span className="text-[11px] text-zinc-400 block -mt-0.5">Preparación de tu Sitio Web</span>
          </div>
        </div>

        {/* Stepper info (visible only during steps 1-5) */}
        {currentStep >= 1 && currentStep <= 5 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-600">
              Paso <strong className="text-zinc-950 font-bold">{currentStep}</strong> de 5
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 font-medium bg-zinc-100 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {saveStatus}
            </span>
          </div>
        )}

        {/* Client Reassurance */}
        {currentStep === 0 && (
          <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline-block">
            10–15 minutos • Guardado automático
          </span>
        )}
      </header>

      {/* Progress Bar (visible during steps 1-5) */}
      {currentStep >= 1 && currentStep <= 5 && (
        <div className="w-full bg-zinc-200/80 h-1">
          <div
            className="bg-zinc-900 h-1 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      )}

      {/* Main Form Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {currentStep === 0 && (
          <Step0Welcome
            onStart={() => setCurrentStep(1)}
            clientName={client?.fullName}
            hasSavedProgress={formData.progressPercentage > 0}
            onResetProgress={() => {
              const fresh = createDefaultOnboardingData({
                firstName: client?.fullName.split(' ')[0] || '',
                lastName: client?.fullName.split(' ').slice(1).join(' ') || '',
                profession: client?.profession || '',
              });
              setFormData(fresh);
              setCurrentStep(1);
            }}
          />
        )}

        {currentStep === 1 && (
          <Step1AboutYou
            data={formData.personal}
            onChange={(updates) =>
              setFormData((prev) => ({
                ...prev,
                personal: { ...prev.personal, ...updates },
              }))
            }
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <Step2YourStory
            data={formData.story}
            onChange={(updates) =>
              setFormData((prev) => ({
                ...prev,
                story: { ...prev.story, ...updates },
              }))
            }
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <Step3WhatYouDo
            data={formData.offer}
            onChange={(updates) =>
              setFormData((prev) => ({
                ...prev,
                offer: { ...prev.offer, ...updates },
              }))
            }
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <Step4Contact
            data={formData.contact}
            onChange={(updates) =>
              setFormData((prev) => ({
                ...prev,
                contact: { ...prev.contact, ...updates },
              }))
            }
            errors={errors}
          />
        )}

        {currentStep === 5 && (
          <Step5StylePreferences
            data={formData.style}
            onChange={(updates) =>
              setFormData((prev) => ({
                ...prev,
                style: { ...prev.style, ...updates },
              }))
            }
            errors={errors}
          />
        )}

        {currentStep === 6 && (
          <Step6Review
            data={formData}
            onEditStep={(stepIdx) => setCurrentStep(stepIdx)}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 7 && (
          <Step7Success
            clientName={formData.personal.firstName || client?.fullName}
            onGoBackToReview={() => setCurrentStep(6)}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation Bar (for steps 1-5) */}
      {currentStep >= 1 && currentStep <= 5 && (
        <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-4 sm:px-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBack}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Volver
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="px-6 text-xs h-9 font-bold"
              >
                {currentStep === 5 ? 'Revisar respuestas' : 'Continuar'}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
