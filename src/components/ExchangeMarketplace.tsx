import React, { useState } from 'react';
import { ExchangeListing, CategoryType, ProductPassport } from '../types';
import { 
  ArrowUpRight, 
  MapPin, 
  PlusCircle, 
  Check, 
  Search
} from 'lucide-react';
import { playClickSound, playPassportMintSound } from '../services/audio';

interface ExchangeMarketplaceProps {
  listings: ExchangeListing[];
  passports: ProductPassport[];
  onClaimItem: (listingId: string, claimantName: string) => void;
  onCreateListing: (listing: Omit<ExchangeListing, 'id' | 'listedDate' | 'status'>) => void;
  onExplorePassport?: (passportId: string) => void;
}

export const ExchangeMarketplace: React.FC<ExchangeMarketplaceProps> = ({
  listings,
  passports,
  onClaimItem,
  onCreateListing,
  onExplorePassport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimingListing, setClaimingListing] = useState<ExchangeListing | null>(null);
  const [claimantName, setClaimantName] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('ELECTRONICS');
  const [newCondition, setNewCondition] = useState('Repaired & Working');
  const [newLocation, setNewLocation] = useState('District 4 Community Hub');
  const [newPriceType, setNewPriceType] = useState<ExchangeListing['priceType']>('FREE / DONATION');
  const [newPriceUsd, setNewPriceUsd] = useState<number | undefined>(undefined);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPassportId, setNewPassportId] = useState('');

  const categories = [
    { id: 'ALL', label: 'All' },
    { id: 'ELECTRONICS', label: 'Tech' },
    { id: 'FURNITURE', label: 'Furniture' },
    { id: 'TEXTILES', label: 'Clothing' },
    { id: 'TOOLS', label: 'Tools' },
    { id: 'BOOKS', label: 'Books' }
  ];

  const filteredListings = listings.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingListing || !claimantName.trim()) return;

    playPassportMintSound();
    onClaimItem(claimingListing.id, claimantName.trim());
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setClaimingListing(null);
      setClaimantName('');
    }, 1500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playPassportMintSound();
    onCreateListing({
      passportId: newPassportId || `LOOP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      title: newTitle.trim(),
      category: newCategory,
      condition: newCondition,
      location: newLocation,
      priceType: newPriceType,
      priceUsd: newPriceType === 'COMMUNITY PRICE' ? (newPriceUsd || 15) : undefined,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      description: newDescription.trim() || 'Listed on LoopLedger Community Exchange.'
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-[#121212]">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#121212] uppercase leading-none">
            DON'T BIN IT.<br />
            <span className="text-[#0F3822] bg-[#CCFF00] px-2 py-0.5 inline-block border-2 border-[#121212] mt-1 brutal-shadow-sm">
              PASS IT ON.
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              setShowCreateModal(true);
            }}
            className="px-5 py-3 bg-[#CCFF00] text-[#121212] border-2 border-[#121212] font-grotesk text-xs sm:text-sm font-black uppercase brutal-shadow brutal-btn flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Item →</span>
          </button>
        </div>
      </div>

      {/* Filter Row & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound();
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-1.5 font-grotesk text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#CCFF00] text-[#121212] border-2 border-[#121212] brutal-shadow-sm translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-[#121212] border-2 border-[#121212] hover:bg-[#EFECE4]'
                }`}
              >
                [ {cat.label} ]
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search items or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#121212] text-xs placeholder:text-[#71717A]"
          />
          <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing, idx) => {
          const isFeatured = idx % 3 === 0;
          return (
            <div
              key={listing.id}
              className={`bg-white border-2 border-[#121212] flex flex-col justify-between overflow-hidden brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-lg transition-all duration-200 group ${
                isFeatured ? 'border-t-4 border-t-[#CCFF00]' : ''
              }`}
            >
              {/* Card Image */}
              <div className="relative aspect-16/10 overflow-hidden bg-[#FAF8F5] border-b-2 border-[#121212]">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-2 left-2 bg-[#121212] text-[#CCFF00] text-[10px] font-bold px-2 py-0.5 border border-[#121212]">
                  {listing.priceType} {listing.priceUsd ? `($${listing.priceUsd})` : ''}
                </div>

                <div className="absolute top-2 right-2 bg-white text-[#121212] font-mono text-[10px] font-bold px-1.5 py-0.5 border border-[#121212]">
                  {listing.passportId}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#71717A]">
                    <span className="font-semibold uppercase">{listing.category}</span>
                    <span className="text-[#0F3822] font-medium">{listing.condition}</span>
                  </div>

                  <h3 className="font-grotesk text-xl font-black text-[#121212] leading-tight">
                    {listing.title}
                  </h3>

                  <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#121212] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#71717A]">
                    <div className="flex items-center gap-1 text-[#121212] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#121212]" />
                      <span className="truncate max-w-[140px]">{listing.location}</span>
                    </div>
                    <span>{listing.listedDate}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {listing.passportId && onExplorePassport && (
                      <button
                        onClick={() => {
                          playClickSound();
                          onExplorePassport(listing.passportId);
                        }}
                        className="py-2 bg-[#FAF8F5] hover:bg-[#EFECE4] text-[#121212] font-grotesk text-xs font-bold border border-[#121212]"
                      >
                        View Passport →
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playClickSound();
                        setClaimingListing(listing);
                      }}
                      className="py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-[#121212] font-grotesk text-xs font-black border border-[#121212] uppercase brutal-shadow-sm brutal-btn flex items-center justify-center gap-1"
                    >
                      <span>I'm Interested</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Modal */}
      {claimingListing && (
        <div className="fixed inset-0 z-50 bg-[#121212]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#121212] max-w-md w-full p-6 brutal-shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#121212] pb-2">
              <h3 className="font-display font-black text-xl text-[#121212] uppercase">
                Claim Item
              </h3>
              <button
                onClick={() => setClaimingListing(null)}
                className="text-xs font-bold px-2 py-0.5 border border-[#121212] hover:bg-[#EFECE4]"
              >
                ✕
              </button>
            </div>

            {claimSuccess ? (
              <div className="p-6 bg-[#CCFF00] border-2 border-[#121212] text-center space-y-2">
                <Check className="w-8 h-8 mx-auto text-[#121212]" />
                <div className="font-display font-black text-xl text-[#121212] uppercase">
                  Reserved Successfully!
                </div>
                <div className="text-xs text-[#121212]">
                  Custodian notified. Item held for pickup in {claimingListing.location}.
                </div>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div className="bg-[#FAF8F5] p-3 border border-[#121212] space-y-1 text-xs">
                  <div className="text-[#71717A]">Requesting:</div>
                  <div className="font-bold text-[#121212] text-sm">{claimingListing.title}</div>
                  <div className="text-[#0F3822]">Location: {claimingListing.location}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#121212] uppercase mb-1">
                    Your Name or Organization:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin (Student Lab)"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    className="w-full p-2.5 bg-[#F8F6F0] border-2 border-[#121212] text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#121212] uppercase mb-1">
                    Intended Next Life Use:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. For our secondary school coding workshop..."
                    className="w-full p-2.5 bg-[#F8F6F0] border-2 border-[#121212] text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimingListing(null)}
                    className="px-4 py-2 border-2 border-[#121212] bg-white text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#CCFF00] border-2 border-[#121212] text-xs font-black uppercase brutal-shadow-sm brutal-btn text-[#121212]"
                  >
                    Confirm Handover →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#121212]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-[#121212] max-w-lg w-full p-6 brutal-shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-[#121212] pb-3">
              <div>
                <h3 className="font-display text-xl font-black text-[#121212] uppercase">
                  List on Circular Exchange
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs font-bold p-1 hover:bg-[#EFECE4] border border-[#121212]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#121212] uppercase mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Office Chair (Clean condition)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#121212] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs font-bold"
                  >
                    <option value="ELECTRONICS">Tech</option>
                    <option value="FURNITURE">Furniture</option>
                    <option value="TEXTILES">Clothing</option>
                    <option value="TOOLS">Tools</option>
                    <option value="BOOKS">Books</option>
                    <option value="APPLIANCES">Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#121212] uppercase mb-1">
                    Price Structure
                  </label>
                  <select
                    value={newPriceType}
                    onChange={(e) => setNewPriceType(e.target.value as any)}
                    className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs font-bold"
                  >
                    <option value="FREE / DONATION">Free / Donation</option>
                    <option value="EXCHANGE / TRADE">Exchange / Trade</option>
                    <option value="COMMUNITY PRICE">Community Price</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#121212] uppercase mb-1">
                  Location / Area
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#121212] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe condition and pickup instructions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 bg-[#F8F6F0] border-2 border-[#121212] text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border-2 border-[#121212] bg-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CCFF00] border-2 border-[#121212] text-xs font-black uppercase brutal-shadow-sm brutal-btn text-[#121212]"
                >
                  Publish Listing →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
