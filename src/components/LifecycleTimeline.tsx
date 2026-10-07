import React, { useState } from 'react';
import { ProductPassport, LifecycleEvent } from '../types';
import { 
  CheckCircle2, 
  Wrench, 
  ArrowRightLeft, 
  Scissors, 
  Recycle, 
  PlusCircle, 
  FileText, 
  ShieldCheck,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import { playClickSound, playPassportMintSound } from '../services/audio';

interface LifecycleTimelineProps {
  passport: ProductPassport;
  onAddEvent?: (passportId: string, newEvent: Omit<LifecycleEvent, 'id'>) => void;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({
  passport,
  onAddEvent
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventType, setEventType] = useState<LifecycleEvent['eventType']>('REPAIR');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [operator, setOperator] = useState('Elena Rostova');
  const [location, setLocation] = useState('District 4 Repair Station');

  const getEventIcon = (type: LifecycleEvent['eventType']) => {
    switch (type) {
      case 'REGISTERED':
        return <FileText className="w-4 h-4 text-[#121212]" />;
      case 'CONDITION ASSESSED':
        return <ShieldCheck className="w-4 h-4 text-[#121212]" />;
      case 'REPAIR':
        return <Wrench className="w-4 h-4 text-[#121212]" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="w-4 h-4 text-[#121212]" />;
      case 'PARTS HARVESTED':
        return <Scissors className="w-4 h-4 text-[#121212]" />;
      case 'RECYCLED':
        return <Recycle className="w-4 h-4 text-[#121212]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#121212]" />;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !onAddEvent) return;

    playPassportMintSound();
    onAddEvent(passport.id, {
      eventType,
      title: title.trim(),
      description: description.trim() || 'Verified lifecycle event added to product history.',
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      operatorOrOwner: operator.trim() || 'Verified Operator',
      location: location.trim() || 'Local Hub',
      verified: true
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full space-y-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#121212]">
        <div>
          <div className="text-xs text-[#71717A] uppercase font-semibold">
            Product History & Chronology
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#121212] uppercase tracking-tight">
            Lifecycle Events
          </h2>
        </div>

        {onAddEvent && (
          <button
            onClick={() => {
              playClickSound();
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-[#CCFF00] border-2 border-[#121212] font-grotesk font-bold text-xs uppercase brutal-shadow-sm brutal-btn flex items-center gap-2 text-[#121212]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Lifecycle Event</span>
          </button>
        )}
      </div>

      {/* Timeline Container */}
      <div className="relative py-4">
        {/* Central Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-[#121212] transform md:-translate-x-1/2 z-0" />

        <div className="space-y-8 relative z-10">
          {passport.events.map((evt, idx) => {
            const isEven = idx % 2 === 0;
            const indexNumber = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={evt.id}
                className={`flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                } gap-6 md:gap-0 group`}
              >
                {/* Event Content Card */}
                <div className="w-full md:w-[44%] pl-14 md:pl-0">
                  <div className="bg-white border-2 border-[#121212] p-5 brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    {/* Top Pill & Index */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#121212]">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#121212]">
                        <span className="p-1 bg-[#CCFF00] border border-[#121212]">
                          {getEventIcon(evt.eventType)}
                        </span>
                        <span className="uppercase">{evt.eventType}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#71717A]">
                        Event #{indexNumber}
                      </span>
                    </div>

                    {/* Title & Body */}
                    <div className="mt-3 space-y-1.5">
                      <h4 className="font-grotesk text-lg font-black text-[#121212] leading-tight">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#444444] leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    {/* Footer Metadata */}
                    <div className="mt-4 pt-3 border-t border-dashed border-[#121212] flex flex-wrap items-center justify-between gap-2 text-xs text-[#71717A]">
                      <div className="flex items-center gap-1 text-[#121212] font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{evt.timestamp}</span>
                      </div>
                      {evt.operatorOrOwner && (
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{evt.operatorOrOwner}</span>
                        </div>
                      )}
                      {evt.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{evt.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Central Step Marker */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#CCFF00] border-2 border-[#121212] flex items-center justify-center font-mono text-xs font-black text-[#121212] brutal-shadow-sm group-hover:scale-110 transition-transform">
                    {indexNumber}
                  </div>
                </div>

                {/* Opposite empty space for desktop alignment */}
                <div className="hidden md:block w-[44%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Lifecycle Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#121212]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#121212] max-w-lg w-full p-6 brutal-shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3">
              <div>
                <h3 className="font-display text-xl font-black text-[#121212] uppercase">
                  Add Lifecycle Event
                </h3>
                <p className="text-xs text-[#71717A]">Append a maintenance or transfer milestone to {passport.id}</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold p-1 hover:bg-[#EFECE4] border border-[#121212]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#121212] uppercase mb-1">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F8F6F0] border-2 border-[#121212] text-xs font-bold"
                >
                  <option value="REPAIR">Repair / Component Replacement</option>
                  <option value="CONDITION ASSESSED">Condition Inspection</option>
                  <option value="TRANSFER">Ownership Transfer</option>
                  <option value="PARTS HARVESTED">Parts Harvested</option>
                  <option value="UPCYCLED">Upcycled / Repurposed</option>
                  <option value="RECYCLED">Recycled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121212] uppercase mb-1">
                  Event Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Replaced USB-C charging ribbon and calibrated battery"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F6F0] border-2 border-[#121212] text-xs font-semibold placeholder:text-[#71717A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121212] uppercase mb-1">
                  Details & Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe technical actions or handover details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#F8F6F0] border-2 border-[#121212] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#121212] uppercase mb-1">
                    Technician or Custodian
                  </label>
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#121212] uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border-2 border-[#121212] bg-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CCFF00] border-2 border-[#121212] text-xs font-black uppercase brutal-shadow-sm brutal-btn text-[#121212]"
                >
                  Save Event →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
