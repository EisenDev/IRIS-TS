<template>
  <div class="h-screen w-full flex bg-[#030712] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
    <!-- Non-destructive inputs required persistently -->
    <input type="file" ref="assetUploadRef" @change="handleAssetUpload" accept="image/*,video/*" class="hidden" />
    <input type="file" ref="refinementInputRef" @change="handleRefinementUpload" accept="image/*" class="hidden" />

    <!-- Sidebar / Control Panel -->
    <div v-show="!isFullScreen" class="w-80 flex-shrink-0 flex flex-col border-r border-slate-800/60 bg-[#0B0F19] relative z-20 shadow-2xl transition-all flex-grow-0">
      <!-- Header -->
      <div class="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900 to-transparent">
        <h1 class="text-2xl font-black tracking-tight bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text drop-shadow-sm">IRIS-TS</h1>
        <p class="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Atmosphere Engine</p>
      </div>

      <!-- Action Panel -->
      <div class="p-6 flex-1 overflow-y-auto flex flex-col gap-6 no-scrollbar">
        <div v-if="generatedFiles.length === 0" class="space-y-6">
            <!-- Input Selector -->
            <div class="space-y-3">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                1. Visual Input
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  @click="triggerUpload" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 bg-slate-800/30 hover:bg-indigo-500/10 transition-all group"
                >
                  <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400 mb-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span class="text-[11px] font-semibold text-slate-300">Upload Data</span>
                </button>
                <button 
                  type="button"
                  @click="startCamera" 
                  class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700/50 hover:border-fuchsia-500/50 bg-slate-800/30 hover:bg-fuchsia-500/10 transition-all group"
                >
                  <svg class="w-5 h-5 text-slate-400 group-hover:text-fuchsia-400 mb-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                  <span class="text-[11px] font-semibold text-slate-300">Live Lens</span>
                </button>
                <input type="file" ref="fileInputRef" @change="handleFileUpload" accept="image/*" class="hidden" />
              </div>
            </div>

            <!-- Media Viewport -->
            <div class="relative w-full aspect-[4/3] bg-[#05080f] rounded-xl overflow-hidden border border-slate-700/50 shadow-inner group">
              <div v-if="!isCameraOpen && !capturedImage" class="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <svg class="w-8 h-8 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span class="text-[10px] font-medium uppercase tracking-widest">No Signal</span>
              </div>

              <video v-show="isCameraOpen && !capturedImage" ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
              <img v-if="capturedImage" :src="capturedImage" alt="Captured Scene" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              <canvas ref="canvasRef" class="hidden"></canvas>
              
              <!-- Scanning Overlay -->
              <div v-if="isGenerating" class="absolute inset-0 bg-indigo-950/40 backdrop-blur-[2px] flex items-center justify-center overflow-hidden">
                <div class="h-1 w-full bg-indigo-400/80 absolute top-0 shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                <div class="px-3 py-1.5 bg-indigo-900/80 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-300 tracking-[0.2em] uppercase backdrop-blur-md">Analyzing</div>
              </div>

              <!-- Camera Controls Overlay -->
              <div v-if="isCameraOpen && !capturedImage" class="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" @click="takePhoto" class="w-12 h-12 rounded-full border-4 border-white/30 bg-white/20 hover:bg-white hover:border-white transition-all backdrop-blur-sm"></button>
              </div>
            </div>

            <!-- Custom Prompt -->
            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                2. Structural Prompt
              </label>
              <textarea
                v-model="userPrompt"
                class="w-full h-24 bg-[#05080f] border border-slate-700/50 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-purple-500/50 transition-colors resize-none placeholder-slate-600 custom-textarea"
                placeholder="e.g., Build a modern clothing brand landing page using this vibe. Include a hero section, products grid, and footer."
              ></textarea>
            </div>

            <!-- Synthesis Core -->
            <div class="space-y-3 pt-2">
              <button 
                type="button"
                @click="generateUI" 
                :disabled="!capturedImage || isGenerating"
                class="w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 transition-all duration-500 group-hover:scale-[1.05]"></div>
                <div class="relative px-4 py-3.5 flex items-center justify-center gap-2 text-white font-bold tracking-wide text-sm">
                  <svg v-if="isGenerating" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  {{ isGenerating ? 'Synthesizing Frontend...' : 'Initialize Engine' }}
                </div>
              </button>
              
              <button 
                type="button"
                v-if="capturedImage && !isGenerating"
                @click="resetCamera" 
                class="w-full px-4 py-2 bg-transparent hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 text-slate-400 rounded-xl font-medium text-xs transition-all"
              >
                Clear Input Data
              </button>
            </div>
        </div>
        
        <!-- Post-Generation Conversational AI Refinement -->
        <div v-else class="space-y-6 flex-1 flex flex-col">
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Architecture Active
            </label>
            <button @click="resetEngine" class="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider underline underline-offset-2">Reset Engine</button>
          </div>
          
          <div class="flex-1 flex flex-col border border-slate-700/50 bg-[#05080f] rounded-xl overflow-hidden shadow-inner">
             <div class="p-4 bg-slate-800/50 border-b border-slate-700/50">
               <p class="text-[11px] text-slate-300 leading-relaxed font-medium">Use AI to automatically refine the generated code. Example: <em>"Add a Contact Us form to the footer", "Change the hero section to an image carousel"</em></p>
             </div>
             
             <div class="flex-1 p-3 flex flex-col relative">
                <div v-if="refinementImages.length > 0" class="flex flex-wrap gap-2 mb-3">
                    <div v-for="(img, index) in refinementImages" :key="index" class="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700 shadow-md group shrink-0">
                        <img :src="img" class="w-full h-full object-cover" />
                        <button @click="removeRefinementImage(index)" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" title="Remove">
                            <svg class="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
                <textarea
                  v-model="refinementPrompt"
                  @paste="handleRefinementPaste"
                  class="w-full flex-1 bg-transparent text-xs text-slate-200 outline-none resize-none placeholder-slate-600 custom-textarea pr-10"
                  placeholder="How can I improve this architecture? (Ctrl+V to paste image)..."
                ></textarea>
                <button @click="triggerRefinementUpload" class="absolute bottom-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 border border-slate-700 transition-colors shadow-black/50 shadow-md" title="Attach Visual Context">
                   <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </button>
             </div>
             
             <div class="p-3 border-t border-slate-700/50 bg-slate-800/30">
                <button 
                  type="button"
                  @click="refineUI" 
                  :disabled="!refinementPrompt || isGenerating"
                  class="w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-emerald-500/50"
                >
                  <div class="absolute inset-0 bg-emerald-600/20 group-hover:bg-emerald-600/30 transition-all duration-300"></div>
                  <div class="relative px-4 py-2 flex items-center justify-center gap-2 text-emerald-400 font-bold tracking-wide text-xs uppercase">
                    <svg v-if="isGenerating" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    {{ isGenerating ? 'Refining Code...' : 'Execute Refinement' }}
                  </div>
                </button>
             </div>
          </div>
        </div>

        <!-- Identity Output -->
        <transition name="fade">
          <div class="mt-2" v-if="generationTheme">
            <div class="flex flex-col gap-3 p-4 bg-[#05080f] rounded-xl border border-slate-800 relative shadow-inner">
              <div class="flex items-center justify-between pointer-events-none">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Atmosphere</span>
                <span class="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded-full border border-fuchsia-400/20 max-w-[150px] truncate" :title="generationTheme">{{ generationTheme }}</span>
              </div>
              <div class="grid grid-cols-6 gap-2">
                <div 
                  v-for="(color, index) in generationColors.slice(0, 12)" 
                  :key="index" 
                  class="group relative w-full aspect-square rounded-full border border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer hover:z-10 transition-transform hover:scale-110"
                  :style="{ backgroundColor: color }"
                >
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg shadow-black/50 border border-slate-700 z-50">
                    {{ color }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="flex-1 flex flex-col min-w-0 bg-[#060912] relative z-10">
      
      <!-- Top Workspace Nav / Deploy Tools -->
      <div class="h-16 border-b border-slate-800/60 bg-[#0B0F19] flex items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full" :class="generatedFiles.length > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-700'"></div>
          <span class="text-xs font-bold text-slate-300 tracking-[0.1em] uppercase">Live Architecture Output</span>
        </div>
        
        <div v-if="generatedFiles.length > 0" class="flex gap-2">
          
          <button @click="showGuide = true" class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="hidden xl:inline">Guide</span>
          </button>

          <!-- File Explorer Collapse Toggle -->
          <button @click="isCodeCollapsed = !isCodeCollapsed" class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border" :class="!isCodeCollapsed ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            <span class="hidden xl:inline">{{ isCodeCollapsed ? 'Show Code' : 'Hide Code' }}</span>
          </button>

          <!-- Full Screen Expand Toggle -->
          <button @click="isFullScreen = !isFullScreen" class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border" :class="isFullScreen ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'">
            <svg v-if="!isFullScreen" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h4v4m0-4l-5 5M20 10h-4V6m0 4l5-5M10 4v4H6m4 0l-5-5M14 20v-4h4m-4 0l5 5" /></svg>
            {{ isFullScreen ? 'Exit Expand' : 'Expand' }}
          </button>

          <!-- Live Edit Mode Toggle -->
           <button @click="toggleEditMode" class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border" :class="isEditMode ? 'bg-amber-600/20 text-amber-500 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            {{ isEditMode ? 'Exit Edit Mode' : 'Live Edit' }}
          </button>
          
          <!-- BYOK Deploy Tooling -->
          <button @click="showDeployModal = true" class="flex items-center gap-2 px-6 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-emerald-500/30">
             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
             Deploy
          </button>
          
          <button @click="downloadZip" class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-700">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export .ZIP Source
          </button>
        </div>
      </div>

      <!-- Split View -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Live Preview -->
        <div class="flex-1 relative bg-slate-950/50 order-2 lg:order-1 flex flex-col">
          <!-- Empty State -->
          <div v-if="generatedFiles.length === 0 && !isGenerating" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <div class="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div class="absolute inset-0 border border-slate-800 rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
              <div class="absolute inset-4 border border-slate-700 rounded-full animate-[spin_7s_linear_infinite_reverse] opacity-50"></div>
              <svg class="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h2 class="text-lg font-semibold tracking-[0.15em] uppercase text-slate-300">Engine Standby</h2>
            <p class="text-slate-500 text-xs mt-3 max-w-xs text-center leading-relaxed font-medium">Capture or upload visual context to synthesize the reactive structural layer.</p>
          </div>
          
          <!-- Loading State -->
          <div v-if="isGenerating" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#060912]/80 backdrop-blur-md">
            <div class="w-20 h-20 relative">
              <div class="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p class="mt-6 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">Building Architecture</p>
          </div>

          <!-- Iframe Render -->
          <div class="flex-1 p-4 lg:p-8 overflow-hidden z-20">
             <div 
               class="w-full h-full bg-white rounded-2xl overflow-hidden border border-slate-700/40 relative shadow-2xl transition-opacity duration-500"
               :class="(generatedFiles.length > 0 || iframeSrcDoc) && !isGenerating ? 'opacity-100' : 'opacity-0'"
             >
                <iframe 
                  v-if="generatedFiles.length > 0 || iframeSrcDoc"
                  ref="iframeRef"
                  :srcdoc="iframeSrcDoc" 
                  class="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                ></iframe>
             </div>
          </div>
        </div>

        <!-- File Explorer & Code Editor -->
        <div v-show="!isFullScreen && !isCodeCollapsed" class="w-full lg:w-[450px] flex-shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800/60 bg-[#0B0F19] order-1 lg:order-2 transition-all">
          
          <!-- File Tabs Header -->
          <div class="flex items-center overflow-x-auto bg-slate-900 border-b border-slate-800/60 no-scrollbar">
            <button 
              v-for="(file, index) in generatedFiles" 
              :key="index"
              @click="activeFileIndex = index"
              class="px-5 py-3 text-[11px] font-mono font-bold tracking-widest uppercase border-r border-slate-800/60 whitespace-nowrap transition-colors"
              :class="activeFileIndex === index ? 'text-indigo-400 bg-[#0B0F19] border-t-[3px] border-t-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 border-t-[3px] border-t-transparent pt-[15px]'"
            >
              {{ file.name }}
            </button>
          </div>

          <!-- Active Code Content -->
          <div class="flex-1 relative bg-[#05080f]">
            <textarea 
              v-if="activeFile"
              v-model="activeFile.content"
              class="absolute inset-0 w-full h-full bg-transparent text-emerald-400/90 p-6 font-mono text-[13px] leading-relaxed resize-none outline-none selection:bg-emerald-500/20 no-scrollbar custom-textarea"
              spellcheck="false"
              placeholder="// Source..."
            ></textarea>
            <div v-else class="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-xs uppercase tracking-widest">
              No files mapped
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- GUIDE MODAL -->
  <div v-if="showGuide" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="showGuide = false">
      <div class="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h2 class="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  IRIS Engine Guide
              </h2>
              <button @click="showGuide = false" class="text-slate-400 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
          <div class="p-6 overflow-y-auto custom-textarea text-sm text-slate-300 space-y-6">
              <div>
                  <h3 class="text-white font-bold text-base mb-2 border-b border-slate-700 pb-1">1. Live Editing</h3>
                  <p>Click the <strong>"Live Edit"</strong> button to interact directly with the generated interface. You can click on text to rewrite it, and click on any image placeholder to spawn a native file upload prompt to inject your own images.</p>
              </div>
              <div>
                  <h3 class="text-white font-bold text-base mb-2 border-b border-slate-700 pb-1">2. Conversational Refinement</h3>
                  <p>After generating your architecture, use the left Refinement sidebar to command the AI to edit your codebase. You can say things like <em>"Turn the background black"</em> or <em>"Add a newsletter section."</em> You can even <strong>Paste (Ctrl+V) an image</strong> into the chatbox to provide visual directives!</p>
                  <p class="mt-2 text-rose-400 text-xs font-semibold">Note: The AI operates on a free tier API. If you spam requests, you will receive a "Rate Limit Reached" error. Just wait 10 seconds and relax!</p>
              </div>
              <div>
                  <h3 class="text-white font-bold text-base mb-2 border-b border-slate-700 pb-1">3. Custom Web Domains</h3>
                  <p>You can instantly deploy your creation to the public internet for free using Vercel.</p>
                  <ol class="list-decimal pl-5 space-y-1 mt-2 mb-2">
                      <li>Sign up for a free account at Vercel.com.</li>
                      <li>Go to Account Settings > Tokens and create a new token.</li>
                      <li>Paste the token into the <strong>"Vercel Token"</strong> box at the top right.</li>
                      <li>In the <strong>Custom URI</strong> box, type whatever name you want. Vercel will host it at <code class="text-indigo-300 bg-indigo-500/10 px-1 rounded">iris-ts-&lt;your-name&gt;.vercel.app</code>.</li>
                      <li>Click Deploy!</li>
                  </ol>
              </div>
          </div>
          <div class="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-end">
              <button @click="showGuide = false" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors">Got it!</button>
          </div>
      </div>
  </div>

  <!-- DEPLOY MODAL -->
  <div v-if="showDeployModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click.self="showDeployModal = false">
      <div v-if="!deploymentSuccessUrl" class="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
          <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h2 class="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  Deploy to Vercel
              </h2>
              <button @click="showDeployModal = false" class="text-slate-400 hover:text-white transition-colors">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
          <div class="p-6 space-y-6">
              <div>
                 <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">1. Vercel BYOK Token</label>
                 <input v-model="userVercelToken" type="password" placeholder="Paste your token here..." class="w-full bg-[#05080f] border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-3 outline-none focus:border-emerald-500/50 placeholder-slate-600" />
                 <p class="text-[10px] text-slate-500 mt-2">Required. Get this from your Vercel account settings.</p>
              </div>
              
              <div>
                 <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">2. Custom Domain Prefix</label>
                 <div class="flex items-center">
                    <span class="pl-4 pr-1 py-3 bg-slate-800 border-y border-l border-slate-700 rounded-l-lg text-emerald-400 text-sm select-none">iris-ts-</span>
                    <input v-model="userProjectName" type="text" placeholder="my-awesome-site" class="flex-1 bg-slate-800 border-y border-slate-700 text-slate-200 text-sm px-1 py-3 outline-none focus:border-emerald-500/50 placeholder-slate-400" />
                    <span class="pr-4 pl-1 py-3 bg-slate-800 border-y border-r border-slate-700 rounded-r-lg text-slate-500 text-sm select-none">.vercel.app</span>
                 </div>
                 <p class="text-[10px] text-slate-500 mt-2">Alphanumeric characters and hyphens only.</p>
              </div>
          </div>
          <div class="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-end gap-3">
              <button @click="showDeployModal = false" class="px-4 py-2 text-slate-300 hover:text-white font-bold text-sm transition-colors">Cancel</button>
              <button @click="deployToVercel" :disabled="!userVercelToken || isDeploying || !userProjectName" class="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors">
                  <svg v-if="isDeploying" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  {{ isDeploying ? 'Deploying...' : 'Deploy Now' }}
              </button>
          </div>
      </div>
      
      <!-- SUCCESS STATE -->
      <div v-else class="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col items-center p-8 text-center ring-1 ring-emerald-500/30">
        <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-500/10">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">Deployed Successfully!</h3>
        <p class="text-slate-400 text-sm mb-6">Your synthesis is now live on the global Vercel edge network.<br/>(It may take up to 60 seconds to fully propagate).</p>
        
        <div class="w-full relative group">
          <input type="text" readonly :value="`https://${deploymentSuccessUrl}`" class="w-full bg-[#05080f] border border-slate-700 text-emerald-400 text-sm font-mono rounded-lg px-4 py-3 pr-24 outline-none cursor-text selection:bg-emerald-500/30" />
          <button @click="copyToClipboard(`https://${deploymentSuccessUrl}`)" class="absolute right-2 top-2 bottom-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-md transition-colors flex items-center gap-2 border border-slate-600">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            COPY
          </button>
        </div>
        
        <div class="w-full flex gap-3 mt-8">
            <button @click="deploymentSuccessUrl = ''; showDeployModal = false" class="flex-1 py-2.5 text-slate-300 hover:text-white font-bold text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">Close</button>
            <a :href="`https://${deploymentSuccessUrl}`" target="_blank" class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg transition-colors border border-emerald-500 flex items-center justify-center gap-2">
                Open Link
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
        </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed, onMounted } from 'vue'
import JSZip from 'jszip'

const isCameraOpen = ref(false)
const capturedImage = ref<string | null>(null)
const userPrompt = ref('')
const refinementPrompt = ref('')
const refinementImages = ref<string[]>([])
const isGenerating = ref(false)
const isDeploying = ref(false)
const userVercelToken = ref('') // Support BYOK methodology
const userProjectName = ref('') // Support custom subdomains
const showGuide = ref(false) // Toggle for instructions modal
const showDeployModal = ref(false) // Toggle for deploy UI
const deploymentSuccessUrl = ref('') // Store url when deployed
const isEditMode = ref(false) // State to track visual builder
const isFullScreen = ref(false) // Toggle to collapse left panel
const isCodeCollapsed = ref(false) // Toggle to collapse right panel
const isSyncingFromIframe = ref(false) // Lock out the watch loop
const assetUploadRef = ref<HTMLInputElement | null>(null)
const refinementInputRef = ref<HTMLInputElement | null>(null)
const pendingImageTargetId = ref<string | null>(null)

// Replaced simple code string with robust file tree
const generatedFiles = ref<{name: string, content: string, isAsset?: boolean, encoding?: string}[]>([])
const activeFileIndex = ref(0)
const iframeSrcDoc = ref('')

const activeFile = computed(() => {
  if (generatedFiles.value.length > 0 && activeFileIndex.value < generatedFiles.value.length) {
    return generatedFiles.value[activeFileIndex.value]
  }
  return null
})

const generationTheme = ref('')
const generationColors = ref<string[]>([])

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const streamRef = ref<MediaStream | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerUpload = () => { fileInputRef.value?.click() }

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      capturedImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const triggerRefinementUpload = () => { refinementInputRef.value?.click(); }
const removeRefinementImage = (index: number) => { refinementImages.value.splice(index, 1); }

const handleRefinementUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;
  
  for (let i = 0; i < files.length; i++) {
     if (refinementImages.value.length >= 5) break;
     const file = files[i];
     const reader = new FileReader();
     reader.onload = (e) => {
       if (e.target?.result && refinementImages.value.length < 5) {
         refinementImages.value.push(e.target.result as string);
       }
     };
     reader.readAsDataURL(file);
  }
  if (refinementInputRef.value) refinementInputRef.value.value = '';
}

const handleRefinementPaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      if (refinementImages.value.length >= 5) {
          alert('Maximum 5 images allowed as context.');
          e.preventDefault();
          break;
      }
      
      const blob = items[i].getAsFile();
      if (blob) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            refinementImages.value.push(event.target.result as string);
          }
        };
        reader.readAsDataURL(blob);
      }
      e.preventDefault(); // Stop normal pasting if an image was captured
    }
  }
}

const handleAssetUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    isSyncingFromIframe.value = true;
    const result = e.target?.result as string; 
    const base64Data = result.split(',')[1];
    
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const extension = file.name.split('.').pop() || 'png';
    const assetName = `assets/${baseName.replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}.${extension}`;

    generatedFiles.value.push({ 
      name: assetName, 
      content: base64Data, 
      isAsset: true,
      encoding: 'base64'
    });

    iframeRef.value?.contentWindow?.postMessage({
        type: 'UPDATE_IMAGE_SRC',
        id: pendingImageTargetId.value,
        src: `./${assetName}`,
        base64: result
    }, '*');

    setTimeout(() => { isSyncingFromIframe.value = false; }, 150);
  };
  reader.readAsDataURL(file);
  
  // Reset input
  if (assetUploadRef.value) assetUploadRef.value.value = '';
}

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }, audio: false 
    })
    streamRef.value = stream
    if (videoRef.value) videoRef.value.srcObject = stream
    isCameraOpen.value = true
    capturedImage.value = null
  } catch (err) {
    console.error(err)
    alert('Unable to access camera.')
  }
}

const stopCamera = () => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop())
    streamRef.value = null
  }
  isCameraOpen.value = false
}

const takePhoto = () => {
  if (videoRef.value && canvasRef.value) {
    const video = videoRef.value
    const canvas = canvasRef.value
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
      stopCamera()
    }
  }
}

const resetCamera = () => {
  capturedImage.value = null
}

const generateUI = async () => {
  if (!capturedImage.value) return
  isGenerating.value = true
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: capturedImage.value,
        userPrompt: userPrompt.value 
      })
    })
    if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${response.statusText}`);
    }
    
    const text = await response.text();
    let data;
    try {
        let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const first = cleaned.indexOf('{');
        const last = cleaned.lastIndexOf('}');
        if (first !== -1 && last !== -1) cleaned = cleaned.substring(first, last + 1);
        data = JSON.parse(cleaned);
    } catch (e) {
        throw new Error('AI produced invalid JSON architecture format.');
    }
    
    if (data && data.files) {
      generatedFiles.value = data.files
      activeFileIndex.value = 0 // Auto-focus the first file (index.html)
      generationTheme.value = data.theme_name || 'Generated Theme'
      generationColors.value = data.colors || []
    } else if (data.error) {
       throw new Error(data.error);
    }
  } catch (err: any) {
    alert(err.message || 'Error connecting to backend.')
  } finally {
    isGenerating.value = false
  }
}

const resetEngine = () => {
    if (confirm('Are you sure you want to reset the engine? All unsaved work will be lost.')) {
        generatedFiles.value = [];
        capturedImage.value = null;
        userPrompt.value = '';
        refinementPrompt.value = '';
        refinementImages.value = [];
        isEditMode.value = false;
        iframeSrcDoc.value = '';
    }
}

const refineUI = async () => {
  if (!refinementPrompt.value || generatedFiles.value.length === 0) return
  isGenerating.value = true
  
  try {
    const response = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        files: generatedFiles.value.filter(f => !f.isAsset),
        userPrompt: refinementPrompt.value,
        images: refinementImages.value
      })
    })
    if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${response.statusText}`);
    }
    
    const text = await response.text();
    let data;
    try {
        let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const first = cleaned.indexOf('{');
        const last = cleaned.lastIndexOf('}');
        if (first !== -1 && last !== -1) cleaned = cleaned.substring(first, last + 1);
        data = JSON.parse(cleaned);
    } catch (e) {
        throw new Error('AI produced invalid JSON architecture format.');
    }
    
    if (data && data.files) {
      // Intelligently merge files back in so we don't drop binary assets
      data.files.forEach((refinedFile: any) => {
          const index = generatedFiles.value.findIndex(f => f.name === refinedFile.name);
          if (index !== -1 && !generatedFiles.value[index].isAsset) {
              generatedFiles.value[index].content = refinedFile.content;
          } else if (index === -1) {
              generatedFiles.value.push(refinedFile);
          }
      });
      refinementPrompt.value = ''; // clear upon success
      refinementImages.value = [];
    } else if (data.error) {
       throw new Error(data.error);
    }
  } catch (err: any) {
    alert(err.message || 'Error connecting to backend.')
  } finally {
    isGenerating.value = false
  }
}

const downloadZip = async () => {
  if (generatedFiles.value.length === 0) return;
  const zip = new JSZip();
  
  // Add all mapped files to ZIP folder structure
  generatedFiles.value.forEach(file => {
    if (file.isAsset) {
      zip.file(file.name, file.content, { base64: true });
    } else {
      zip.file(file.name, file.content);
    }
  });
  
  // Add a nice read.me detailing this came from IRIS-TS
  zip.file('README.md', '# Generated by IRIS-TS\n\nAtmosphere Engine Architecture.\nTheme: ' + generationTheme.value + '\n\nTo run locally, just open `index.html` in your browser.');

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `IRIS-TS-${generationTheme.value.replace(/\s+/g, '-').toLowerCase()}-source.zip`;
  a.click();
  
  URL.revokeObjectURL(url);
}

const deployToVercel = async () => {
  if (generatedFiles.value.length === 0 || !userVercelToken.value || !userProjectName.value) return;
  isDeploying.value = true;
  
  try {
    const safeProjectName = userProjectName.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    
    const deploymentData = {
      name: `iris-ts-${safeProjectName}`,
      files: generatedFiles.value.map(file => ({
        file: file.name,
        data: file.content,
        encoding: file.isAsset ? 'base64' : 'utf-8'
      })),
      vercelToken: userVercelToken.value // Pass BYOK to Hono Route
    };
    
    // Using a public Vercel endpoint or relaying through Hono backend
    const response = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deploymentData)
    })
    
    const data = await response.json()
    if (response.ok && data.url) {
      deploymentSuccessUrl.value = data.url;
    } else {
      alert('Deployment failed: ' + (data.error || 'Unknown error'))
    }
  } catch (err: any) {
    alert(err.message || 'Error connecting to deployment service.')
  } finally {
    isDeploying.value = false;
  }
}

watch(generatedFiles, (newFiles) => {
  if (isSyncingFromIframe.value) return; // Prevent infinite re-render loop
  if (!newFiles || newFiles.length === 0) return
  
  const htmlFile = newFiles.find(f => f.name.toLowerCase().endsWith('.html'))
  if (!htmlFile) return;

  let sourceHTML = htmlFile.content
  
  // Base64 replacement for relative asset paths in local preview
  newFiles.forEach(f => {
      if (f.isAsset && f.name.startsWith('assets/')) {
          const regex = new RegExp(`src=["'](\\.\\/)?${f.name}["']`, 'g');
          const ext = f.name.split('.').pop()?.toLowerCase() || '';
          const mime = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
          sourceHTML = sourceHTML.replace(regex, `src="data:${mime};base64,${f.content}" data-actual-src="./${f.name}"`);
      }
  });

  // Inject the advanced DOM mutator / anti-white-screen logic right before closing </body>
  const advancedScript = `
      <style id="iris-injected-style">
        .iris-editable { outline: 2px dashed rgba(245, 158, 11, 0.5) !important; outline-offset: 2px; cursor: text; }
        .iris-editable:hover { outline-color: rgba(245, 158, 11, 1) !important; background-color: rgba(245, 158, 11, 0.05); }
        .iris-editable-img { outline: 3px dashed rgba(16, 185, 129, 0.8) !important; cursor: pointer; transition: all 0.2s; z-index: 9999 !important; position: relative !important; pointer-events: auto !important; }
        .iris-editable-img:hover { outline-color: rgba(16, 185, 129, 1) !important; filter: brightness(0.8); }
      </style>
      <script id="iris-injected-script">
        /* Sync logic to push DOM state back to Vue Parent */
        function syncToParent() {
            if(window._irisSyncing) return;
            window._irisSyncing = true;
            requestAnimationFrame(() => {
                const clone = document.documentElement.cloneNode(true);
                
                // Cleanup injected utility scripts so they don't pollute source
                const script = clone.querySelector('#iris-injected-script');
                if (script) script.remove();
                const style = clone.querySelector('#iris-injected-style');
                if (style) style.remove();
                
                // Cleanup edit classes mapping
                clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
                clone.querySelectorAll('.iris-editable').forEach(el => el.classList.remove('iris-editable'));
                clone.querySelectorAll('.iris-editable-img').forEach(el => el.classList.remove('iris-editable-img'));
                
                // Replace local base64 datastrings with actual asset file paths for Vercel/Zip
                clone.querySelectorAll('img[data-actual-src]').forEach(img => {
                    img.src = img.getAttribute('data-actual-src');
                    img.removeAttribute('data-actual-src');
                    img.removeAttribute('data-iris-id');
                });

                const finalHtml = '<!DOCTYPE html>\\n<html lang="en">\\n' + clone.innerHTML + '\\n</html>';
                window.parent.postMessage({ type: 'SYNC_HTML', html: finalHtml }, '*');
                window._irisSyncing = false;
            });
        }

        // Attach event listeners to catch user edits
        document.addEventListener('input', syncToParent);
        document.addEventListener('blur', syncToParent, true);

        // Block navigation away from the IRIS-TS preview iframe, but allow JS interactivity
        document.addEventListener('submit', (e) => e.preventDefault());
        document.addEventListener('click', (e) => {
           let target = e.target;
           while (target && target !== document) {
              if (target.tagName === 'A' && target.hasAttribute('href') && !target.getAttribute('href').startsWith('#')) {
                 e.preventDefault();
                 console.log("IRIS-TS: Prevented external navigation to " + target.getAttribute('href'));
              }
              target = target.parentNode;
           }
        });

        /* IRIS-TS LIVE EDIT MESSAGE RECEIVER */
        window.addEventListener('message', (event) => {
           if (event.data.type === 'TOGGLE_EDIT_MODE') {
               const isEditMode = event.data.value;
               
               const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button');
               textElements.forEach(el => {
                   if(isEditMode) {
                       el.setAttribute('contenteditable', 'true');
                       el.classList.add('iris-editable');
                   } else {
                       el.removeAttribute('contenteditable');
                       el.classList.remove('iris-editable');
                   }
               });

               const imageElements = document.querySelectorAll('img');
               imageElements.forEach((img, index) => {
                   if(isEditMode) {
                       img.classList.add('iris-editable-img');
                       img.dataset.irisId = 'img-' + index;
                       img.dataset.originalOnclick = img.onclick; 
                       img.onclick = (e) => {
                           e.stopPropagation();
                           e.preventDefault();
                           // Talk to Vue app to trigger Native File Upload
                           window.parent.postMessage({ type: 'TRIGGER_IMAGE_UPLOAD', id: img.dataset.irisId }, '*');
                       };
                   } else {
                       img.classList.remove('iris-editable-img');
                       img.onclick = img.dataset.originalOnclick || null;
                   }
               });
           }
           if (event.data.type === 'UPDATE_IMAGE_SRC') {
               const img = document.querySelector(\`[data-iris-id="\${event.data.id}"]\`);
               if (img) {
                   img.src = event.data.base64; // Fallback to instant base64 preview rendering
                   img.setAttribute('data-actual-src', event.data.src); // Map true relative path for deployment
                   syncToParent();
               }
           }
        });
      <\/script>
    </body>
  `;
  sourceHTML = sourceHTML.replace(/<\/body>/i, advancedScript);

  iframeSrcDoc.value = sourceHTML;
}, { deep: true })

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        const button = document.activeElement as HTMLButtonElement;
        if(button && button.tagName === 'BUTTON') {
             const originalText = button.innerHTML;
             button.innerHTML = '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> COPIED!';
             button.classList.add('text-emerald-400', 'border-emerald-500/50');
             setTimeout(() => {
                 button.innerHTML = originalText;
                 button.classList.remove('text-emerald-400', 'border-emerald-500/50');
             }, 2000);
        }
    } catch(e) {
        alert('Failed to copy to clipboard');
    }
}

watch(showDeployModal, (newVal) => {
   if(newVal) {
       deploymentSuccessUrl.value = '';
   } 
});

onMounted(() => {
  window.addEventListener('message', handleIframeMessage)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  stopCamera()
  window.removeEventListener('message', handleIframeMessage)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  // Only warn if they actually have generated architecture that could be lost
  if (generatedFiles.value.length > 0) {
    e.preventDefault();
    // Setting returnValue to any string triggers the browser's native confirmation dialog
    // Note: Modern browsers ignore the custom string and show a generic warning
    e.returnValue = 'You have unsaved generated architecture. Are you sure you want to leave? All data will be lost.';
    return e.returnValue;
  }
}

const handleIframeMessage = (e: MessageEvent) => {
  if (e.data.type === 'SYNC_HTML') {
    const htmlFile = generatedFiles.value.find(f => f.name.endsWith('.html'));
    if (htmlFile && htmlFile.content !== e.data.html) {
      isSyncingFromIframe.value = true;
      htmlFile.content = e.data.html;
      // Allow the dom changes to settle before responding to further watch cycles
      setTimeout(() => isSyncingFromIframe.value = false, 150);
    }
  } else if (e.data.type === 'TRIGGER_IMAGE_UPLOAD') {
    pendingImageTargetId.value = e.data.id;
    assetUploadRef.value?.click();
  }
}

const iframeRef = ref<HTMLIFrameElement | null>(null)
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  
  if (iframeRef.value && iframeRef.value.contentWindow) {
    // Send standard postMessage to iframe directly to trigger DOM updates without reloading framework
    iframeRef.value.contentWindow.postMessage({
      type: 'TOGGLE_EDIT_MODE',
      value: isEditMode.value
    }, '*')
  }
}


</script>

<style>
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(1000%); } 
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-textarea::-webkit-scrollbar { width: 6px; }
.custom-textarea::-webkit-scrollbar-track { background: transparent; }
.custom-textarea::-webkit-scrollbar-thumb { background-color: rgba(16, 185, 129, 0.2); border-radius: 20px; }
.custom-textarea::-webkit-scrollbar-thumb:hover { background-color: rgba(16, 185, 129, 0.5); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
