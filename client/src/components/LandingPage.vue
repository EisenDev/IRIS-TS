<template>
  <div class="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span class="text-xl font-black tracking-tight bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text">IRIS-TS</span>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#vision" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Vision</a>
          <button @click="$emit('enter')" class="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-slate-200 transition-all active:scale-95">
            Launch Engine
          </button>
        </div>

        <button @click="$emit('enter')" class="md:hidden p-2 text-slate-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-32 pb-20 px-6 overflow-hidden">
      <!-- Background Glows -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[120px] rounded-full -z-10"></div>

      <div class="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8 animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next Gen Frontend Synthesis
        </div>

        <h1 class="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1] max-w-4xl">
          Synthesize <span class="bg-gradient-to-tr from-indigo-500 via-purple-400 to-fuchsia-500 text-transparent bg-clip-text">Visual Worlds</span> with AI.
        </h1>
        
        <p class="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">
          IRIS-TS is a high-fidelity visual code synthesizer that transforms static imagery and conceptual prompts into production-ready front-end architectures in seconds.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <button 
            @click="$emit('enter')" 
            class="group relative px-8 py-4 bg-white text-black font-black text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/50 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            Start Scanning
          </button>
          
          <a 
            href="#features" 
            class="px-8 py-4 bg-white/5 text-white font-bold text-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
          >
            How it works
          </a>
        </div>

        <!-- Dashboard Preview Mockup -->
        <div class="mt-24 relative w-full max-w-5xl group">
             <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent blur-3xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity"></div>
             <div class="rounded-3xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl p-2 shadow-2xl overflow-hidden aspect-video">
                <div class="w-full h-full rounded-2xl bg-[#05080F] flex items-center justify-center relative overflow-hidden">
                    <!-- Fake UI Elements -->
                    <div class="absolute top-4 left-4 flex gap-2">
                        <div class="w-3 h-3 rounded-full bg-rose-500/50"></div>
                        <div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
                        <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                    </div>
                    
                    <!-- Inner Grid Layout -->
                    <div class="grid grid-cols-12 gap-4 w-full h-full p-8 pt-12">
                        <!-- Sidebar -->
                        <div class="col-span-3 flex flex-col h-full gap-4">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Assets</div>
                            
                            <div class="h-28 w-full rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center group/upload cursor-pointer hover:bg-indigo-500/20 transition-colors">
                                <svg class="w-6 h-6 text-indigo-400 mb-2 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <div class="text-[10px] text-indigo-300 font-medium">Upload Image</div>
                            </div>

                            <div class="flex-1 w-full rounded-xl bg-white/5 border border-white/5 p-3 flex flex-col gap-2 overflow-y-auto">
                                <div class="text-[10px] text-slate-500 font-mono">Elements Identified</div>
                                <div class="w-full py-1.5 px-2 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 flex items-center gap-2"><svg class="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg> Header Nav</div>
                                <div class="w-full py-1.5 px-2 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 flex items-center gap-2"><svg class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Hero Banner</div>
                                <div class="w-full py-1.5 px-2 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 flex items-center gap-2"><svg class="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Features Section</div>
                                <div class="w-full py-1.5 px-2 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 flex items-center gap-2 opacity-50"><svg class="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/></svg> Call to Action</div>
                            </div>
                            
                            <div class="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] cursor-pointer hover:opacity-90 transition-opacity">
                                Generate Component
                            </div>
                        </div>

                        <!-- Main Canvas -->
                        <div class="col-span-9 flex flex-col gap-4 h-full">
                            <div class="h-10 w-full rounded-xl bg-black/40 border border-white/10 flex items-center px-4 gap-3">
                                <div class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                <div class="text-[10px] text-slate-300 font-mono tracking-wide flex-1">Synthesizing modern landing page variant...</div>
                                <div class="text-[9px] text-indigo-300 font-mono border border-indigo-500/30 px-2 py-0.5 rounded bg-indigo-500/10 hidden sm:block">Vue 3 + Tailwind</div>
                            </div>
                            
                            <div class="flex-1 w-full rounded-xl bg-[#030712] border border-white/10 shadow-inner relative overflow-hidden flex flex-col">
                                <!-- Generated Preview Mockup -->
                                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712] to-[#030712]"></div>
                                
                                <div class="relative z-10 w-full h-full p-6 flex flex-col">
                                    <!-- Mock Nav -->
                                    <div class="flex justify-between items-center mb-6">
                                        <div class="text-white font-bold text-xs tracking-tight flex items-center gap-2">
                                            <div class="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-cyan-400"></div>
                                            KAIROS<span class="text-indigo-400">.ai</span>
                                        </div>
                                        <div class="flex gap-4 items-center">
                                            <div class="text-[8px] text-slate-400 hover:text-white cursor-pointer transition-colors">Vision</div>
                                            <div class="text-[8px] text-slate-400 hover:text-white cursor-pointer transition-colors">Features</div>
                                            <div class="text-[8px] bg-white text-black px-3 py-1 rounded-full font-bold cursor-pointer">Start</div>
                                        </div>
                                    </div>
                                    
                                    <!-- Mock Hero Content -->
                                    <div class="flex-1 flex items-center gap-6 mt-[-1rem]">
                                        <div class="w-1/2 space-y-4">
                                            <div class="inline-block px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[7px] text-indigo-300 font-bold uppercase tracking-widest backdrop-blur-sm">System Update 2.0</div>
                                            <div class="text-2xl font-black text-white leading-tight">Build the <span class="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">Future</span><br/>of Data.</div>
                                            <div class="text-[9px] text-slate-400 leading-relaxed max-w-[90%] font-medium">Accelerate your workflow with AI-driven insights and real-time frontend synthesis.</div>
                                            <div class="flex gap-2">
                                                <div class="h-6 w-24 rounded-md bg-white text-black text-[9px] font-bold flex items-center justify-center cursor-pointer">Launch Engine</div>
                                            </div>
                                        </div>
                                        
                                        <!-- Image Mock -->
                                        <div class="w-1/2 relative h-[140px] flex items-center justify-center">
                                            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-fuchsia-500/30 rounded-xl blur-md"></div>
                                            <div class="relative w-full h-full rounded-lg border border-white/10 overflow-hidden bg-slate-800 flex flex-col shadow-2xl">
                                                <div class="h-4 bg-black/40 border-b border-white/10 flex items-center px-2 gap-1.5">
                                                    <div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                    <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                </div>
                                                <div class="flex-1 p-0 m-0">
                                                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Dashboard" class="w-full h-full object-cover opacity-90 grayscale-[20%]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Synth Overlay Scanner Effect -->
                                <div class="absolute inset-0 overflow-hidden pointer-events-none rounded-xl z-20">
                                    <div class="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] opacity-70 animate-[scan_3s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </main>

    <!-- Features Grid -->
    <section id="features" class="py-32 px-6 relative">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-6">Built for the <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">Modern Architect</span></h2>
          <p class="text-slate-400 font-medium text-lg max-w-2xl mx-auto">Skip the boilerplate and dive straight into assembly. IRIS-TS handles the heavy lifting of UI synthesis.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all hover:translate-y-[-4px] group">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Visual-to-Code</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Capture any webpage, sketch, or design and let our engine extract the structural DNA to build clean, functional code.</p>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:translate-y-[-4px] group">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Atmosphere Engine</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Our proprietary engine doesn't just copy; it understands aesthetics, color theory, and modern UI patterns to create unique variants.</p>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all hover:translate-y-[-4px] group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Edge Deployment</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Instantly deploy your synthesized creations to Vercel with a single click. Go from concept to live URL in under 2 minutes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section id="vision" class="py-32 px-6 bg-white/[0.02]">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-[10px] uppercase font-bold tracking-[0.4em] text-indigo-400 mb-8">The Philosophy</h2>
            <blockquote class="text-3xl md:text-5xl font-black text-white italic leading-tight mb-12">
                "We believe the barrier between design and implementation should be as thin as a single breath of AI."
            </blockquote>
            <p class="text-slate-500 font-mono text-sm">— EisenDev / IRIS Core</p>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-20 px-6 border-t border-white/5">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2 grayscale brightness-50">
          <div class="w-6 h-6 rounded bg-white flex items-center justify-center">
            <svg class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <span class="text-sm font-bold tracking-tighter text-white">IRIS Synth Engine</span>
        </div>
        
        <div class="text-slate-600 text-[10px] uppercase font-bold tracking-widest">
          &copy; 2026 EISENDEV. ALL RIGHTS RESERVED.
        </div>
        
        <div class="flex gap-4 md:gap-6 items-center">
          <a href="https://arjayescabas.me/" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-wider uppercase">Portfolio</a>
          <a href="https://v2.onlinejobs.ph/jobseekers/info/4691563" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-colors text-xs font-bold tracking-wider uppercase">OnlineJobs.ph</a>
          <a href="https://github.com/EisenDev" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/arjay-escabas-8a30413a0/" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineEmits(['enter'])
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

@keyframes scan {
  0% { top: -10%; opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { top: 110%; opacity: 0; }
}

.animate-scan {
  animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
</style>
