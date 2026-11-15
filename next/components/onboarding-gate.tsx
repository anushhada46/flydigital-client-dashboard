'use client';

import { useState } from 'react';
import { PortalShell } from './portal-shell';

function OnboardingModal({ step, onClose, onContinue }: { step: number; onClose: () => void; onContinue: () => void }) {
  return <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <section className="onboarding-modal">
      <button className="onboarding-close" onClick={onClose} aria-label="Close onboarding tour">×</button>
      <span className="onboarding-kicker">WELCOME TO FLYDIGITAL</span>
      <h2 id="onboarding-title">Hey <strong>Rahul</strong>,</h2>
      <p>It might be a little overwhelming at first.</p>
      <div className="onboarding-progress"><div className="progress-dots" aria-label={`Onboarding step ${step} of 5`}>{[1, 2, 3, 4, 5].map(dot => <span className={dot === step ? 'active' : ''} key={dot} />)}</div><span className="onboarding-note">Jinx instructing <b>↗</b></span></div>
      <div className="onboarding-actions"><button className="skip-tour" onClick={onClose}>Skip Tour</button><button className="continue-tour" onClick={onContinue}>{step === 5 ? 'Finish' : 'Continue'} <span>→</span></button></div>
    </section>
  </div>;
}

export function OnboardingGate() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  const continueTour = () => step === 5 ? setOpen(false) : setStep(current => current + 1);
  return <div className="onboarding-host"><div className={open ? 'dashboard-obscured' : ''}><PortalShell mode="workspace" /></div>{open && <OnboardingModal step={step} onClose={() => setOpen(false)} onContinue={continueTour} />}</div>;
}
