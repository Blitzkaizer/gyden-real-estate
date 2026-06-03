import { useState } from "react";
import { motion } from "motion/react";
import { Property, PropertyDocument } from "../types";
import { Search, FolderClosed, FileText, Download, Check, HelpCircle, Eye, AlertCircle } from "lucide-react";

interface PropertiesListProps {
  properties: Property[];
  loading: boolean;
}

export default function PropertiesList({ properties, loading }: PropertiesListProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<PropertyDocument | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Filter & Search Logic
  const filteredProperties = properties.filter((prop) => {
    const matchesCategory = filterCategory === "All" || prop.category === filterCategory;
    const matchesSearch =
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const triggerDownload = (docName: string) => {
    setDownloadSuccess(docName);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  return (
    <section id="properties" className="py-24 bg-stone-900 border-t border-stone-800 text-stone-100">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-stone-950 border border-stone-800 rounded-full px-3.5 py-1.5 mb-4">
            <span className="text-[10px] bg-emerald-500 text-stone-950 font-mono font-bold px-2 py-0.5 rounded uppercase">
              PREVIEW PORTAL
            </span>
            <span className="text-xs font-mono text-stone-400">GREC Internal Vetting Desk v2.4</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-stone-100">
            Internal Property & Document Database
          </h2>
          <p className="text-stone-400 mt-3 text-sm leading-relaxed">
            Verify real structural specifications, land deeds, and project feasibility drafts. Click any asset listing below to mount the detailed workspace and inspect files.
          </p>
        </div>

        {/* Console Controls / Filters */}
        <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-500" />
            <input
              id="property-search-input"
              type="text"
              placeholder="Search by ID, Location, or Keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-stone-150 text-sm focus:outline-none focus:border-emerald-500/50 transition-all font-sans text-stone-200"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Commercial", "Residential", "Industrial / Land"].map((cat) => (
              <button
                key={cat}
                id={`filter-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase font-mono transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-emerald-500 text-stone-950 shadow-md font-bold"
                    : "bg-stone-900 text-stone-400 border border-stone-850 hover:bg-stone-850 hover:text-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Listings Registry (Column 6 or 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              Property Registry ({filteredProperties.length} active plots)
            </span>

            {loading ? (
              <div className="bg-stone-950 border border-stone-800 p-8 rounded-xl text-center">
                <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent mx-auto rounded-full"></div>
                <p className="text-xs text-stone-400 mt-3 font-mono">Decompressing active records...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-stone-950 border border-stone-800 p-8 rounded-xl text-center">
                <FolderClosed className="h-8 w-8 text-stone-600 mx-auto mb-2" />
                <p className="text-sm text-stone-400">No properties matched search query.</p>
                <button
                  onClick={() => { setSearchQuery(""); setFilterCategory("All"); }}
                  className="text-xs text-emerald-400 hover:underline mt-2 font-mono hover:text-emerald-300"
                >
                  Clear filter configurations
                </button>
              </div>
            ) : (
              filteredProperties.map((prop) => {
                const isSelected = selectedProperty?.id === prop.id;
                return (
                  <div
                    key={prop.id}
                    id={`property-card-${prop.id}`}
                    onClick={() => {
                      setSelectedProperty(prop);
                      setSelectedDocument(prop.documents[0] || null);
                    }}
                    className={`border p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-stone-900 border-emerald-500/50 shadow-lg ring-1 ring-emerald-500/15"
                        : "bg-stone-950 hover:bg-stone-900/60 border-stone-850"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        {/* ID tag */}
                        <span className="text-[10px] font-mono font-bold bg-stone-900 text-emerald-400 px-2 py-0.5 rounded border border-stone-800 uppercase">
                          {prop.id}
                        </span>
                        <h3 className="text-base font-bold text-stone-100 font-sans tracking-wide mt-2">
                          {prop.title}
                        </h3>
                      </div>
                      <span className="text-sm font-bold text-emerald-400 font-sans">
                        {prop.price}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 leading-relaxed mt-2 line-clamp-2">
                      {prop.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-900 text-[10px] font-mono text-stone-400">
                      <div>
                        <span className="block text-stone-500">CATEGORY</span>
                        <span className="text-stone-300 uppercase">{prop.category}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500">BUILT-UP</span>
                        <span className="text-stone-300">{prop.area}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500">BLENDED YIELD</span>
                        <span className="text-emerald-400 font-bold">{prop.yield}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 mt-4 text-[11px] text-emerald-400 font-medium">
                      <span>{prop.documents.length} Internal Dossiers Available</span>
                      <span>•</span>
                      <span className="text-stone-400 hover:text-emerald-300 underline h-fit block">Click to inspect</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT PANEL: Workspace Portal & Document Viewer Console (Column 7) */}
          <div className="lg:col-span-7">
            {selectedProperty ? (
              <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
                
                {/* Console Top-Bar */}
                <div className="bg-stone-900/80 px-6 py-4 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="bg-emerald-500 text-stone-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {selectedProperty.id} ACTIVE WORKSPACE
                    </span>
                    <span className="text-xs text-stone-400 font-mono">Location: {selectedProperty.location}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 shrink-0 uppercase tracking-widest bg-stone-950 border border-stone-850 px-2 py-1 rounded">
                    Status: {selectedProperty.status}
                  </span>
                </div>

                {/* Property Stats and Details Grid */}
                <div className="p-6 border-b border-stone-800 bg-stone-900/30">
                  <h3 className="text-lg font-bold text-stone-100 font-sans tracking-tight">
                    {selectedProperty.title} Specifications
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed mt-2">
                    {selectedProperty.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-xs font-sans">
                    <div className="bg-stone-950 p-2.5 rounded border border-stone-900">
                      <span className="text-stone-500 text-[10px] font-mono block">VALUATION PRESET</span>
                      <span className="text-stone-200 font-bold font-mono text-emerald-400">{selectedProperty.price}</span>
                    </div>
                    <div className="bg-stone-950 p-2.5 rounded border border-stone-900">
                      <span className="text-stone-500 text-[10px] font-mono block">LAND PLOT AREA</span>
                      <span className="text-stone-200 font-bold font-mono">{selectedProperty.area}</span>
                    </div>
                    <div className="bg-stone-950 p-2.5 rounded border border-stone-900">
                      <span className="text-stone-500 text-[10px] font-mono block">PROPOSAL LOCATION</span>
                      <span className="text-stone-200 font-semibold">{selectedProperty.location}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] font-bold tracking-wider font-mono text-stone-400 block uppercase mb-1.5">Property Features & Key Highlights</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProperty.features.map((feat, idx) => (
                        <span key={idx} className="bg-stone-900 text-stone-300 border border-stone-850 px-2.5 py-1 rounded-full text-[10px] font-mono">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Documents Directory Segment */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FolderClosed className="h-4.5 w-4.5 text-emerald-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-400">
                      GREC Internal Vetted Dossier Vault (Select file to mount)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedProperty.documents.map((doc, idx) => {
                      const isDocSelected = selectedDocument?.name === doc.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedDocument(doc)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            isDocSelected
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                              : "bg-stone-900 hover:bg-stone-850 border-stone-850 text-stone-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-stone-400 shrink-0" />
                            <span className="text-xs font-mono truncate font-semibold">{doc.name}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-stone-500">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inline Document Textual Viewer Panel */}
                  {selectedDocument ? (
                    <div className="mt-6 border border-stone-800 rounded-xl bg-stone-950 overflow-hidden">
                      <div className="bg-stone-900 py-2 px-4 border-b border-stone-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-[10px] font-mono text-stone-300 tracking-wide font-bold">
                            Legal Archive Viewer: {selectedDocument.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-stone-400 font-mono text-[10px]">
                          <span>{selectedDocument.size}</span>
                          <button
                            onClick={() => triggerDownload(selectedDocument.name)}
                            className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer font-bold"
                          >
                            {downloadSuccess === selectedDocument.name ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span className="text-emerald-400 font-bold">Secure Vetted</span>
                              </>
                            ) : (
                              <>
                                <Download className="h-3 w-3 text-emerald-400" />
                                <span className="hover:underline">Simulate Vault Export</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-stone-950 text-stone-300 max-h-56 overflow-y-auto leading-relaxed border-b border-stone-900">
                        <pre className="font-mono text-xs whitespace-pre-wrap select-all bg-stone-900/20 p-2.5 rounded leading-normal border border-stone-900 text-stone-400">
                          {selectedDocument.previewContent}
                        </pre>
                      </div>

                      <div className="bg-emerald-500/5 px-4 py-3 text-[10px] text-stone-450 italic font-sans flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>The Gyden Real Estate Group system has scrutinized and verified the legal integrity of this lease/blueprint relative to modern Johor Bahru high-growth RTS requirements. Confidential GREC Copy.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 bg-stone-900/30 border border-dashed border-stone-800 rounded-xl text-center text-stone-500">
                      Select an internal file folder above to review verified clauses.
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="bg-stone-950 border border-stone-850 rounded-2xl p-12 text-center text-stone-400 flex flex-col items-center justify-center min-h-[400px]">
                <FolderClosed className="h-12 w-12 text-emerald-400 mb-3" />
                <h3 className="text-base font-bold text-stone-200">No Asset Select Profile Mounted</h3>
                <p className="text-xs text-stone-450 mt-1 max-w-sm">
                  Click on one of the premium properties from the left registry panel to open the internal document console and inspect active project dossiers.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-md">
                  {properties.slice(0, 3).map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProperty(p);
                        setSelectedDocument(p.documents[0]);
                      }}
                      className="px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs font-mono text-emerald-400 hover:border-emerald-500/50 transition-all font-bold cursor-pointer"
                    >
                      Mount {p.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </motion.div>
    </section>
  );
}
